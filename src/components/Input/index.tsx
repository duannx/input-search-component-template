import "./input.scss";
import { debounce } from "../../utils/deboucne";
import { forwardRef, useRef, useImperativeHandle, useState, useCallback } from "react";
import React from "react";

export interface InputProps  {
  /** Placeholder of the input */
  placeholder?: string;
}

export interface ITodoItem {
  id: number;
  name: string;
  status: string;
}
export interface ITodoResult {
  todoList: React.MutableRefObject<ITodoItem[]>;
  hasChange: number;
  onSelectedTodoItem: (item: ITodoItem) => void;
}

export class TodoState {
  public static todo: string = "todo";
  public static completed: string = "completed";
}

export class ActionState {
  public static all: string = "all";
  public static todo: string = "todo";
  public static completed: string = "completed";
}


const EditPanel = forwardRef(({}, ref) => {
  const currentItemRef = useRef<ITodoItem>();
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const resultPanelRef = useRef<any>();

  console.log("Render EditPanel");


  const saveEditingItem = useCallback((evt: React.KeyboardEvent | null) => {
    if(evt?.type == "keydown" && evt.key != "Enter") return;
    if(currentItemRef.current)
      currentItemRef.current.name = editInputRef.current?.value || "";

    resultPanelRef.current.forceRenderTodoList();
    setShowPanel(false);
  }, [currentItemRef.current]);

  const forceRenderEditPanel = useCallback((_item : ITodoItem, resultRef: React.MutableRefObject<any>) => {
    setShowPanel(true);
    currentItemRef.current = _item;
    if(editInputRef.current)
      editInputRef.current.value = _item.name;

    resultPanelRef.current = resultRef.current;
  }, [currentItemRef.current])

  useImperativeHandle(ref, () => ({
    forceRenderEditPanel
  }));

  return (
    <>
      <div className={`todo-edit ${showPanel ? "show" : ""}`}>
        <input ref={editInputRef} onKeyDown={(evt) => saveEditingItem(evt)} ></input>
        <button onClick={() => saveEditingItem(null)}>Save</button>
      </div>
    </>
  );

})



const TodoResult = forwardRef((props : ITodoResult, ref) => {
  console.log("Render: List component");

  const filteredList = useRef<ITodoItem[]>([]);
  const [hasChange, setChange] = useState<number>(0);
  const actionState = useRef<string>(ActionState.all);
  const countTodoRef = useRef<number>(0);

  const forceUpdate = useCallback(() => {
    setChange(new Date().getTime());
  }, [hasChange]);

  
  const setActionState = useCallback((state: string) => {
    actionState.current = state;
    forceUpdate();
    forceRenderTodoList();
  }, [hasChange]);
  
  const setItemState = useCallback((todoItem: ITodoItem) => {
    todoItem.status = todoItem.status == TodoState.completed ? TodoState.todo : TodoState.completed;
    forceUpdate();
    forceRenderTodoList();
  }, [hasChange]);

  const clearCompletedItems = useCallback(() => {
    const newList : ITodoItem[] = [];
    props.todoList.current.map((todoItem) => {
      if(todoItem.status != TodoState.completed) newList.push(todoItem);
    })
    props.todoList.current = [...newList];
    forceRenderTodoList();
  }, [hasChange]);


  const editItem = useCallback((item: ITodoItem) => {
      props.onSelectedTodoItem(item);
  }, [hasChange]);


  const removeItem = useCallback((item: ITodoItem) => {
    const newList : ITodoItem[] = [];
    props.todoList.current.map((todoItem) => {
      if(todoItem.id != item.id) newList.push(todoItem);
    })
    props.todoList.current = [...newList];
    forceRenderTodoList();
  }, [hasChange]);


  const toggleCompletedItems = useCallback(() => {
    let hasTodoItem = false;
    props.todoList.current.map((todoItem) => {
      if(todoItem.status == TodoState.todo) hasTodoItem = true;
    })

    props.todoList.current.map((todoItem) => {
      todoItem.status = hasTodoItem ? TodoState.completed : TodoState.todo;
    })

    forceRenderTodoList();
  }, [hasChange]);

  const forceRenderTodoList = useCallback(() => {
    countTodoRef.current = 0;
    filteredList.current = [];
    props.todoList.current.map((todoItem) => {
      switch(actionState.current) {
        case ActionState.all:
          filteredList.current = props.todoList.current;
          break;
        case ActionState.completed:
          if(todoItem.status == TodoState.completed) {
            filteredList.current.push(todoItem);
          }
          break;
        case ActionState.todo:
          if(todoItem.status == TodoState.todo) {
            filteredList.current.push(todoItem);
          }
          break;
      }
      if(todoItem.status == TodoState.todo) {
        countTodoRef.current += 1;
      }
    })

    localStorage.setItem("currentDataRJ", JSON.stringify(props.todoList.current));
    
    forceUpdate();
  }, [hasChange]);

  useImperativeHandle(ref, () => ({
    forceRenderTodoList
  }));

  return (
    <>
      <ul className="todo-actions">
        <li><button className={actionState.current == ActionState.all ? "selected" : ""} onClick={() => {setActionState(ActionState.all)}}>All</button></li>
        <li><button className={actionState.current == ActionState.todo ? "selected" : ""} onClick={() => {setActionState(ActionState.todo)}}>Todo</button></li>
        <li><button className={actionState.current == ActionState.completed ? "selected" : ""} onClick={() => {setActionState(ActionState.completed)}}>Completed</button></li>
        <li><button onClick={() => {clearCompletedItems()}}>Clear completed</button></li>
        <li><button onClick={() => {toggleCompletedItems()}}>Toggle mark all as completed</button></li>
      </ul>
      <ul className="todo-counter"><li>{countTodoRef.current} {countTodoRef.current > 1 ? "items" : "item"} left</li></ul>
      <ul className="todo-results">
        {filteredList.current?.length === 0 ? <li className="todo-msg">No {actionState.current != ActionState.all ? actionState.current + " " : ""}task!</li> : null}
        {hasChange
          ? filteredList.current?.map((todoItem) => (
              <li className={`todo-item ${todoItem.status == TodoState.completed ? "complete" : ""}`} key={todoItem.id}>
                <div className="todo-content-item">
                  <button onClick={() => setItemState(todoItem)}>
                    <span className="tick">🗸</span>
                    <span className="untick"> &nbsp; </span>
                  </button>
                  <span className="todo-content-text">{todoItem.name}</span> 
                </div>
                <div className="todo-action">
                  <button onClick={() => editItem(todoItem)}>🖉</button> <button onClick={() => removeItem(todoItem)}>🗙</button>
                </div>
              </li>
            ))
          : null}
      </ul>
    </>
  );
});

const Input: React.FC<InputProps> = ({ placeholder }) => {
  console.log("Render: Hold component");

  const resultRef = useRef<any>();
  const childEditPanelRef = useRef<any>();
  const todoListRef = useRef<ITodoItem[]>(JSON.parse(localStorage.getItem("currentDataRJ") || "[]"));
  const keywordsRef = useRef<HTMLInputElement>(null);
  const hasChange = useRef<number>(0);
  const selectItemRef = useRef<ITodoItem>({} as ITodoItem);

  setTimeout(() => {
    if(todoListRef.current.length) {
        resultRef.current?.forceRenderTodoList();
    }
    document.querySelector(".todo")?.classList.add("show");
  })

  // Memoized onChangeHandler
  const onChangeHandler = useCallback(
    debounce((evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === "Enter") {
        const value = (evt.target as HTMLInputElement).value;
        const time = new Date().getTime();

        keywordsRef.current && (keywordsRef.current.value = "");
        if (!value) {
          return;
        }

        const todo = {} as ITodoItem;
        todo.id = time;
        todo.name = value;
        todo.status = TodoState.todo;
        todoListRef.current.push(todo);

        resultRef.current.forceRenderTodoList();
        hasChange.current = time; // Trigger rerender for TodoResult
      }
    }, 100),
    [hasChange.current]
  );


  const onSelectedTodoItem = useCallback((item: ITodoItem) => {
      childEditPanelRef.current.forceRenderEditPanel(item, resultRef);
    },
    [selectItemRef.current]
  );

  // Prevent Input from rerendering unnecessarily
  return (
    <div className="todo">
      <input
        ref={keywordsRef}
        placeholder={placeholder}
        onKeyDown={onChangeHandler} // Using the memoized handler
      />

      <EditPanel ref={childEditPanelRef}></EditPanel>
      <TodoResult todoList={todoListRef} hasChange={hasChange.current} onSelectedTodoItem={onSelectedTodoItem} ref={resultRef}/>
    </div>
  );
};

export default Input;