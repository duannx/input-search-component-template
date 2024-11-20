import "./todoMVC.scss";

interface ITodoFilterOptionProps {
  onFilteringTodoTask: (id: string) => void;
  todoListToShow: string;
  isActive: boolean;
}

const TodoFilterOption = ({
  onFilteringTodoTask,
  todoListToShow = '',
  isActive = false,
}: ITodoFilterOptionProps) => {
  console.log(todoListToShow);
  
  return (
    <div
    className={`${"todo-mvc-component__filter"} ${
      isActive ? "active" : ""
    }`}
    onClick={() => {
      onFilteringTodoTask(todoListToShow);
    }}
  >
    {todoListToShow}
  </div>
  );
};

export default TodoFilterOption;
