"use client";

import { useState } from "react";

export default function Home() {
  const [todoList, setTodoList] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  return (
    /**
     * 초기, 기본적인 todo 추가 및 삭제 기능 구현한 상태.
     * 보드 신규 생성 및 삭제 기능을 추가할 예정.
     */
    <div>
      <h1>Todo를 입력해주세요</h1>

      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.currentTarget.value)}
        type="text"
        onKeyDown={(e) => {
          /*
           * e.nativeEvent.isComposing은 Composition 이벤트가 진행중인지를 확인하는 프로퍼티.
           * Composition 이벤트가 react rendering과 별개로 이루어져서 무작위로 이상한 값이 들어가는 경우가 있기에
           * Composition 이벤트가 진행중일때는 todo를 추가하지 않도록 설정
           */
          if (e.nativeEvent.isComposing || e.key != "Enter") return;

          setTodoList((prev) => [inputValue, ...prev]);
          setInputValue("");
        }}
        placeholder="할일을 입력하세요"
      />

      <h3>할일 목록</h3>
      <ul>
        {todoList.map((todo, index) => (
          <li key={index}>
            {todo}
            <button
              onClick={() =>
                setTodoList(todoList.filter((_item, i) => i !== index))
              }
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
