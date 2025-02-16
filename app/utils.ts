import { Action, Board, Todo } from "@/app/type";
import { arrayMove } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";

// localStorage에 저장될 키 값
export const STORAGE_KEY = "boardsState";

/**
 * localStorage에서 초기 상태를 불러오는 함수
 */
export const getInitialState = (): Board[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  }
  // 저장된 값이 없으면 기본값 반환 (여기서는 보드를 빈 배열로 시작한다고 가정)
  return [];
};

/**
 * todo의 생성, 수정, 삭제 그리고 board의 생성과 삭제 로직을 담당하는 reducer 함수
 */
export const todoReducer = (boards: Board[], action: Action) => {
  switch (action.type) {
    case "ADD_BOARD":
      const newBoard: Board = {
        title: action.title,
        id: uuidv4(),
        todos: [],
      };
      return [...boards, newBoard];

    case "DELETE_BOARD":
      return boards.filter((board) => board.id !== action.boardId);

    case "ADD_TODO":
      return boards.map((board) => {
        if (board.id == action.boardId)
          return {
            ...board,
            todos: [{ id: uuidv4(), text: action.text }, ...board.todos],
          };

        return board;
      });

    case "DELETE_TODO":
      return boards.map((board) => {
        if (board.id == action.boardId)
          return {
            ...board,
            todos: board.todos.filter((todo) => todo.id !== action.todoId),
          };
        return board;
      });

    case "UPDATE_TODO":
      return boards.map((board) => {
        if (board.id == action.boardId)
          return {
            ...board,
            todos: board.todos.map((todo) => {
              if (todo.id == action.todoId)
                return { ...todo, text: action.text };
              return todo;
            }),
          };
        return board;
      });

    case "REORDER_BOARDS": {
      const { activeId, overId } = action;
      const oldIndex = boards.findIndex((board) => board.id === activeId);
      const newIndex = boards.findIndex((board) => board.id === overId);
      return arrayMove(boards, oldIndex, newIndex);
    }

    case "REORDER_TODOS": {
      const { boardId, activeId, overId } = action;
      return boards.map((board) => {
        if (board.id === boardId) {
          const oldIndex = board.todos.findIndex(
            (todo) => todo.id === activeId
          );
          const newIndex = board.todos.findIndex((todo) => todo.id === overId);
          return {
            ...board,
            todos: arrayMove(board.todos, oldIndex, newIndex),
          };
        }
        return board;
      });
    }

    case "MOVE_TODO": {
      const { sourceBoardId, targetBoardId, todoId, overId } = action;
      let movedTodo: Todo | null = null;
      const newBoards = boards
        .map((board) => {
          if (board.id === sourceBoardId) {
            const newTodos = board.todos.filter((todo) => {
              if (todo.id === todoId) {
                movedTodo = todo;
                return false;
              }
              return true;
            });
            return { ...board, todos: newTodos };
          }
          return board;
        })
        .map((board) => {
          if (board.id === targetBoardId && movedTodo) {
            const overIndex = board.todos.findIndex(
              (todo) => todo.id === overId
            );
            if (overIndex === -1) {
              return { ...board, todos: [...board.todos, movedTodo] };
            } else {
              const newTodos = [...board.todos];
              newTodos.splice(overIndex, 0, movedTodo);
              return { ...board, todos: newTodos };
            }
          }
          return board;
        });
      return newBoards;
    }
  }
};

/**
 * id로 board를 찾는 함수
 */
export const findBoardById = (boards: Board[], boardId: string) => {
  return boards.find((b: Board) => b.id === boardId) || null;
};

/**
 * id로 Todo 찾는 함수
 */
export const findTodoById = (boards: Board[], todoId: string) => {
  for (const board of boards) {
    const found = board.todos.find((todo: Todo) => todo.id === todoId);
    if (found) return found;
  }
  return null;
};
