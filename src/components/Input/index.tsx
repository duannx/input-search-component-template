import "./input.scss";
import { useEffect, useRef, useState } from "react";

interface ITodo {
  title: string,
  isEditing: boolean,
  status: boolean
}

const Input = () => {
  const [todoList, setTodoList] = useState<ITodo[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>();
  const inputRef = useRef(null);

  useEffect(() => {
    // document.addEventListener('click', () => {
    //   setTodoList(prevList => prevList.map((item) => {
    //     item.isEditing = false
    //     return item
    //   }))
    // })
  }, [])

  const toggleStatusTodoItem = (itemIndex: number) => {
    setTodoList(prevList => prevList.map((item, index) => {
      if(index === itemIndex) {
        item.status = !item.status
      }
      return item
    }))
  }

  const addNewItem = (event) => {
    if (event.key === 'Enter' && event.target.value) {
      setTodoList(prevList => [...prevList, {
        title: event.target.value,
        isEditing: false,
        status: false
      }])
      setTimeout(() => {
        inputRef.current.value = '';
      })
    }
  }

  const updateItem = (itemIndex: number, itemKey, itemValue) => {
    setTodoList(prevList => prevList.map((item, index) => {
        if(index === itemIndex) {
          item[itemKey] = itemValue
        }
        return item
      })
    )
  }

  const changeTitleTodoItem = (itemIndex, event) => {
    if (event.key === 'Enter' && event.target.value) {
      updateItem(itemIndex, 'title', event.target.value)
      updateItem(itemIndex, 'isEditing', false)
    }
  }

  const onClickItem = (event) => {
    event.stopPropagation()
  }

  const removeItem = (itemIndex: number) => {
    setTodoList(prevList => prevList.filter((item, index) => index != itemIndex))
  }

  const clearCompletedItem = () => {
    setTodoList(prevList => prevList.filter((item) => !item.status))
  }

  const renderTodoList = () => {
    if (todoList.length === 0) {
      return null
    }

    return (
      <div className={"todo-list"}>
        {
          todoList.filter(item => {
            if(!filterStatus) {
              return true
            }
            return filterStatus === 'completed' ? item.status : !item.status
          }).map((todoItem, index) => <div className={"todo-item"} key={index} onClick={onClickItem}>
            {
              todoItem.isEditing ?
                <input type="text" defaultValue={todoItem.title}
                       autoFocus
                       onKeyDown={(event) => changeTitleTodoItem(index, event)} onBlur={() => updateItem(index, 'isEditing', false)} /> :
                <div className={`todo-item__wrapper ${todoItem.status ? 'finished' : ""}`}>
                  <button type="checkbox" className={`btn-checkbox `} onClick={() => updateItem(index, 'status', !todoItem.status)} >
                    <span className={'check-icon'}></span>
                  </button>
                  <div className={"todo-item__title"} onDoubleClick={() => updateItem(index, 'isEditing', true)}
                       title={"Double click to edit title"}>
                    {todoItem.title}
                  </div>
                  <button className={'btn-close'} title={"remove todo item"} onClick={() => removeItem(index)}>
                    X
                  </button>
                </div>
            }
          </div>)
        }
        <div className={"todo__tool-bar"}>
          <span>{todoList.filter(i => !i.status).length} items left!</span>
          <div className={"todo__filter"}>
            <button onClick={() => setFilterStatus('')} className={filterStatus ? '' : 'active'}>All</button>
            <button onClick={() => setFilterStatus('active')} className={filterStatus === 'active' ? 'active' : ''}>Active</button>
            <button onClick={() => setFilterStatus('completed')} className={filterStatus === 'completed' ? 'active' : ''}>Completed</button>
          </div>
          <button onClick={clearCompletedItem}>Clear Completed</button>
        </div>
      </div>
    )
  }

  return (
    <div className={"todo"}>
      <h1>todos</h1>
      <input
        className={"todo__input"}
        placeholder={"What needs to be done?"}
        onKeyDown={addNewItem}
        ref={inputRef}
      />
      {renderTodoList()}
      <div className={"todo__desc"}>
        Double-click to edit a todo
      </div>
    </div>
  );
  // Your code end here
};

export default Input;
