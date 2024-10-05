import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import Loader from "../Loader";
import { forwardRef, useRef, useImperativeHandle, useState } from "react";
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
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [names, setNames] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string>("");

  const onChangeHandler = debounce((evt : React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setIsLoading(true);
    setErrorMsg("");

    fetchData(value).then(results => {
      setNames(results || []);
      setKeywords(value);
      console.log(results);
    }).catch(e =>{
      setNames([]);
      setErrorMsg(e as string);
    }).finally(() => {
      setIsLoading(false);
    });
  }, 100);

  useImperativeHandle(ref, () => ({
    onChangeHandler
  }));

  return (
    <>
      {isLoading && <Loader/>}
      {keywords.length ? 
        (
          <ul className="autocomplete-results">
            {errorMsg ? (<li className="autocomplete-msg">{errorMsg}</li>) : ""}
            {(!errorMsg && names.length == 0) ? (<li className="autocomplete-msg">No results!</li>) : ""}
            {!errorMsg ? names.map((resultElm) => (
              <li className="autocomplete-item" key={resultElm} onClick={() => props.onSelectItem(resultElm)}>
                {resultElm}
              </li>
            )) : ""}
          </ul>
        )
        : ""
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

