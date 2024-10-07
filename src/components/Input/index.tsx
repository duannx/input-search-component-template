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
  console.log('input re-render')

  // Your code start here
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<"initial" | "fetching" | "success" | "error">("initial");
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
          console.log(result, 'data');
        }
      } catch (error) {
        if (isCurrent) {
          setStatus("error");
          setErrorMessage(error as string);
        }
      }
    };

    //debounced 300ms
    const debouncedFetchData = debounce(handleFetchData, 300);

    if (inputValue) {
      debouncedFetchData(inputValue);
    }

    return () => {
      isCurrent = false;
    };
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleItemClick = (item: string) => {
    onSelectItem(item);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} placeholder={placeholder}/>

      {status === "fetching" && <Loader />}

      {status === "error" && errorMessage && (
        <p>{errorMessage}</p>
      )}

      {status === "success" && (
        <>
          {items.length <= 0 && (
            <p>Sorry! No results found</p>
          )}
        </>
      )}

      {status === "success" && (
        <>
          {items.length > 0 && (  
            <ul>
              {items.map((item, index) => (
                <li key={index} onClick={() => handleItemClick(item)}>
                  {item}  
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
  // Your code end here
};

export default Input;

