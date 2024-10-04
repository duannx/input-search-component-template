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

  /*
  Handle 4 state
    initital: show input with placeholder
    fetching: fetching data, show input with a loader
    success: fetched data successfully, show list item or text "No results" if there are no results
    error: fetched data failed, show error message
  When click into an item, trigger the onSelectItem function
  Add a debounce 100ms when fetching data
  Handle race condition
   */
  // Your code start here
  const DEBOUNCE_TIME = 100;
  const NO_RESULTS_MESSAGE = 'No results';

  const [isLoading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>();
  const [results, setResults] = useState<string[]>();
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleChangeInput = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setErrorMsg('')
    setInputValue(newValue)
  }, DEBOUNCE_TIME)

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
      setLoading(false)
    }
    )

    return () => {
      // clean up function
      ignore = true;
    }
  }, [inputValue])

  const renderResults = () => {
    if (isLoading) {
      return <Loader />
    }

    if (errorMsg) {
      return <div className="error-message">{errorMsg}</div>
    }

    if (!results?.length) {
      return <p className="no-result"> {NO_RESULTS_MESSAGE} </p>
    }

    return <div className="list">
      {results.map(((result: string) => <div key={result} className="item" onClick={() => onSelectItem(result)}>{result}</div>
      ))}
    </div>
  }

  return <div className="input-search-container">
    <input
      className="input"
      placeholder={placeholder}
      onChange={handleChangeInput}
    />
    {!!inputValue &&
      <div className="search-result">
        {renderResults()}
      </div>}
  </div>
  // Your code end here
};

export default Input;

