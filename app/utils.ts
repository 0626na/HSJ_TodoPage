import { Action, Board } from "@/app/type";
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
            todos: [...board.todos, { id: uuidv4(), text: action.text }],
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
  }
};
