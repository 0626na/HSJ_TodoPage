import BoardComponent from "@/app/components/Board";
import { Action, Board } from "@/app/type";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

export default function BoardList({
  boards,
  dispatch,
}: {
  boards: Board[];
  dispatch: React.Dispatch<Action>;
}) {
  return (
    <div className="overflow-y-auto gap-4 w-full grid md:grid-cols-4 2xl:grid-cols-6 mt-2">
      <SortableContext
        items={boards.map((b) => b.id)}
        strategy={rectSortingStrategy}
      >
        {boards.map((board) => (
          <BoardComponent key={board.id} board={board} dispatch={dispatch} />
        ))}
      </SortableContext>
    </div>
  );
}
