import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import { ChangeEvent, useCallback, useRef, useState } from "react";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const SearchResultList: React.FC<{list: string[], isLoading?: boolean, isError: boolean, onSelectItem: (item: string) => void}> = ({list, isLoading, isError, onSelectItem}) => {    
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Occur an error.</p>
  }

  if (!list.length) {
    return <p>No results.</p>
  }

  return <ul className="search-input--list">
    {
      list.map((item:string) => <li key={item}>
        <div className="search-input--list--item" onClick={() => onSelectItem(item)} role="presentation">{item}</div>
      </li>)
    }
  </ul>
}

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log('input re-render');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [list, setList] = useState<string[]>([]);
  const latestRequestRef  = useRef<number>(0);

  // Your code start here
  const _onChangeFnc = async (e:ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setIsLoading(true);
    setIsError(false);

    if(!value.trim()) {
      if (!list.length) {
        setList([]);
      }

      if (isLoading) {
        setIsLoading(false);
      }

      if (isError) {
        setIsError(false);
      }

      return;
    }

    const currentFetchId = ++latestRequestRef.current;

    try {
      const data = await fetchData(value);
      if (currentFetchId === latestRequestRef.current) {
        setList(data);
      }
    } catch {
      setIsError(true);
    } finally {
      if (currentFetchId === latestRequestRef.current) {
        setIsLoading(false);
      }
    }
  }

  const _onChangeDebounce = useCallback(
    debounce(_onChangeFnc, 300),
    []
  );

  return <div className="search-input--wrapper">
    <input className="search-input--text" placeholder={placeholder} onChange={_onChangeDebounce}></input>
    <SearchResultList list={list} isLoading={isLoading} isError={isError} onSelectItem={onSelectItem} />
  </div>
  // Your code end here
};

export default Input;

