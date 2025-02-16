import Todo from "@/app/components/Todo";
import { Action, Board } from "@/app/type";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { XCircleIcon } from "@heroicons/react/24/solid";

const BoardComponent = ({
  board,
  dispatch,
}: {
  board: Board;
  dispatch: React.Dispatch<Action>;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: board.id,
    data: { type: "board" },
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 300ms ease",
    opacity: isDragging ? 0 : 1,
  };

  const [newTodoText, setNewTodoText] = useState("");
  // 내부 투두 정렬: 각 투두의 id 배열
  const todoIds = board.todos.map((todo) => todo.id);

  //Todo 추가 함수
  const handleTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key !== "Enter") return;
    const text = newTodoText.trim();
    if (!text) return;

    dispatch({ type: "ADD_TODO", text, boardId: board.id });
    setNewTodoText("");
  };

  //Todo 삭제 함수
  const handleDeleteTodo = (id: string) => {
    dispatch({ type: "DELETE_TODO", todoId: id, boardId: board.id });
  };

  //보드 삭제 함수
  const handleBoardDelete = (boardId: string) => {
    dispatch({
      type: "DELETE_BOARD",
      boardId,
    });
  };

  // 보드의 투두 영역을 droppable로 만들기 위해 useDroppable 사용
  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: board.id + "-todoContainer",
    data: { type: "todoContainer", boardId: board.id },
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border border-gray-300 bg-background p-4 h-96 w-full rounded-lg"
    >
      {/* 보드 삭제 */}
      <div className="flex justify-end">
        <XCircleIcon
          onClick={() => handleBoardDelete(board.id)}
          className="size-5"
        />
      </div>

      <h2 className="font-bold text-lg mb-2">{board.title}</h2>

      {/* Todo 신규 추가 */}
      <input
        type="text"
        placeholder="새 할일 입력"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.currentTarget.value)}
        onKeyDown={handleTodoKeyDown}
        className="p-2 border-b text-foreground focus:outline-none focus:ring-0 rounded w-full mb-2 bg-transparent"
      />

      {/* TodoList */}
      <div ref={setDroppableNodeRef} className="h-60 overflow-y-auto">
        <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-y-1">
            {board.todos.map((todo) => (
              <Todo
                key={todo.id}
                boardId={board.id}
                todo={todo}
                onDelete={() => handleDeleteTodo(todo.id)}
                onUpdate={(text) =>
                  dispatch({
                    type: "UPDATE_TODO",
                    boardId: board.id,
                    todoId: todo.id,
                    text,
                  })
                }
                dispatch={dispatch}
              />
            ))}
          </ul>
        </SortableContext>
      </div>
    </div>
  );
};

export default BoardComponent;
