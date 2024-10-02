import Loader from "../Loader";
import "./result.scss"

export interface ResultProps {
  /** Placeholder of the input */
  items?: string[] | null;
  /** On click item handler */
  error: string;
  isLoading: boolean;
  onSelectItem: (item: string) => void;
}

const Result = ({ items, error, isLoading, onSelectItem }: ResultProps) => {
  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return <div className="error-message">{error}</div>;
    }
    if (items && items.length > 0) {
      return (
        <div className="lists">
          {items.map((item, index) => (
            <div className="item" key={index} onClick={() => onSelectItem(item)}>
              {item}
            </div>
          ))}
        </div>
      );
    }
    if (items && items.length === 0) {
      return <p className="no-result">No results</p>;
    }
    return null;
  };

  return <div className="search-result">{renderContent()}</div>;
};

export default Result;