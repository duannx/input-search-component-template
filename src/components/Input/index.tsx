import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/debounce";
import Loader from "../Loader";
import { useEffect, useState } from "react";

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
  const [inputValue, setInputValue] = useState<string>("");
  const [dropdownItems, setDropdownItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setInputValue(e.target.value);
  }, 200);

  const handleSelectItem = (item: string) => {
    console.log("selected item", item);
    onSelectItem(item);
  };

  useEffect(() => {
    let ignore = false;
    if (inputValue && !ignore) {
      setIsLoading(true);
      fetchData(inputValue)
        .then((data) => {
          if (data.length === 0) {
            setError("No data found. query: " + inputValue);
          } else {
            setDropdownItems(data);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    }
    return () => {
      ignore = true;
      setDropdownItems([]);
      setIsLoading(false);
    };
  }, [inputValue]);

  return (
    <div className="input-container">
      <input
        onChange={handleChange}
        type="text"
        placeholder={placeholder}
      ></input>
      {inputValue && (
        <div className={`dropdown ${isLoading ? "loading" : ""}`}>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <div className="dropdown-error">{error}</div>
          ) : (
            dropdownItems.map((item) => (
              <label htmlFor={item} key={item} className="dropdown-item">
                <input type="radio" name="dropdown-item" id={item} />
                <div onClick={() => handleSelectItem(item)}>{item}</div>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
  // Your code end here
};

export default Input;
