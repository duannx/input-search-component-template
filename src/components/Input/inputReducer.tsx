type Action =
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SEARCH_RESULTS"; payload: string[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }

export interface State {
  searchQuery: string
  searchResults: string[]
  isLoading: boolean
  errorMessage: string | null
}

export const initialState: State = {
  searchQuery: "",
  searchResults: [],
  isLoading: false,
  errorMessage: null,
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload, searchResults: [], errorMessage: null, isLoading: true }
    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.payload, isLoading: false }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, errorMessage: action.payload, isLoading: false }
    default:
      return state
  }
}