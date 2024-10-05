import "./input.scss";
import { useCallback, useState, useEffect } from "react";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
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
  const [initital, setInitital] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [query, setQuery] = useState(null);
  const [error, setError] = useState("");
  const [listResults, setListResults] = useState<string[]>([]);

  useEffect(() => {
      let isMounted = true;
      if(query != null) {
        setInitital(false);
        setFetching(true);
        fetchData(query)
          .then(resp => {
            if(isMounted) {
              setError("");
              setFetching(false);
              console.log(resp);
              setListResults(resp);
            }
          })
          .catch ((err) => {
            setError(err as string);
            setFetching(false);
          })
      }
      return () => {
        isMounted = false; // Prevent state updates on unmounted component
      };
  }, [query]);

  const onInputSearch = useCallback(debounce((query: any) => {
    setQuery(query);
  }, 100), [])

  const renderHTML = () => {
    if(fetching) {
      return <Loader></Loader>
    } else if(error) {
        return <p className="text-error">{error}</p>
    } else {
      const htmlResult = listResults.length ? 
        <ul className="result-list">
          {
            listResults.map((item) => 
              <li
                key={item} 
                onClick={() => onSelectItem(item)}
              >
                {item}
              </li>
            )
          }
        </ul> : 
        <div className="no-result">No Results</div>;
      return htmlResult;
    }
  } 

  return (
    <>
      <input placeholder={placeholder} onInput={evt => onInputSearch((evt.target as HTMLTextAreaElement).value)}></input>
      <div className="search-result">
        {!initital ? renderHTML(): ""}
      </div>
    </>
  );
  // Your code end here
};

export default Input;

