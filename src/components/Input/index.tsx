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

  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('initial');
  const [items, setItems] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value.trim() === '') {
      setStatus('initial');
      setItems([]);
      setError('');
    } else {
      setStatus('fetching');
    }
  };

  const debouncedChangeHandler = debounce(handleInputChange, 100);

  const onTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedChangeHandler(e.target.value);
  };

  const handleSelectedItem = (item: string) => {
    console.log("selected item ==>", item);
    onSelectItem(item);
  };

  useEffect(() => {
    if (status === 'fetching' && inputValue !== '') {
      fetchData(inputValue)
        .then(result => {
          setItems(result);
          setStatus(result.length === 0 ? 'success' : 'success');
        })
        .catch(err => {
          console.error(err);
          setError('Error fetching data. Please try again later.');
          setStatus('error');
        });
    }
  }, [inputValue]);

  return (
    <div className="list-component">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        onChange={onTyping}
        value={inputValue}
      />
      {status === 'fetching' && <Loader />}
      {status === 'success' && (
        items.length > 0 ? (
          <ul>
            {items.map((item, index) => (
              <li key={index} onClick={() => handleSelectedItem(item)}>{item}</li>
            ))}
          </ul>
        ) : <div>No results</div>
      )}
      {status === 'error' && <div>{error}</div>}
    </div>
  );
};

export default Input;

