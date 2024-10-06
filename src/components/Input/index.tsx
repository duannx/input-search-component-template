import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";
import { forwardRef, useRef, useImperativeHandle, useState, useCallback } from "react";
import React from "react";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

export interface IAutocompleteResultsProps {
  onSelectItem: (item: string) => void
}

const AutocompleteResults = forwardRef((props : IAutocompleteResultsProps, ref) => {
  console.log("xxxx");

  const [hasChange, setChange] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  //Use useRef instead of useState for preventing create new variables
  const isLoadingRef = useRef<boolean>(false);
  const errorMsgRef = useRef<string>("");
  const namesRef = useRef<string[]>([]);
  const keywordsRef = useRef<string>("");


  //Memoized the onChangeHandler
  const onChangeHandler = useCallback(debounce((evt : React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    errorMsgRef.current = "";

    if(!value) {
      namesRef.current = [];
      keywordsRef.current = "";
      setChange(new Date().getTime());
      return;
    }

    setLoading(true);

    fetchData(value).then(results => {
      namesRef.current = (results || []);
      keywordsRef.current = value;
      setChange(new Date().getTime());
      console.log(value, results);
    }).catch(e =>{
      namesRef.current = [];
      errorMsgRef.current = e;
    }).finally(() => {
      setLoading(false);
    });
  }, 500), [hasChange]);

  useImperativeHandle(ref, () => ({
    onChangeHandler
  }));

  return (
    <>
      {<div className={`loader-area ${isLoading ? "show" : ""}`}><Loader/></div>}
      {
        <ul className={`autocomplete-results ${keywordsRef.current.length && !isLoadingRef.current && hasChange ? "show" : ""}`}>
          {errorMsgRef.current ? (<li className="autocomplete-msg">{errorMsgRef.current}</li>) : ""}
          {(!errorMsgRef.current && namesRef.current.length == 0 && hasChange) ? (<li className="autocomplete-msg">No results!</li>) : ""}
          {!errorMsgRef.current && hasChange ? namesRef.current.map((resultElm) => (
            <li className="autocomplete-item" key={resultElm} onClick={() => props.onSelectItem(resultElm)}>
              {resultElm}
            </li>
          )) : ""}
        </ul>
      }
    </>
  );
});


const Input = ({ placeholder, onSelectItem }: InputProps) => {
  // DO NOT remove this log
  console.log('input re-render');

  //use childRef to prevent re-render the Input component, only re-render the AutoComplete and Loader component
  const childRef = useRef<any>();

  // Your code start here
  return (
    <div className="autocomplete">
        <input placeholder={placeholder} onChange={(e) => childRef.current.onChangeHandler(e)}></input>
        <AutocompleteResults ref={childRef} onSelectItem={onSelectItem}/>
    </div>
  )
  // Your code end here
};

export default Input;

