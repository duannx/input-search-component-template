import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";
import { useRef, useState } from "react";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

export interface ISearchResponse {
  isLoading?: boolean;
  errorMessage?: string;
  data?: string[];
}

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log("input re-render");

  // Your code start here
  const [searchResponse, setSearchResponse] = useState<ISearchResponse | null>(
    null
  );
  const currentSearchTextId = useRef<number>(0);

  const handleChange = debounce(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) {
        setSearchResponse(null);
        return;
      }

      const queryId = currentSearchTextId.current + 1;
      currentSearchTextId.current = queryId;
      setSearchResponse({ isLoading: true });

      try {
        const response = await fetchData(e.target.value);
        if (currentSearchTextId.current === queryId) {
          setSearchResponse({
            isLoading: false,
            data: response,
          });
        }
      } catch (errorMessage: unknown) {
        if (currentSearchTextId.current === queryId) {
          console.log(`error with ${e.target.value}`, errorMessage);
          setSearchResponse({
            isLoading: false,
            errorMessage: errorMessage + "",
          });
        }
      }
    },
    1000
  );

  const renderSearchResult = () => {
    if (!searchResponse) {
      return null;
    }

    if (searchResponse?.isLoading) {
      return (
        <div className="input__search-result">
          <div className="input__search-result__loader">
            <Loader />
          </div>
        </div>
      );
    }

    if (searchResponse?.errorMessage) {
      return (
        <div className="input__search-result">
          <div className="input__search-result__message">
            {searchResponse?.errorMessage}
          </div>
        </div>
      );
    }

    if (!searchResponse?.data?.length) {
      return (
        <div className="input__search-result">
          <div className="input__search-result__message">No results</div>
        </div>
      );
    }

    return (
      <div className="input__search-result">
        <ul className="input__list">
          {searchResponse?.data.map((item) => (
            <li key={item}>
              <button
                className="input__list-item"
                onClick={() => onSelectItem(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="input">
      <input
        placeholder={placeholder}
        className="input-box"
        onChange={handleChange}
      />
      {renderSearchResult()}
    </div>
  );
  // Your code end here
};

export default Input;
