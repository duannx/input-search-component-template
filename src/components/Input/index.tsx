import './input.scss';
import { fetchData } from '../../utils/fetch-data';
import { debounce } from '../../utils/deboucne';
import Loader from '../Loader';
import { useRef, useState } from 'react';

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const Item = ({
  name,
  className,
  onSelectItem
}: {
  name: string;
  className: string;
  onSelectItem: (item: string) => void;
}) => (
  <li className={className} onClick={() => onSelectItem(name)}>
    {name}
  </li>
);

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log('input re-render');

  // Your code start here

  const [result, setResult] = useState<{
    items: string[];
    error: string | null;
  }>({
    items: [],
    error: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const latestQuery = useRef<string | null>('');

  const handleChange = debounce(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      latestQuery.current = query;

      if (query.length === 0) {
        setIsOpen(false);
        return;
      }

      try {
        setIsOpen(true);
        setIsLoading(true);
        const names = await fetchData(query);

        if (latestQuery.current !== query) return;

        setResult({
          items: names,
          error: null
        });
      } catch (error: unknown) {
        if (latestQuery.current !== query) return;
        setResult({
          items: [],
          error: String(error).toString()
        });
      } finally {
        if (latestQuery.current == query) {
          setIsLoading(false);
        }
      }
    },
    100
  );
  const { items, error } = result;

  return (
    <div className={'container'}>
      <input
        className={'input'}
        placeholder={placeholder}
        onChange={handleChange}
      />
      {isOpen && (
        <div className={'list-container'}>
          {isLoading && <Loader />}

          {!isLoading && !error && items.length > 0 && (
            <ul className="list">
              {items.map((name) => (
                <Item
                  key={name}
                  name={name}
                  className={'item'}
                  onSelectItem={onSelectItem}
                />
              ))}
            </ul>
          )}
          {!isLoading && items.length === 0 && !error && (
            <div className="no-result">
              <i>No results</i>
            </div>
          )}
          {!isLoading && error && (
            <div className="error">
              <i>{error}</i>
            </div>
          )}
        </div>
      )}
    </div>
  );
  // Your code end here
};

export default Input;
