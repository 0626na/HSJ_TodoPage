"use client";

import BoardComponent from "@/app/components/Board";
import { getInitialState, STORAGE_KEY, todoReducer } from "@/app/utils";
import { useEffect, useReducer, useState } from "react";

export default function Home() {
  const [boards, dispatch] = useReducer(
    todoReducer,
    undefined,
    getInitialState
  );

  const [newBoardTitle, setNewBoardTitle] = useState("");

  // 보드 추가 함수
  const handleBoardKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter 키 눌렀을 때만 처리
    if (e.nativeEvent.isComposing || e.key !== "Enter") return;

    const title = newBoardTitle.trim();
    if (!title) return;

    dispatch({ title, type: "ADD_BOARD" });
    setNewBoardTitle("");
  };

  // 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
  }, [boards]);

  return (
    <div className="flex flex-col h-screen p-4 max-w-screen-2xl mx-auto">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold mb-4">보드 추가</h1>
        <input
          type="text"
          placeholder="새 보드 제목을 입력하세요"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.currentTarget.value)}
          onKeyDown={handleBoardKeyDown}
          className="p-1 border border-gray-300 rounded w-full mb-4"
        />
      </div>

      <div className="overflow-y-auto w-full grid items-start gap-4 md:grid-cols-4 xl:grid-cols-6 mt-2">
        {boards.map((board) => (
          <BoardComponent key={board.id} board={board} dispatch={dispatch} />
        ))}
      </div>
    </div>
  );
}
