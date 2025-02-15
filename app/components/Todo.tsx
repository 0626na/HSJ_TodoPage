import { useState } from "react";
import { Todo as TodoType } from "@/app/type";

interface TodoProps {
  todo: TodoType;
  onDelete: () => void;
  onUpdate: (newText: string) => void;
}

const Todo = ({ todo, onDelete, onUpdate }: TodoProps) => {
  // 수정 모드 여부를 관리하는 state
  const [isEditing, setIsEditing] = useState(false);
  // 수정 중인 값 (초기값은 현재 todo.text)
  const [editValue, setEditValue] = useState(todo.text);

  // 수정 버튼 클릭 시 수정 모드로 전환
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 취소 버튼 클릭 시 수정 취소 후 원래 상태로 복귀
  const handleCancelClick = () => {
    setEditValue(todo.text); // 수정 중 입력값을 원래 값으로 되돌림
    setIsEditing(false);
  };

  // 확인 버튼 클릭 시 수정 확정 처리
  const handleConfirmClick = () => {
    // 변경된 값이 있다면 onUpdate 호출
    if (editValue.trim() !== "" && editValue.trim() !== todo.text) {
      onUpdate(editValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <li className="flex justify-between items-center h-10 mb-1">
      {isEditing ? (
        <div className="flex items-center w-full min-w-0">
          {/* 수정 모드일 때: 입력창과 확인/취소 버튼 */}
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing || e.key !== "Enter") return;
              handleConfirmClick();
            }}
            className="w-full p-1 border border-gray-200 rounded h-full box-border"
          />
          <div className="flex space-x-2 ml-2 flex-shrink-03">
            <button
              onClick={handleConfirmClick}
              className="text-blue-500 text-sm"
            >
              확인
            </button>
            <button
              onClick={handleCancelClick}
              className="text-gray-500 text-sm"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 일반 모드일 때: todo 텍스트와 수정/삭제 버튼 */}
          <span className="whitespace-nowrap overflow-x-auto">{todo.text}</span>

          <div className="flex items-end gap-2 flex-shrink-0 pl-3">
            <button onClick={handleEditClick} className="text-blue-500 text-sm">
              수정
            </button>
            <button onClick={onDelete} className="text-red-500 text-sm">
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default Todo;
