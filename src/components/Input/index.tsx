import React, { useState, useMemo, useCallback, useRef } from "react";
import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import Loader from "../Loader";
import { debounce } from "../../utils/debounce";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  console.log('input re-render');

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const latestRequestRef = useRef<number>(0); 

  const debouncedFetchData = useMemo(() => {
    return debounce(async (query: string) => {
      const requestId = Date.now(); 
      latestRequestRef.current = requestId; 
      setLoading(true);
      setErrorMessage(null); 

      try {
        console.log("Fetching data for query:", query);
        const data = await fetchData(query);
      
        if (latestRequestRef.current === requestId) {
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      
        if (latestRequestRef.current === requestId) {
          setErrorMessage(`Error fetching data: ${error}`);
        }
      } finally {
       
        if (latestRequestRef.current === requestId) {
          setLoading(false);
        }
      }
    }, 500);
  }, []); 

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim() !== "") {
      debouncedFetchData(value);
    } else {
      setSuggestions([]); 
    }
  }, [debouncedFetchData]); 

  const handleSelectItem = useCallback((item: string) => {
    onSelectItem(item);
  }, [onSelectItem]); 

  const memoizedSuggestions = useMemo(() => {
    return suggestions.length > 0 ? (
      suggestions.map((item) => (
        <li
          key={item}
          onClick={() => handleSelectItem(item)}
          role="option"
          tabIndex={0} 
          aria-selected={inputValue === item}
        >
          {item}
        </li>
      ))
    ) : (
      <li>No results found</li>
    );
  }, [suggestions, inputValue]);

  return (
    <div className="input-container">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        aria-label="Search input"
        aria-describedby="error-message"
      />
      {loading && <Loader aria-live="polite" />}
      {errorMessage && (
        <ul className="suggestions-list" aria-live="assertive">
          <li>{errorMessage}</li>
        </ul>
      )}
      {!loading && !errorMessage && (
        <ul className="suggestions-list" role="listbox" aria-live="polite">
          {memoizedSuggestions}
        </ul>
      )}
    </div>
  );
};

export default Input;
