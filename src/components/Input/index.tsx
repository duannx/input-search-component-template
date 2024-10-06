import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { debounce } from '../../utils/deboucne';
import { fetchData } from '../../utils/fetch-data';
import Loader from '../Loader';
import './input.scss';

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log('input re-render');
  const [isCleanUp, setIsCleanUp] = useState<boolean>(false);
  const [searchTeam, setSearchTerm] = useState<string>('');
  const [listResult, setListResult] = useState<string[]>([]);
  const [isSearching, setIsSearch] = useState<boolean>(false);

  const handleClick = useCallback((item: string) => {
    onSelectItem(item)
  },[])

  function ListResult() {
    return (
      listResult.length > 0 ? <div className='list-result'>
        {listResult.map((item, index) => <div  className='list-result-item' onClick={() => handleClick(item)} key={index}>
          {item}
        </div> )}
      </div>
     : <div className='no-result'>No result</div> );
  }

  const getData = useCallback(async (searchTerm: string) => {
    try {
      setIsSearch(true)
      const res = await fetchData(searchTerm);
      setListResult(res);
    } catch(error) {console.log('error', error);
    } finally {
      setIsSearch(false)
    }
  },[])

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  
  };

  useEffect(() => {
    if(searchTeam !== '' && !isCleanUp) {
      getData(searchTeam)
    }
    return () => setIsCleanUp(true);
  }, [searchTeam])

  // Your code start here
  return (
    <div>
      <input
        className='input'
        placeholder={placeholder}
        onChange={debounce(
          (e: ChangeEvent<HTMLInputElement>) => handleOnChange(e),
          100
        )}
      ></input>
      {isSearching ? <Loader /> : <ListResult />}
    </div>
  );
  // Your code end here
};

export default Input;

