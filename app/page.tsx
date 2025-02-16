"use client";

import AddBoard from "@/app/components/AddBoard";
import BoardComponent from "@/app/components/Board";
import BoardList from "@/app/components/BoardList";
import Todo from "@/app/components/Todo";
import { Board, DraggableData, Todo as TodoType } from "@/app/type";
import {
  findBoardById,
  findTodoById,
  getInitialState,
  STORAGE_KEY,
  todoReducer,
} from "@/app/utils";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useReducer, useState } from "react";

export default function Home() {
  const [boards, dispatch] = useReducer(
    todoReducer,
    undefined,
    getInitialState
  );

  // 현재 드래그 중인 Todo, Board
  const [activeTodo, setActiveTodo] = useState<TodoType | null>(null);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);

  // dnd-kit 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  /**
   * drag 시작할때 처리
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "todo") {
      const todo = findTodoById(boards, active.id.toString());
      setActiveTodo(todo);
    } else if (active.data.current?.type === "board") {
      // board인 경우
      const board = findBoardById(boards, active.id.toString());
      setActiveBoard(board);
    }
  };

  // 보드 드래그 종료 처리 함수
  const handleBoardDragEnd = (
    active: DragEndEvent["active"],
    over: DragEndEvent["over"]
  ) => {
    if (active.id !== over!.id) {
      dispatch({
        type: "REORDER_BOARDS",
        activeId: active.id.toString(),
        overId: over!.id.toString(),
      });
    }
  };

  // 투두 드래그 종료 처리 함수
  const handleTodoDragEnd = (
    active: DragEndEvent["active"],
    over: DragEndEvent["over"]
  ) => {
    // active는 반드시 todo 타입임을 가정
    const activeData = active.data.current as { type: "todo"; boardId: string };
    const sourceBoardId = activeData.boardId;
    let targetBoardId: string;
    let overTodoId: string | null = null;

    if (over && over.data.current) {
      const overData = over.data.current as DraggableData;
      if (overData.type === "todo") {
        targetBoardId = (overData as { type: "todo"; boardId: string }).boardId;
        overTodoId = over.id.toString();
      } else if (overData.type === "todoContainer") {
        targetBoardId = (overData as { type: "todoContainer"; boardId: string })
          .boardId;
      } else {
        targetBoardId = over.id.toString();
      }
    } else {
      return;
    }

    if (sourceBoardId === targetBoardId) {
      if (overTodoId) {
        dispatch({
          type: "REORDER_TODOS",
          boardId: sourceBoardId,
          activeId: active.id.toString(),
          overId: overTodoId,
        });
      }
    } else {
      dispatch({
        type: "MOVE_TODO",
        sourceBoardId,
        targetBoardId,
        todoId: active.id.toString(),
        overId: overTodoId || "",
      });
    }
  };

  /**
   * drag 끝났을때 처리
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // drag가 끝나면 현재 drag 중인 todo, board 해제
    setActiveTodo(null);
    setActiveBoard(null);

    // 위치가 올바르지 않으면 종료
    if (!over) return;
    const activeData = active.data.current as DraggableData;
    const overData = over.data.current as DraggableData;

    if (activeData.type === "board" && overData.type === "board") {
      handleBoardDragEnd(active, over);
    } else if (activeData.type === "todo") {
      handleTodoDragEnd(active, over);
    }
  };

  // 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
  }, [boards]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* 드래그 할때의 Todo, Board 애니메이션 처리 */}
      <DragOverlay>
        {activeTodo ? (
          <Todo
            todo={activeTodo}
            boardId="nothing"
            onDelete={() => {}}
            onUpdate={() => {}}
            dispatch={() => {}}
          />
        ) : activeBoard ? (
          <BoardComponent board={activeBoard} dispatch={() => {}} />
        ) : null}
      </DragOverlay>

      <div className="flex flex-col w-full gap-6 items-center h-screen p-4 max-w-[2000px] mx-auto">
        {/* Todolist 헤더 부분 */}
        <AddBoard dispatch={dispatch} />

        {/* board list */}
        <BoardList boards={boards} dispatch={dispatch} />
      </div>
    </DndContext>
  );
}
