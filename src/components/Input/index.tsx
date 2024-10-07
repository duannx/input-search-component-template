import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";
import { useRef, useState } from "react";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}
export enum InputState {
  INITITAL = 'initital',
  FETCHING = 'fetching',
  SUCCESS = 'success',
  ERROR = 'error',
}
const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log('input re-render')

  // Your code start here
  const [status, setStatus] = useState<InputState>(InputState.INITITAL);
  const [data, setData] = useState<string[]>();
  const [error, setError] = useState<string>('');

  const lastTimeID = useRef<number>(0);

  const handleChange = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    if(!query) {
      setStatus(InputState.INITITAL);
      setData([]);
      setError('');
      lastTimeID.current = 0;
      return;
    }
    const currentTime = new Date().getTime();
    lastTimeID.current = currentTime;
    try {
      if(status !== InputState.FETCHING) {
        setStatus(InputState.FETCHING);
      }
      const response = await fetchData(query);

      if(lastTimeID.current !== currentTime) return;

      setData(response);
      setStatus(InputState.SUCCESS);

    } catch (error) {
      if(lastTimeID.current !== currentTime) return;

      setStatus(InputState.ERROR);
      setError(error as string)
    }
  }, 100)

  return <div className="search-container">
    <input className="search-container__input" onChange={handleChange} placeholder={placeholder}/>
    {status !== InputState.INITITAL && <div className="search-container__content">
        {status === InputState.FETCHING && <Loader/>}
        {status === InputState.ERROR && <div className="search-container__error">{error}</div>}
        {status === InputState.SUCCESS && <div className="search-container__result">
          {!!data?.length ? data.map((item, index) => <div key={index} onClick={() => onSelectItem(item)}>{item}</div>) : 'No results'}
        </div>}
    </div>}
  </div>
  // Your code end here
};

export default Input;

