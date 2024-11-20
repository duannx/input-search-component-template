import TodoFilterOption from "./TodoFilterOption";
import TodoItem from "./TodoItem";
import "./todoMVC.scss";
import { useEffect, useState } from "react";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
}

export interface ITodoListProps {
  value: string;
  isCompleted: boolean;
  id: number;
}

let isTheFirstHit = true;

const TodoMVC = () => {
  const [todoList, setTodoList] = useState<ITodoListProps[]>([]);
  const [todoCompletedList, setTodoCompletedList] = useState<ITodoListProps[]>(
    []
  );
  const [todoInCompleteList, setTodoInCompleteList] = useState<
    ITodoListProps[]
  >([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [todoListToShow, setTodoListToShow] = useState("All");
  const [isCheckedAll, setIsCheckedAll] = useState<boolean>(
    isTheFirstHit && !todoList.some((todo) => !todo.isCompleted)
  );
  const listStatus = ["All", "Active", "Completed"];

  const handleInput = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
      | React.BaseSyntheticEvent<HTMLInputElement>
  ) => {
    if (e.type === "change") {
      setInputValue(e.target.value);
    }

    if (e.type === "keydown" && (e as React.KeyboardEvent).key === "Enter") {
      if (!e?.target?.value) return;
      const preparedTodoTask = {
        isCompleted: false,
        value: e?.target?.value,
        id: Math.floor(Math.random() * 1000) + 1,
      };
      setTodoList((prevState) => [...prevState, preparedTodoTask]);
      setInputValue("");
    }
  };

  const onChangingTodoTaskStatus = (id: number) => {
    if (!todoList?.length) return;
    setTodoList((prevState) =>
      prevState.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const onRemovingTodoTask = (id: number) => {
    if (!todoList?.length) return;
    setTodoList((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  const onClearingCompleteTask = () => {
    setTodoList((prevState) => prevState.filter((todo) => !todo.isCompleted));
  };

  const onFilteringTodoTask = (type = "All") => {
    console.log(type);

    switch (type) {
      case "Active":
        setTodoListToShow("Active");
        break;
      case "Completed":
        setTodoListToShow("Completed");
        break;

      default:
        setTodoListToShow("All");
        break;
    }
  };

  const onMarkDoneAllTasks = () => {
    if (isTheFirstHit) {
      setIsCheckedAll(true);
      setTodoList((prevState) =>
        prevState.map((todo) => {
          return { ...todo, isCompleted: true };
        })
      );
      isTheFirstHit = false;
    } else {
      setIsCheckedAll(!isCheckedAll);
      setTodoList((prevState) =>
        prevState.map((todo) => {
          return { ...todo, isCompleted: !isCheckedAll };
        })
      );
    }
  };

  const onChangingTodoTaskValue = (id: number, value: string) => {
    setTodoList((prevState) =>
      prevState.map((todo) =>
        todo.id === id ? { ...todo, value: value } : todo
      )
    );
  };

  useEffect(() => {
    const itemTodoList = JSON.parse(
      localStorage.getItem("todoList") as string
    ) as ITodoListProps[];
    if (itemTodoList) {
      setTodoList(itemTodoList);
    }
  }, []);

  useEffect(() => {
    localStorage?.setItem("todoList", JSON.stringify(todoList));
    if (!todoList?.length) return;
    setTodoCompletedList(todoList.filter((todo) => todo.isCompleted));
    setTodoInCompleteList(todoList.filter((todo) => !todo.isCompleted));
  }, [todoList]);

  // Your code start here
  return (
    <div className={"todo-mvc-component"}>
      <div className={"todo-mvc-component__input--wrapper"}>
        <div
          className={"todo-mvc-component__tick-all-btn"}
          onClick={() => {
            onMarkDoneAllTasks();
          }}
        ></div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleInput}
          className={"todo-mvc-component__input"}
          placeholder="What needs to be done?"
        />
      </div>
      {!!todoList?.length && (
        <div className={"todo-mvc-component__todo-list"}>
          {!!listStatus?.length &&
            listStatus.map((status) => {
              const isShow = todoListToShow === status;
              const newTodoList =
                todoListToShow === "All"
                  ? todoList
                  : todoListToShow === "Active"
                  ? todoInCompleteList
                  : todoCompletedList;
              return (
                isShow &&
                !!newTodoList?.length &&
                newTodoList.map((item) => {
                  return (
                    <TodoItem
                      todoItem={item}
                      onChangingTodoTaskStatus={onChangingTodoTaskStatus}
                      onRemovingTodoTask={onRemovingTodoTask}
                      key={item.id}
                      onChangingTodoTaskValue={onChangingTodoTaskValue}
                    />
                  );
                })
              );
            })}
          <div className={"todo-mvc-component__footer"}>
            <div className={"todo-mvc-component__item-count"}>
              {todoInCompleteList?.length || 0}&nbsp;item
              {todoInCompleteList.length > 1 ? "s" : ""} left!
            </div>
            <div className={"todo-mvc-component__filters"}>
              {!!listStatus?.length &&
                listStatus.map((status) => {
                  return (
                    <TodoFilterOption
                      isActive={todoListToShow === status}
                      todoListToShow={status}
                      onFilteringTodoTask={onFilteringTodoTask}
                    />
                  );
                })}
            </div>
            <div
              className={"todo-mvc-component__clear-complete-btn"}
              onClick={onClearingCompleteTask}
            >
              Clear completed
            </div>
          </div>
        </div>
      )}
    </div>
  );
  // Your code end here
};

export default TodoMVC;
