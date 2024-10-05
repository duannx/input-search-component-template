import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";
import { useState, useRef } from "react";
import React from "react";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

interface AutocompleteResultsProps {
  names: string[];
  onSelectItem: (item: string) => void;
}

const AutocompleteResults: React.FC<AutocompleteResultsProps> = ({ names, onSelectItem }) => {
  return (
    <ul className="autocomplete-results">
      {names.map((resultElm) => (
        <li className="autocomplete-item" key={resultElm} onClick={() => onSelectItem(resultElm)}>
          {resultElm}
        </li>
      ))}
    </ul>
  );
};



const Input = React.memo(({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log('input re-render')
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const namesRef = useRef<string[]>([]);
  
  const onChangeHandler = useRef(debounce(async (evt : React.ChangeEvent<HTMLInputElement>) => {
      const keywords = evt.target.value;
      setIsLoading(true);
      const results = await fetchData(keywords);
      namesRef.current = results || [];
      setIsLoading(false);
      console.log(results);
  }, 100)).current;

  // Your code start here
  return (
    <div className="autocomplete">
      {isLoading && (
        <Loader v-if="names.length"></Loader>
      )}
      
      <input placeholder={placeholder} onChange={onChangeHandler}></input>
      {
        namesRef.current.length && 
        <AutocompleteResults names={namesRef.current} onSelectItem={onSelectItem}></AutocompleteResults>
      }
    </div>
  )
  // Your code end here
});

export default Input;

