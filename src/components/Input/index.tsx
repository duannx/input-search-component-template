import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
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

  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<
    "initial" | "fetching" | "success" | "error"
  >("initial");
  const [items, setItems] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const handleFetchData = async (value: string) => {
      if (!value) {
        setStatus("initial");
        setItems([]);
        setErrorMessage("");
        return;
      }

      setStatus("fetching");
      setErrorMessage("");

      try {
        const result = await fetchData(value);
        if (isCurrent) {
          setItems(result.length ? result : []);
          setStatus("success");
        }
      } catch (error) {
        if (isCurrent) {
          setStatus("error");
          setErrorMessage(error as string);
        }
      }
    };

    // Debounced version of handleFetchData test deploy
    const debouncedFetchData = debounce(handleFetchData, 100);

    if (inputValue) {
      debouncedFetchData(inputValue);
    }

    return () => {
      isCurrent = false;
    };
  }, [inputValue]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle item click
  const handleItemClick = (item: string) => {
    onSelectItem(item);
  };

  return (
    <div className="input-container">
      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="input-field"
      />

      {/* Loader */}
      {status === "fetching" && <Loader />}

      {/* Error message */}
      {status === "error" && errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      {/* List of items */}
      {status === "success" && (
        <ul className="item-list">
          {items.length ? (
            items.map((item, index) => (
              <li key={index} onClick={() => handleItemClick(item)}>
                {item}
              </li>
            ))
          ) : (
            <p>No results</p>
          )}
        </ul>
      )}
    </div>
  );
  // Your code end here
};

export default Input;
