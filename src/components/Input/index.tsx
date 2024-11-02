import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";
import { ChangeEvent, useCallback, useState } from "react";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log('input re-render')

  const [result, setResult] = useState<string[]>([]);

  const [text, setText] = useState<string>('')

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFetch = debounce(async (input: string) => {
    try {
      if (!input) {
        setResult([]);
        return;
      }
      setIsLoading(true);
      const response = await fetchData(input);
      setResult(response);
    } catch (err) {
      console.log("Err", err);
    } finally {
      setIsLoading(false);
    }
  }, 1000)

  const handleFetchData = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    await onFetch(event.target.value);
  }, [])

  const handleSelectItem = useCallback((item: string) => {
    setText(item);
    onSelectItem(item)
  }, [])

  // Your code start here
  return (
    <div>
      <input value={text} onChange={handleFetchData} placeholder={placeholder}></input>
      {
        isLoading && (
          <Loader />
        )
      }
      {
        result &&
        result.map((item, index) => {
          return (
            <div key={index} onClick={() => handleSelectItem(item)}>
              {item}
            </div>
          )
        })
      }
    </div>
  )
  // Your code end here
};

export default Input;

