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
    }
  | { type: "REORDER_BOARDS"; activeId: string; overId: string }
  | {
      type: "REORDER_TODOS";
      boardId: string;
      activeId: string;
      overId: string;
    }
  | {
      type: "MOVE_TODO";
      sourceBoardId: string;
      targetBoardId: string;
      todoId: string;
      overId: string;
    };

export type DraggableData =
  | { type: "board" }
  | { type: "todo"; boardId: string }
  | { type: "todoContainer"; boardId: string };
