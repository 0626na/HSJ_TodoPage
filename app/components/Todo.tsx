import { useState } from "react";
import { Action, Todo as TodoType } from "@/app/type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

interface TodoProps {
  todo: TodoType;
  boardId: string;
  onDelete: () => void;
  onUpdate: (newText: string) => void;
  dispatch: React.Dispatch<Action>;
}

const Todo = ({ todo, onDelete, onUpdate, boardId }: TodoProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    data: { type: "todo", boardId },
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 100ms ease",
    opacity: isDragging ? 0 : 1,
  };

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
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex justify-between items-center h-10 max-w-[300px]"
    >
      {isEditing ? (
        <div className="flex items-center w-full overflow-x-auto">
          {/* 수정 모드일 때: 입력창과 확인/취소 버튼 */}
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing || e.key !== "Enter") return;
              handleConfirmClick();
            }}
            className="w-full p-1 border-b border-gray-200 rounded box-border bg-transparent text-foreground focus:outline-none focus:ring-0"
          />
          <div className="flex space-x-2 ml-2 flex-shrink-0">
            {/* 수정 완료 */}
            <CheckIcon
              onClick={handleConfirmClick}
              className="text-blue-500 size-4"
            />

            {/* 수정 취소 */}
            <XMarkIcon
              onClick={handleCancelClick}
              className="text-red-500 size-4"
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center w-full">
          {/* 일반 모드일 때: todo 텍스트와 수정/삭제 버튼 */}
          <span className="whitespace-nowrap overflow-x-auto">{todo.text}</span>

          <div className="flex items-center gap-3 flex-shrink-0 pl-3">
            {/* 수정 */}
            <PencilSquareIcon
              className="size-4 text-blue-500"
              onClick={handleEditClick}
            />

            {/* 삭제 */}
            <TrashIcon onClick={onDelete} className="text-red-500 size-4" />
          </div>
        </div>
      )}
    </li>
  );
};

export default Todo;
