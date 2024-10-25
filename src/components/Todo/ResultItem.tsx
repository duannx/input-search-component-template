import { useEffect, useRef, useState } from "react";
import { newStateType, useDataStore } from "./store";
import { useShallow } from "zustand/shallow";

const ResultItem = (props: newStateType) => {
  const { name, id, active } = props;
  const editInputRef = useRef<any>(null);
  const [editInputValue, setEditInputValue] = useState(name);
  const [isEdit, setIsEdit] = useState(false);
  const handleDoubleClick = () => {
    setIsEdit(!isEdit);
  };

  const updateName = useDataStore(useShallow((state) => state.updateName));
  const toggle = useDataStore(useShallow((state) => state.toggle)) ;
  const remove = useDataStore(useShallow((state) => state.removeData)) ;

  const editOnChange = (e: any) => {
    setEditInputValue(e.target.value);
  };

  const editOnBlur = () => {
    setIsEdit(false);
    setEditInputValue(name);
  };

  useEffect(() => {
    if(isEdit) {
      editInputRef.current.focus()
    }
  },[isEdit])

  

  return (
    <div className="item" onDoubleClick={handleDoubleClick}>
      {isEdit ? (
        <input
          value={editInputValue}
          ref={editInputRef}
          type="text"
          onBlur={editOnBlur}
          onChange={(e) => editOnChange(e)}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              updateName({ id, active, name: editInputValue });
              setIsEdit(false);
            }
          }}
          className="edit-input"
        />
      ) : (
        <>
          <input
            className="toggle"
            type="checkbox"
            data-testid="todo-item-toggle"
            checked={!active}
            onChange={() => toggle(props)}
          />
          <label className={`${!active ? 'result-input--checked' : 'result-input'}`}>{name}</label>
          <div className="close-cta" data-testid="todo-item-button" onClick={() => remove(id)}></div>
        </>
      )}
    </div>
  );
};

export default ResultItem;
