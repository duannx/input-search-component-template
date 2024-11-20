import { useState } from "react";
import { ITodoListProps } from ".";
import "./todoMVC.scss";

interface ITodoItemProps {
  todoItem: ITodoListProps;
  onChangingTodoTaskStatus: (id: number) => void;
  onRemovingTodoTask: (id: number) => void;
  onChangingTodoTaskValue: (id: number, value: string) => void;
}

const TodoItem = ({
  todoItem,
  onChangingTodoTaskStatus,
  onRemovingTodoTask,
  onChangingTodoTaskValue,
}: ITodoItemProps) => {
  const [isDoubleClicked, setIsDoubleClicked] = useState<boolean>(false);

  const handleOnDoubleClickTodoItem = (e: React.UIEvent) => {
    if (e.detail === 2) {
      console.log("double click");
      setIsDoubleClicked(true);
      setTimeout(() => {
        document.getElementById(`todo-label-${todoItem.id}`)?.focus();
      }, 300);
    }
  };

  const handleOnBlurTodoItem = () => {
    setIsDoubleClicked(false);
  };

  const handleChangeTodoItem = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
      | React.BaseSyntheticEvent<HTMLInputElement>
  ) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key === "Enter") {
      if (!e?.target?.value) return;
      if (!onChangingTodoTaskValue) return;

      onChangingTodoTaskValue(todoItem.id, e?.target?.value);
      setIsDoubleClicked(false);
    }
  };

  return (
    <div
      className={"todo-mvc-component__todo-item"}
      onClick={handleOnDoubleClickTodoItem}
    >
      {!isDoubleClicked && (
        <>
          <button
            className={"todo-mvc-component__checkbox-btn"}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();
              onChangingTodoTaskStatus(todoItem.id);
            }}
          >
            {todoItem.isCompleted ? (
              <span
                className={
                  "todo-mvc-component__checkbox-btn__icon todo-mvc-component__checkbox-btn__icon--completed"
                }
              ></span>
            ) : (
              <span
                className={
                  "todo-mvc-component__checkbox-btn__icon todo-mvc-component__checkbox-btn__icon--not-yet"
                }
              ></span>
            )}
          </button>
          <label className={"todo-mvc-component__todo-label"}>
            {todoItem.value}
          </label>
          <button
            className={"todo-mvc-component__remove-btn"}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();
              onRemovingTodoTask(todoItem.id);
            }}
          >
            &#10060;
          </button>
        </>
      )}
      {isDoubleClicked && (
        <div className={"todo-mvc-component__todo-item-input--wrapper"}>
          <input
            id={`todo-label-${todoItem.id}`}
            className={"todo-mvc-component__todo-item-input"}
            onBlur={handleOnBlurTodoItem}
            onChange={handleChangeTodoItem}
            onKeyDown={handleChangeTodoItem}
          />
        </div>
      )}
    </div>
  );
};

export default TodoItem;
