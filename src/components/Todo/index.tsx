import { useMemo, useState } from "react";
import ResultItem from "./ResultItem";
import { useDataStore } from "./store";
import { useShallow } from "zustand/shallow";
import "./Todo.scss";

const Todo = () => {
  const data = useDataStore(useShallow((state) => state.data));
  const [filter, setFilter] = useState<string>("all");
  const getActiveData = useDataStore(
    useShallow((state) => state.getActiveData)
  );
  const addData = useDataStore(useShallow((state) => state.addData));
  const activeAll = useDataStore(useShallow((state) => state.activeAll));
  const [initialValue, setInitialValue] = useState("");

  const handlerEnter = (e: any) => {
    setInitialValue("");
    addData({
      name: e.target.value,
      id: +new Date(),
      active: true,
    });
  };

  const handleGetActiveData = (status: string) => {
    if (status === "active") {
      setFilter("active");
    } else if (status === "completed") {
      setFilter("completed");
    } else setFilter("all");
  };

  const onBlur = (e: any) => {
    setInitialValue(e.target.value);
  };

  const listResult = useMemo(() => {
    if (filter === "active") return data.filter((item) => item.active);
    if (filter === "completed") return data.filter((item) => !item.active);
    return data;
  }, [filter, data]);

  return (
    <div className="wrapper">
      <label className="active-all-cta" onClick={activeAll}></label>
      <input
        onKeyDown={(e: any) => {
          if (e.key === "Enter") {
            handlerEnter(e);
          }
        }}
        onChange={(e) => onBlur(e)}
        value={initialValue}
        type="text"
        className="header"
        placeholder="What needs to be done?"
      />
      <div className="body">
        {!!listResult?.length &&
          listResult.map((item) => <ResultItem key={item.id} {...item} />)}
      </div>

      {data.length > 0 && (
        <div className="footer">
          <div>
            {data.filter((item) => item.active).length}{" "}
            {listResult.length > 1 ? "items left!" : "item left!"}
          </div>
          <div className="footer--center">
            <div
              className={`${filter === "all" ? "filter-active" : "filter"}`}
              onClick={() => handleGetActiveData("all")}
            >
              All
            </div>
            <div
              className={`${filter === "active" ? "filter-active" : "filter"}`}
              onClick={() => handleGetActiveData("active")}
            >
              Active
            </div>
            <div
              className={`${
                filter === "completed" ? "filter-active" : "filter"
              }`}
              onClick={() => handleGetActiveData("completed")}
            >
              Completed
            </div>
          </div>
          <div className="footer--right" onClick={getActiveData}>
            Clear Completed
          </div>
        </div>
      )}
    </div>
  );
};
export default Todo;
