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
  console.log('input re-render');

  const { loading, error, result, onChange } = useInput();

  const renderResults = () => {
    if (!Array.isArray(result)) return null;

    if (result.length > 0) {
      return (
        <ul className="list">
          {result.map(item => (
            <li
              key={item}
              className="item"
              onClick={() => onSelectItem(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      );
    }
    return <p className="no-results">No results</p>;
  };

  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <p className="error">{error}</p>;
    return renderResults();
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
};

export default Input;