import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";
import { ChangeEvent, useEffect, useState } from "react";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const DEBOUNCE_TIME = 300;

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  const [searchText, setSearchText] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [searchItems, setSearchItems] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  // DO NOT remove this log
  console.log("input re-render");

  useEffect(() => {
    let ignore = false;
    setIsFetching(true);
    setErrorMsg('');
    fetchData(searchText).then((response) => {
      if (!ignore) {
        setSearchItems(response || []);
      }
    }).catch((error) => {
      if (!ignore) {
        setErrorMsg(error);
      }
    }).finally(() => {
      if (!ignore) {
        setIsFetching(false);
      }
    });
    return () => {
      ignore = true;
    }
  }, [searchText])

  const handleOnChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
  }, DEBOUNCE_TIME);

  const renderSearchResults = () => {
    if (isFetching) {
      return <Loader/>;
    } else if (errorMsg) {
      return <div className="search__error-msg">{errorMsg}</div>;
    } else if (!searchItems.length) {
      return <div className="search__no-result">No result</div>
    } else {
      return (
        <div className="search__items">
          {searchItems.map((item, index) => (
            <div className="search__item" key={`${item}-${index}`} onClick={() => onSelectItem(item)}>{item}</div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="search__wrapper">
      <input className="search__input" placeholder={placeholder} onChange={handleOnChange}/>
      {(!searchText.length || searchText.trim() === '') ? "" : (
        <div className="search__result">{renderSearchResults()}</div>
      )}
    </div>
  );
};

export default Input;
