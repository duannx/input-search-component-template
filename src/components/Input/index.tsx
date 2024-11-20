import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";
import { useCallback, useState } from "react";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const renderResult = (
  search: string,
  loading: boolean,
  error: string,
  results: string[],
  onSelectItem: (r: string) => void
) => {
  if (search !== "") {
    if (!loading) {
      if (error != "") {
        return <div className="error">{error}</div>;
      } else if (results && results.length > 0) {
        return (
          <div className="list">
            {results.map((r, index) => {
              return (
                <div
                  key={`${r}_${index}`}
                  className="item"
                  onClick={() => {
                    onSelectItem(r);
                  }}
                >
                  {r}
                </div>
              );
            })}
          </div>
        );
      } else {
        return <p className="no-result"> No result </p>;
      }
    }
    return <Loader />;
  }
};

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log("input re-render");

  // Your code start here
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = debounce(
    useCallback(
      (searchText: string) => {
        if (!loading) {
          setSearch(searchText);
          if (searchText.trim() != "") {
            setLoading(true);
            fetchData(searchText)
              .then((response) => {
                setError("");
                setResults(response);
              })
              .catch((error) => {
                setError(error);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        }
      },
      [loading]
    ),
    100
  );

  return (
    <>
      <input
        className="input"
        placeholder={placeholder}
        onChange={async (e) => {
          handleSearch(e.target.value);
        }}
      />

      {search.trim() !== "" && (
        <div className="search-result">
          {renderResult(search, loading, error, results, onSelectItem)}
        </div>
      )}
    </>
  );
  // Your code end here
};

export default Input;
