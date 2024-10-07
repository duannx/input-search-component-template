import React, { useState, useEffect, useCallback } from "react";
import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";

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
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [latestRequest, setLatestRequest] = useState<number>(0);

  const debouncedFetchData = useCallback(
    debounce(async (value: string, requestId: number) => {
      setStatus("fetching");
      try {
        const result = await fetchData(value);
        if (requestId === latestRequest) {
          setData(result);
          setStatus("success");
        }
      } catch (err) {
        if (requestId === latestRequest) {
          setError("Failed to fetch data");
          setStatus("error");
        }
      }
    }, 100),
    [latestRequest]
  );

  useEffect(() => {
    if (inputValue.trim() === "") {
      setStatus("initial");
      setData([]);
      setError(null);
      return;
    }

    const requestId = Date.now();
    setLatestRequest(requestId);
    debouncedFetchData(inputValue, requestId);
  }, [inputValue, debouncedFetchData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleItemClick = (item: string) => {
    onSelectItem(item);
  };

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
      />
      {status === "fetching" && <Loader />}
      {status === "success" && (
        <ul>
          {data.length > 0 ? (
            data.map((item, index) => (
              <li key={index} onClick={() => handleItemClick(item)}>
                {item}
              </li>
            ))
          ) : (
            <li>No results</li>
          )}
        </ul>
      )}
      {status === "error" && <div>{error}</div>}
    </div>
  );
  // Your code end here
};

export default Input;

