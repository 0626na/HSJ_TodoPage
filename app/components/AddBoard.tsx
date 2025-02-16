import { Action } from "@/app/type";
import { useState } from "react";

export default function AddBoard({
  dispatch,
}: {
  dispatch: React.Dispatch<Action>;
}) {
  const [newBoardTitle, setNewBoardTitle] = useState("");

  /**
   * 신규 보드 추가
   */
  const handleBoardKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter 키 눌렀을 때만 처리
    if (e.nativeEvent.isComposing || e.key !== "Enter") return;

    const title = newBoardTitle.trim();
    if (!title) return;

    dispatch({ title, type: "ADD_BOARD" });
    setNewBoardTitle("");
  };

  return (
    <div className="mt-20 max-w-[600px] flex flex-col gap-2 justify-center items-center p-4 ">
      <h1 className="text-3xl font-bold">TodoList</h1>
      <h3>
        새 보드를 추가하고 싶으면 보드의 제목을 작성하고 엔터를 눌러주세요!
      </h3>
      <div>
        <input
          type="text"
          placeholder="새 보드 제목을 입력하세요"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.currentTarget.value)}
          onKeyDown={handleBoardKeyDown}
          className="p-2 border-b rounded min-w-80 bg-transparent text-foreground focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}
