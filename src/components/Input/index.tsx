import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";
import { ChangeEvent, useCallback, useRef, useState } from "react";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
  /** debounce time */
  debounceTime?: number;
}

const Input = ({ placeholder, onSelectItem, debounceTime = 100 }: InputProps) => {
  // DO NOT remove this log
  console.log("input re-render");

  const inputRef = useRef<HTMLInputElement>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<string[]>([]);

  const handleCallAPI = useCallback(async (searchTerm: string) => {
    if (!searchTerm) return;
    setIsSearching(true);
    try {
      const response = await fetchData(searchTerm);
      console.log(response);
      setSearchData(response);
    } catch (error) {
      console.log("error when searching", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const renderResultBlock = (searchData: string[]) => {
    return (
      <>
        {!!searchData?.length ? (
          <div className={"input-search-component__result-block--has-data"}>
            {searchData.map((item, index) => {
              return (
                <div
                  key={`search-result-${index}`}
                  className={"input-search-component__result-item"}
                  onClick={(
                    e: React.MouseEvent<HTMLDivElement, MouseEvent>
                  ) => {
                    e.stopPropagation;
                    onSelectItem(item);
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={"input-search-component__result-block--no-data"}>
            No data matching your search. Pleas try again!
          </div>
        )}
      </>
    );
  };

  // Your code start here
  return (
    <div className={"input-search-component"}>
      <input
        ref={inputRef}
        placeholder={placeholder}
        onChange={debounce((e: ChangeEvent<HTMLInputElement>) => {
          e.preventDefault();
          const searchTerm = e.target?.value;
          setTempValue(searchTerm);
          handleCallAPI(searchTerm || "");
        }, debounceTime)}
        className={"input-search-component__input-search"}
      />
      {!!tempValue && (
        <div className={"input-search-component__result-block"}>
          {isSearching ? <Loader /> : renderResultBlock(searchData)}
        </div>
      )}
    </div>
  );
  // Your code end here
};

export default Input;
