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

export interface IListItemProps {
  onSelectItem: (item: string) => void;
  searchValue: string;
}

const SearchItem = ({ onSelectItem, searchValue }: IListItemProps) => {
  return (
    <li className="input-search__search-item">
      <button
        className="input-search__item"
        onClick={() => {
          onSelectItem(searchValue)
        }}
      >
        {searchValue}
      </button>
    </li>
  );
};

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log("input re-render");

  // Your code start here
  const [inputValue, setInputValue] = useState<string>('');
  const [searchResults, setSearchReullt] = useState<{
    searchResults: string[];
    errorMessage: string;
  }>({
    searchResults: [],
    errorMessage: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleInputChange = debounce(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    100
  );

  useEffect(() => {
    if (!inputValue) return;

    setIsLoading(true);
    let isMounted = true;
    const getSearchResults = async () => {
      try {
        const response = await fetchData(inputValue);

        if (!isMounted) return;

        if (response && response.length > 0) {
          setSearchReullt({
            searchResults: response,
            errorMessage: ''
          });
          return;
        }

        setSearchReullt({
          searchResults: [],
            errorMessage: 'No result found',
        });
      } catch(error) {
        setSearchReullt({
          searchResults: [],
          errorMessage: error as unknown as string
        });
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }

    }

    getSearchResults();
    
    return () => {
      isMounted = false;
    }
  }, [inputValue])

  return (
    <div className="input-search__contaier">
      <input
        className="input-search__input"
        placeholder={placeholder}
        onInput={handleInputChange}
      ></input>
      {inputValue && (
        <div className="input-search__search-results-wrapper">
          {isLoading && <Loader />}
          {!isLoading && searchResults.searchResults && searchResults.searchResults.length > 0 && (
             <div className="input-search__search-results">
             <ul className="input-search__list-item">
               {searchResults.searchResults &&
                 searchResults.searchResults.map((results, index) => {
                   return (
                     <SearchItem
                       key={`${results}-${index}`}
                       searchValue={results}
                       onSelectItem={onSelectItem}
                     />
                   );
                 })}
             </ul>
           </div>
          )}
          {
            !isLoading && searchResults.searchResults && searchResults.searchResults.length === 0 && (
              <div className="input-search__error-message">
                {searchResults.errorMessage}
              </div>
            )
          }
        </div>
      )}
    </div>
  );
  // Your code end here
};

export default Input;
