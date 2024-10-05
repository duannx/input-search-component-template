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

  // Your code start here
  const [result, setResult] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchString, setSearchString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmptySearch, setIsEmptySearch] = useState(true);

  const handleInputChange = debounce((value: string) => {
    if (!value) {
      setIsEmptySearch(true);
      setErrorMessage("");
      setSearchString("");
      return;
    }
    setIsLoading(true);
    setSearchString(value);
  }, 100);

  useEffect(() => {
    if (!searchString) return;
    let skip = false;
    fetchData(searchString)
      .then((data) => {
        if (skip) return;
        setErrorMessage("");
        setResult(data);
        setIsEmptySearch(false);
      })
      .catch((error) => {
        if (skip) return;
        setErrorMessage(error);
        setIsEmptySearch(false);
        setResult([]);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      skip = true;
    };
  }, [searchString]);

  const resultRender = () => {
    if (isLoading) return <Loader></Loader>;

    if (errorMessage) return <div>{errorMessage}</div>;

    if (result && result.length) {
      return (
        <ul>
          {result.map((item, index) => (
            <li key={`${item}-${index}`} onClick={() => onSelectItem(item)}>
              {item}
            </li>
          ))}
        </ul>
      );
    }

    if (result && !result.length) return <div>No item found!</div>;
  };

  return (
    <>
      <input
        placeholder={placeholder}
        onChange={(e) => handleInputChange(e.target.value)}
      ></input>
      {!isEmptySearch && resultRender()}
    </>
  );
  // Your code end here
};

export default Input;
