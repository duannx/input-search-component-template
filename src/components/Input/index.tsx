import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { FETCHING_STATUS } from "../../utils/constants";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const SearchResultList: React.FC<{
  list: string[],
  status: string | null,
  onSelectItem: (item: string) => void}> = ({
    list,
    status,
    onSelectItem
  }) => {
  if (status === FETCHING_STATUS.FETCHING) {
    return <p>Loading...</p>;
  }

  if (status === FETCHING_STATUS.ERROR) {
    return <p>Occur an error.</p>
  }

  if (!list.length && status !== FETCHING_STATUS.INITIAL) {
    return <p>No results.</p>
  }

  if (list.length) {
    return <ul className="search-input--list">
    {
      list.map((item:string) => <li key={item}>
        <div className="search-input--list--item" onClick={() => onSelectItem(item)} role="presentation">{item}</div>
      </li>)
    }
  </ul>
  }

  return null;
}

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log('input re-render');
  // Your code start here
  const [status, setStatus] = useState<string | null>(FETCHING_STATUS.INITIAL);
  const [list, setList] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>();
  const fetchDataPromise = useRef<Promise<unknown[]>>();

  const _onChangeFnc = (e:ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Return when there is empty value.
    if(!value.trim()) {
      setList([]);
      setStatus(FETCHING_STATUS.INITIAL);

      return;
    }

    inputRef.current = value;
    fetchDataPromise.current = undefined;

    setStatus(FETCHING_STATUS.FETCHING);
    
    // Fetch API.
    const _fetchDataPromise = fetchData(value);
    fetchDataPromise.current = _fetchDataPromise;

    _fetchDataPromise
    .then((res) => {
      if (isCheckXhr(_fetchDataPromise)) {
        setStatus(FETCHING_STATUS.INITIAL);
        return;
      }
      setList(res);
      setStatus(FETCHING_STATUS.SUCCESS);      
    })
    .catch(() => {      
      if (isCheckXhr(_fetchDataPromise)) {
        setStatus(FETCHING_STATUS.INITIAL);
        return;
      }
      setList([]);
      setStatus(FETCHING_STATUS.ERROR);
    })
    .finally(() => {
      fetchDataPromise.current = undefined;
    });
  }

  const isCheckXhr = (promise: Promise<unknown[]>) => {
    // Skip previous request.
    return fetchDataPromise.current != promise;
  }

  const isChangeInputRef = (e: string) => {
    const isChanged = e !== inputRef.current;

    return isChanged;
  }

  const _onChangeDebounce = useCallback(
    debounce(_onChangeFnc, 300),
    []
  );

  return <div className="search-input--wrapper">
    <input className="search-input--text" placeholder={placeholder} onChange={_onChangeDebounce} ref={inputRef}></input>
    <SearchResultList list={list} status={status} onSelectItem={onSelectItem} />
  </div>
  // Your code end here
};

export default Input;

