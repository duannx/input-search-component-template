import "./input.scss"
import { useState, useCallback, useRef } from "react"
import { fetchData } from "../../utils/fetch-data"
import { debounce } from "../../utils/deboucne"
import Loader from "../Loader"

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string
  /** On click item handler */
  onSelectItem: (item: string) => void
}

const DEBOUNCE_TIME = 100
const INITIAL_RESULTS: string[] = []

const Input = ({ placeholder, onSelectItem }: InputProps) => {  
  // DO NOT remove this log
  console.log('input re-render')

// Your code starts here

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>(INITIAL_RESULTS)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // A ref to store the current request id
  const latestRequestRef = useRef(0)
  const isLatestRequest = (requestId: number) => requestId === latestRequestRef.current;

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      // Increase request id for the new request
      const requestId = ++latestRequestRef.current

      try {
        if (query) {
          const results = await fetchData(query)
          // Only update the state if this is the latest request
          if (isLatestRequest(requestId)) {
            setSearchResults(results)
          }
        }
      } catch (error) {
        if (isLatestRequest(requestId)) {
          if (typeof error === "string") {
            setErrorMessage(error)
          } else {
            console.log(error)
          }
        }
      } finally {
        if (isLatestRequest(requestId)) {
          setIsLoading(false)
        }
      }
    }, DEBOUNCE_TIME),
    []
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setSearchQuery(value)
    setIsLoading(true)
    setSearchResults(INITIAL_RESULTS)
    setErrorMessage(null)

    debouncedSearch(value)
  }

  return (
    <div className="input-search-container">
      <input
        placeholder={placeholder}
        type="text"
        value={searchQuery}
        onChange={handleSearch}
      />

      {searchQuery && (
        <div className="search-result">
          {isLoading && <Loader />}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {searchResults.length === 0 && !isLoading && !errorMessage && (
            <p className="no-result">No results found</p>
          )}
          <div className="lists">
            {searchResults.map((result, index) => (
              <div
                className="item"
                key={index}
                onClick={() => onSelectItem(result)}
              >
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
  // Your code ends here
}

export default Input
