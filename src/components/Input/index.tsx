import "./input.scss";
import Loader from "../Loader";
import { useInput } from "./useInput";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}
const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log('input re-render')

  const { loading, error, result, onChange } = useInput();
  // Your code start here
  return <div className="main">
    <input
      placeholder={placeholder}
      onChange={onChange}
    />
    {
      loading ?
      <Loader /> :
      <>
        {
          error ?
            <p className="error">{error}</p> :
            <>
            {
              Array.isArray(result) &&
                (result.length > 0 ?
                  <ul className="list">
                  {
                    result.map(item => (
                      <li
                        key={item}
                        className="item"
                        onClick={() => onSelectItem(item)}
                      >
                        {item}
                      </li>
                    ))
                  }
                </ul> :
                <p className="no-results">No results</p>)
            }
            </>
        }
      </>
    }
    
  </div>;
  // Your code end here
};

export default Input;

