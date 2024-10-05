import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import { useState,useEffect} from "react";
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
  
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState(['']);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  
  useEffect(() => {

    if (!inputValue) return;
    let ignore = false;
    setLoading(false);

    fetchData(inputValue).then(res => {
      if (ignore) return;
      setResults(res);
      setMessage("");
    }).catch(err => {
      if (ignore) return;
      setMessage(err);
    })
    setLoading(false);

    return () => {
      setLoading(false);
      ignore = true;
    }
  }, [inputValue])

  const handleChangeInput = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage('')
    setInputValue(event.target.value)
  }, 100)

  const renderResults = () => {
    if (isLoading) {
      return <Loader />
    }
    if(message)
      return <div className="error"><label>{message}</label></div>
    if (results && results.length > 0) {
      return (
        <div><ul>
          {results.map((value, index) => (
            <li key={index} onClick={() => onSelectItem(value)}>
              {value}
            </li>
          ))}
        </ul></div>
      );
    }else{
      return <div className="message"><label> No Results</label></div>
    }

  };
  return <div className="search-container">
  <input
    className="input input-search"
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

