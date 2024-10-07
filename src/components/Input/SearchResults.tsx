import React from "react"
import Loader from "../Loader"

interface SearchResultsProps {
    isLoading: boolean
    errorMessage: string | null
    searchResults: string[]
    onSelectItem: (item: string) => void
}

const SearchResults: React.FC<SearchResultsProps> = ({
    isLoading,
    errorMessage,
    searchResults,
    onSelectItem
}) => {
    return (
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
    )
}

export default SearchResults