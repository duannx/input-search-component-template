import "./input.scss"
import { useReducer, useEffect, useCallback } from "react"
import { fetchData } from "../../utils/fetch-data"
import { debounce } from "../../utils/deboucne"
import SearchResults from "./SearchResults"
import { reducer, initialState } from "./inputReducer"
export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string
  /** On click item handler */
  onSelectItem: (item: string) => void
}
const DEBOUNCE_TIME = 500
const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log('input re-render')

  // Your code starts here
  const [state, dispatch] = useReducer(reducer, initialState)
  const { searchQuery, searchResults, isLoading, errorMessage } = state

  useEffect(() => {
    if (!searchQuery) {
      return
    }

    const startFetching = async () => {
      try {
        const results = await fetchData(searchQuery)
        if (!ignore) {
          dispatch({ type: "SET_SEARCH_RESULTS", payload: results })
        }
      } catch (error: any) {
        if (!ignore) {
          dispatch({ type: "SET_ERROR", payload: error.message || "An error occurred" })
        }
      }
    }
    let ignore = false
    startFetching()

    return () => {
      ignore = true
    }
  }, [searchQuery])

  const handleSearch = useCallback(
    debounce((value: string) => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: value })
    }, DEBOUNCE_TIME),
    []
  )

  return (
    <form className="form">
      <input
        placeholder={placeholder}
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        className="form__field"
      />

      {searchQuery && (
        <SearchResults
          isLoading={isLoading}
          errorMessage={errorMessage}
          searchResults={searchResults}
          onSelectItem={onSelectItem}
        />
      )}
    </form>
  )
  // Your code ends here
}

export default Input
