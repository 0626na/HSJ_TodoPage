# 프론트엔드 과제 (한석진) Todo Board Project

이 프로젝트는 Next.js, TypeScript, Tailwind CSS, 그리고 dnd-kit을 사용하여 보드와 투두(Todo)를 드래그 앤 드롭으로 자유롭게 이동, 재정렬 및 관리할 수 있는 Todo 보드 애플리케이션입니다.

## 구현 조건

### 기본 요건

1. 데이터 저장을 위해서 Local/Session Storage등 자유로이 사용 가능합니다.
2. 프로젝트는 Next.js (14.x.x ~ 15.x.x)로 구현해야 합니다.
3. 스타일링은 Tailwind CSS (3.x.x)를 사용해야 합니다.
4. 프로젝트는 반드시 Typescript를 사용해야 합니다.
5. 라이브러리는 자유롭게 사용할 수 있습니다.

### To-Do 보드

1. 보드를 생성할 수 있어야 합니다.
2. 보드를 수정할 수 있어야 합니다.
3. 보드를 삭제할 수 있어야 합니다.
4. 보드의 순서를 변경할 수 있어야 합니다.

### To-Do 할일

1. 할 일은, 하나의 텍스트 박스를 가집니다.
2. 보드 안에서, 할 일을 생성할 수 있어야 합니다.
3. 보드 안에서, 할 일을 삭제할 수 있어야 합니다.
4. 보드 안에서, 할 일의 내용을 수정할 수 있어야 합니다.
5. 할 일의 위치를 변경할 수 있어야 한다. (보드간의 할 일 위치, 보드 내에서의 할 일 위치)

### 주요 기능

• 보드 추가/삭제: 사용자가 새 보드를 추가하고, 기존 보드를 삭제할 수 있습니다.
• 투두 추가/삭제/수정: 각 보드 내에서 투두 항목을 추가, 삭제 및 수정할 수 있습니다.
• 보드 순서 변경: 보드 간의 순서를 드래그 앤 드롭으로 변경할 수 있습니다.
• 보드 내 투두 재정렬: 각 보드 내부에서 투두 항목의 순서를 드래그 앤 드롭으로 변경할 수 있습니다.
• 보드 간 투두 이동: 투두 항목을 다른 보드로 이동할 수 있습니다.
• DragOverlay를 통한 미리보기: 드래그 중인 요소(보드/투두)를 오버레이로 표시하여 사용자가 드래그 중인 항목을 명확하게 확인할 수 있습니다.

## 폴더 구조 및 파일 역할

```markdown
/app
├── components
│ ├── Board.tsx // 보드 컴포넌트: 보드 내 투두 추가, 수정, 삭제 및 투두 재정렬 기능 구현
│ ├── BoardList.tsx // 전체 보드 목록을 렌더링하는 컴포넌트 (SortableContext를 통해 보드 순서 변경 처리)
│ ├── Todo.tsx // 개별 투두 항목 컴포넌트: 투두 수정, 삭제, 드래그 앤드 드롭 기능 구현
│ └── AddBoard.tsx // 신규 보드 추가 컴포넌트
├── globals.css // 전역 스타일 (Tailwind CSS 설정 포함)
├── layout.tsx // Next.js 글로벌 레이아웃 파일
├── page.tsx // 최상위 페이지: DndContext, DragOverlay, 보드 추가 입력 및 전체 보드 목록 렌더링
├── type.ts // TypeScript 타입 정의 파일 (Board, Todo, Action 등)
└── utils.ts // 유틸리티 파일: localStorage 연동, 초기 상태(getInitialState) 및 todoReducer (상태 업데이트 로직)
```

## 주요 폴더/파일 역할

### app/page.tsx

최상위 페이지로, DndContext를 사용하여 전체 드래그 앤드 드롭 기능을 설정합니다.
SortableContext를 사용해 보드 목록(보드 순서 변경)을 관리하며, 보드 추가 입력과 DragOverlay를 통한 미리보기를 포함합니다.

### app/components/Board.tsx (또는 BoardComponent.tsx)

개별 보드를 렌더링하며, 보드 내부에 투두 추가 입력, 투두 목록 렌더링, 그리고 투두 목록 영역을 droppable 컨테이너로 설정합니다.
보드 컴포넌트는 useSortable 훅을 통해 드래그가 가능하며, animateLayoutChanges 옵션을 사용해 애니메이션 효과를 제어합니다.
보드 내 투두 목록은 별도의 SortableContext를 사용하여 투두 재정렬과 보드 간 투두 이동을 지원합니다.

### app/components/Todo.tsx

개별 투두 항목을 렌더링합니다.
useSortable 훅을 사용해 투두 항목에 대한 드래그 앤드 드롭 기능을 제공합니다.
수정/삭제 기능 및 드래그 중 원본 요소 숨기기(예: 드래그 중 opacity 0 적용) 등의 UI 처리가 되어 있습니다.

### app/type.ts

Board, Todo와 같은 데이터 모델과 Action 타입을 정의하여, 타입 안정성과 코드 가독성을 높입니다.

### app/utils.ts

localStorage에서 초기 상태를 불러오는 함수(getInitialState)와, useReducer에서 사용할 todoReducer를 정의합니다.
todoReducer는 보드/투두 생성, 수정, 삭제, 재정렬, 보드 간 투두 이동 등의 액션을 처리합니다.

## 로직 구조

### 드래그 앤 드롭 처리

- DndContext
  - 최상위 페이지에서 DndContext를 사용하여 전체 드래그 앤드 드롭 이벤트를 관리합니다.
  - 센서(PointerSensor)를 통해 드래그 시작 조건(예: activationConstraint)을 설정하며, collisionDetection 전략(rectIntersection, closestCenter 등)을 사용합니다.

### SortableContext

- 보드 목록과 각 보드 내 투두 목록에 각각 SortableContext를 적용하여 해당 영역 내의 요소 순서를 관리합니다.
- 각 draggable 요소(Board, Todo)는 useSortable 훅을 사용하여 자신의 드래그 상태(위치, transform, transition 등)를 관리합니다.
- animateLayoutChanges 옵션을 통해 드래그 중 라이브 리오더링을 방지하거나 커스텀 애니메이션 효과를 적용할 수 있습니다.

### DragOverlay

- 드래그 중인 요소의 미리보기를 표시하기 위해 DragOverlay를 사용합니다.
- onDragStart 이벤트에서 드래그되는 요소가 board인지 todo인지를 구분하여, activeBoard 또는 activeTodo 상태에 저장하고, DragOverlay에서 해당 미리보기를 렌더링합니다.

### 상태 관리

- useReducer 및 todoReducer
  - 앱 전반의 보드 및 투두 상태는 useReducer와 todoReducer를 통해 관리합니다.
  - 액션 타입에 따라 보드/투두 생성, 수정, 삭제, 재정렬, 보드 간 투두 이동 등의 상태 업데이트 로직이 포함되어 있습니다.
  - 상태는 localStorage와 연동되어 새로고침 시에도 데이터를 유지합니다.

### 레이아웃 및 스타일

- Tailwind CSS
  - 전체 레이아웃은 flex와 grid를 사용하여 구성되어 있으며, 각 컴포넌트에 고정 높이, 최소/최대 너비, gap 등을 지정해 레이아웃 안정성을 유지합니다.
  - Hover 효과, 그림자, 변환(translate) 등의 클래스를 사용해 입체감 및 부드러운 애니메이션 효과를 적용합니다.
  - 드래그 중에는 원본 요소를 숨기고 DragOverlay로 미리보기를 보여주는 스타일을 적용합니다.
