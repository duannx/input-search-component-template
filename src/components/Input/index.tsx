import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";
import { ChangeEvent, useEffect,  useState } from "react";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const DEBOUNCE_TIME = 100; //ms

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  const [searchText, setSearchText] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // DO NOT remove this log
  console.log("input re-render");

  useEffect(() => {
    if(!searchText) {
      return ;
    }
    let ignore = true
    setIsLoading(true);
    setErrorMessage("");
    fetchData(searchText)
      .then((response) => {
        if (!ignore) {
          setItems(response || []);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(error);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });
    return () => {
      ignore = false
    }
  }, [searchText])

  const onChangeInput = debounce((event: ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;
    setSearchText(value)
  }, DEBOUNCE_TIME);

  const renderSearchResult = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (errorMessage) {
      return (
        <div className={"search__error-message"}>{errorMessage}</div>
      );
    }
    if (items.length === 0) {
      return <div className={'search__no-result'}>No result</div>
    }
    return (
      <ul className={'search__list'}>
        {items.map((item, index) => (
          <li className={'search__item'} key={item + index} onClick={() => onSelectItem(item)}>{item}</li>
        ))}
      </ul>
    );
  };

  // Your code start here
  return (
    <div className={"search"}>
      <input
        className={"search__input"}
        placeholder={placeholder}
        onChange={onChangeInput}
      />
      {searchText && (
        <div className={"search__result"}>
          {renderSearchResult()}
        </div>
      )}
    </div>
  );
  // Your code end here
};

export default Input;
