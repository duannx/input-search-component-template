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

interface DataState {
  loading: boolean;
  results: string[];
  error: string | null;
}

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log("input re-render");

  // Your code start here

  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [data, setData] = useState<DataState>({
    error: null,
    loading: false,
    results: [],
  });

  useEffect(() => {
    const fetchDataAsync = async () => {
      // Clear state typing
      setTyping(false);

      if (inputValue.trim() === "") {
        setData({
          loading: false,
          error: null,
          results: [],
        });
        return;
      }

      try {
        setData({
          ...data,
          loading: true,
        });

        const response: string[] = await fetchData(inputValue);

        setData({
          results: response,
          loading: false,
          error: null,
        });
      } catch (err) {
        setData({
          results: [],
          loading: false,
          error: err + "",
        });
      }
    };

    let ignore = false;

    const debounceFetch = setTimeout(() => {
      fetchDataAsync();
    }, 1000);

    return () => {
      ignore = true;
      clearTimeout(debounceFetch);
    };
  }, [inputValue]);

  const handleInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setTyping(true);
  };

  const renderResult = () => {
    const { results, loading, error } = data;

    if (inputValue.trim() === "") {
      return (
        <span className="message text-green">Enter your text to search...</span>
      );
    }

    if (loading) {
      return <Loader />;
    }

    if (error) {
      return <span className="message text-red">{error}</span>;
    }

    if (results && results.length > 0) {
      return (
        <ul>
          {results.map((value, index) => (
            <li key={index} onClick={() => onSelectItem(value)}>
              {value}
            </li>
          ))}
        </ul>
      );
    }

    if (!typing) {
      return <span className="message text-green">No results</span>;
    }

    return <></>;
  };

  return (
    <div className="input-container">
      <input placeholder={placeholder} onChange={handleInputChanged}></input>
      <div className="result-container">{renderResult()}</div>
    </div>
  );
  // Your code end here
};

export default Input;
