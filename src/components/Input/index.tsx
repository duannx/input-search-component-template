import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/debounce";
import Loader from "../Loader";
import { ChangeEvent, useState } from "react";
import List from "../List";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log("input re-render");

  // Your code start here
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>();
  const [message, setMessage] = useState("");
  const [isInit, setIsInit] = useState(true);

  const handleOnChange = debounce(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const searchText = event.target.value;

      if (searchText) {
        setIsInit(false);
        setIsLoading(true);

        try {
          const resultList = await fetchData(searchText);
          setResults(resultList);

          if (resultList.length === 0) {
            setMessage("No results");
          }
        } catch (e: any) {
          setMessage(e);
        }
      } else {
        setResults([]);
        setIsInit(true);
      }

      setIsLoading(false);
    },
    300
  );

  return (
    <div className="input-search-container">
      <input placeholder={placeholder} onChange={handleOnChange}></input>

      {!isInit && (isLoading || results) ? (
        <div className="search-result">
          {isLoading ? <Loader></Loader> : null}
          <List
            handleSelectItem={onSelectItem}
            listItem={results}
            isLoading={isLoading}
            message={message}
          ></List>
        </div>
      ) : null}
    </div>
  );
  // Your code end here
};

export default Input;
