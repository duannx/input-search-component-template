import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { ChangeEvent, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    fetchData(searchText)
      .then((response) => {
        if (!ignore) {
          setList(response || []);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setError(error);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    }
  }, [searchText]);

  const onChange = debounce((e: ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setSearchText(value);
  }, 300);

  const renderContent = () => {
    if (loading) {
      return (<Loader />);
    }
    if (error) {
      return (<p className="error">{error}</p>);
    }
    if (list.length === 0) {
      return (<p className="no-results">No results</p>);
    }
    return (
      <ul className="list">
      {
        list.map(item => (
          <li key={item} className="item" onClick={() => onSelectItem(item)}>
            {item}
          </li>
        ))
        }
      </ul>
    );
  };

  return (
    <div className="main">
      <input
        placeholder={placeholder}
        onChange={onChange}
      />
      {renderContent()}
    </div>
  );
  // Your code end here
};

export default Input;

