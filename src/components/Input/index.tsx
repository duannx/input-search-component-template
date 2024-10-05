import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";
import { forwardRef, useRef, useImperativeHandle, useState, useCallback, useMemo } from "react";
import React from "react";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const AutocompleteResults = forwardRef((props, ref) => {
  console.log("xxxx");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const isLoadingRef = useRef<boolean>(false);
  const errorMsgRef = useRef<string>("");
  const namesRef = useRef<string[]>([]);
  const keywordsRef = useRef<string>("");


  //Memoized the onChangeHandler
  const onChangeHandler = useCallback(debounce((evt : React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    errorMsgRef.current = "";
    setIsLoading(true);

    fetchData(value).then(results => {
      namesRef.current = (results || []);
      keywordsRef.current = value;
      console.log(results);
    }).catch(e =>{
      namesRef.current = [];
      errorMsgRef.current = e;
    }).finally(() => {
      setIsLoading(false);
    });
  }, 100), [keywordsRef.current]);

  useImperativeHandle(ref, () => ({
    onChangeHandler
  }));

  return (
    <>
      {<div className={`loader-area ${isLoading ? "show" : ""}`}><Loader/></div>}
      {
        <ul className={`autocomplete-results ${keywordsRef.current.length && !isLoading ? "show" : ""}`}>
          {errorMsgRef.current ? (<li className="autocomplete-msg">{errorMsgRef.current}</li>) : ""}
          {(!errorMsgRef.current && namesRef.current.length == 0) ? (<li className="autocomplete-msg">No results!</li>) : ""}
          {!errorMsgRef.current ? namesRef.current.map((resultElm) => (
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
  const childRef = useRef();

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

