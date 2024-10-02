import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import { ChangeEvent, useEffect, useState } from "react";
import Result from "../Result";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log("input re-render");

  // State management
  const [query, setQuery] = useState<string>("");
  const [items, setItems] = useState<string[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isComponentMounted = true;

    const debounceFetchItemsFn = debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        return;
      }
      setIsLoading(true);
      try {
        const result: string[] = await fetchData(searchQuery);
        if (isComponentMounted) {
          setItems(result);
          setError("");
        }
      } catch (error: unknown) {
        if (isComponentMounted) {
          setError(error as string);
          setItems([]);
        };
      } finally {
        if (isComponentMounted) setIsLoading(false);
      }
    }, 100)

    debounceFetchItemsFn(query); // Fetch items based on the query
    return () => {
      isComponentMounted = false;
    };
  }, [query]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="input-container">
      <input
        placeholder={placeholder}
        value={query}
        onChange={onInputChange}
        className="search-input" />
      {query && <Result error={error} isLoading={isLoading} items={items} onSelectItem={onSelectItem} />}
    </div>

  );
};

export default Input;

