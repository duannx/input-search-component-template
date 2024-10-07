import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/debounce";
import Loader from "../Loader";
import { useEffect, useState } from "react";

export interface InputProps {
  placeholder?: string;
  onSelectItem: (item: string) => void;
}

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  // console.log('input re-render', placeholder);

  // Your code start here
  const DEBOUNCE_PERIOD = 100;

  const [result, setResult] = useState<string[]>([]);
  const [errMessage, setErrMessage] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleFetchingData();
    console.log(result);
  }, [searchText]);

  const handleFetchingData = async () => {
    setIsLoading(true);

    try {
      const response = await fetchData(searchText);
      setSearchText(searchText);
      setResult(response);
      setErrMessage('');
    } catch (error) {
      setErrMessage(error as string);
      setResult([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeInput = debounce((e: any) => {
    setSearchText(e.target.value)
  }, DEBOUNCE_PERIOD);

  return (
    <div className="search__panel">
      <input
        className="search__box"
        placeholder={placeholder}
        onChange={handleChangeInput}
      />
      {isLoading && <Loader />}
      {
        result
          ? searchText && <ul className="search__results">
            {result.map((item, index) => (
              <li className={'search__item'} key={index} onClick={() => onSelectItem(item)}>{item}</li>
            ))}
          </ul>
          : <div className="search__message">No results</div>

      }
      {errMessage && <div className="search__error">{errMessage}</div>}
    </div>
  )
  // Your code end here
};

export default Input;

