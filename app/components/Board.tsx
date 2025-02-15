import Todo from "@/app/components/Todo";
import { Action, Board } from "@/app/type";
import { useState } from "react";

const BoardComponent = ({
  board,
  dispatch,
}: {
  board: Board;
  dispatch: React.Dispatch<Action>;
}) => {
  const [newTodoText, setNewTodoText] = useState("");

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

  return (
    <div className="border border-gray-300 rounded p-4 min-h-80">
      <div className="flex justify-end">
        <button onClick={() => handleBoardDelete(board.id)}>삭제</button>
      </div>
      <h2 className="font-bold text-lg mb-2">{board.title}</h2>
      <input
        type="text"
        placeholder="새 할일 입력"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.currentTarget.value)}
        onKeyDown={handleTodoKeyDown}
        className="p-2 border border-gray-200 rounded w-full mb-2"
      />
      <div className="h-60 overflow-y-auto">
        <ul>
          {board.todos.map((todo) => (
            <Todo
              key={todo.id}
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
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BoardComponent;
