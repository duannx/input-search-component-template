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

  const [isLoading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>();
  const [results, setResults] = useState<string[]>();
  const [errorMsg, setErrorMsg] = useState<string>('');
 
  const handleInputChanged = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, 100);

  useEffect(() => {
    if (!inputValue) return;

    let ignore = false;

    setLoading(true);

    fetchData(inputValue).then(res => {
      if (ignore) return;
      setResults(res)
    }).catch(err => {
      if (ignore) return;
      setErrorMsg(err);
    }).finally(() => {
      if (ignore) return;
      setLoading(false);
    })

    return () => {
      // clean up function
      ignore = true;
    }
  }, [inputValue])

  const renderResults = () => {
    if(!inputValue)
      return null;
    
    if (isLoading) {
      return <Loader />
    }

    if (errorMsg) {
      return <div>{errorMsg}</div>
    }

    if (!results?.length) {
      return <p> No results </p>
    }

    return <div>
      {results.map(((result: string) => <div key={result} onClick={() => onSelectItem(result)}>{result}</div>
      ))}
    </div>
  }

  return (
    <div>
      <input
      className="input"
      placeholder={placeholder}
      onChange={handleInputChanged}/>
      {renderResults()}
    </div>
  )
  // Your code end here
};

export default Input;

