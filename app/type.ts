export interface Todo {
  id: string;
  text: string;
}

export interface Board {
  id: string;
  title: string;
  todos: Todo[];
}

export type Action =
  | { type: "ADD_BOARD"; title: string }
  | { type: "DELETE_BOARD"; boardId: string }
  | { type: "ADD_TODO"; boardId: string; text: string }
  | { type: "DELETE_TODO"; boardId: string; todoId: string }
  | {
      type: "UPDATE_TODO";
      boardId: string;
      todoId: string;
      text: string;
    };
