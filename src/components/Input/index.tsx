import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";
import { useEffect, useMemo, useState } from "react";

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
  const [searchResults, setSearchResults] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    let ignore = false;
    setSearchResults([]);
    setIsLoading(false);
    setErrMessage('');

    if (!inputValue) {
      return;
    }

    fetchData(inputValue)
      .then((res) => {
        console.log("result:", res);
        if (!ignore) {
          setSearchResults(res as []);
          if (!res.length) {
            setErrMessage("No results");
          }
          setIsLoading(true);

        }
      })
      .catch((error) => {
        console.log("error");
        setIsLoading(true);
        setErrMessage(error);
      });
    return () => {
      ignore = true;
    }
  }, [inputValue]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const debouncedOnChange = debounce(onChange, 500);

  const generateSearchResults = useMemo(() => {
    return inputValue && (
      <div className="search-result">
        {!isLoading ? <Loader /> : (
          <div className="lists">
            <div className="error-message">{errMessage}</div>
            {searchResults.map((item, index) => {
              return (
                <div
                  key={item + '-' + index}
                  className="item"
                  onClick={() => onSelectItem(item)}
                >
                  {item}
                </div>
              );
            })}
          </div>
        )}

      </div>
    );
  }, [searchResults, isLoading]);

  return (
    <>
      <div>
        <input
          className="input"
          placeholder={placeholder}
          onChange={debouncedOnChange}
        />
        {generateSearchResults}
      </div>
    </>
  );
  // Your code end here
};

export default Input;
