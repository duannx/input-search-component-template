import "./list.scss";

export interface ListProps {
  listItem?: string[];
  isLoading?: boolean;
  message?: string;
  handleSelectItem: (item: string) => void;
}

export default function List({
  listItem,
  message,
  isLoading,
  handleSelectItem,
}: ListProps) {
  return isLoading ? null : listItem && listItem.length > 0 ? (
    <div className="lists">
      {listItem.map((item, index) => (
        <div
          onClick={() => handleSelectItem(item)}
          className="item"
          key={`${item}_${index}`}
        >
          {item}
        </div>
      ))}
    </div>
  ) : message ? (
    <p className="no-result"> {message} </p>
  ) : null;
}
