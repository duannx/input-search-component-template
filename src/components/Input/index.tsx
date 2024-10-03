import "./input.scss";
import { fetchData } from "../../utils/fetch-data";
import { debounce } from "../../utils/deboucne";
import { useEffect, useState } from "react";
import InputResult from "./components/InputResult";

export interface InputProps {
  /** Placeholder of the input */
  placeholder?: string;
  /** On click item handler */
  onSelectItem: (item: string) => void;
}

const Input = ({
  placeholder = "Type something to search",
  onSelectItem,
}: InputProps) => {
  // DO NOT remove this log ---------------------------------> Oke
  console.log("input re-render");
  //--------------------------------------------------------------
  const [inputValue, setInputValue] = useState<string>("");
  const [listResult, setListResult] = useState<string[] | null>([]);
  const [errors, setErrors] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isShowResult, setIsShowResult] = useState<boolean>(false);

  useEffect(() => {
    let cleanUp = false;

    if (inputValue) {
      fetchData(inputValue)
        .then((dataTest) => {
          if (!cleanUp) {
            setListResult(dataTest);
            setErrors("");
          }
        })
        .catch((errors) => {
          if (!cleanUp) {
            setListResult([]);
            setErrors(errors);
          }
        })
        .finally(() => {
          if (!cleanUp) {
            setIsloading(false);
          }
        });
    }

    return () => {
      cleanUp = true;
    };
  }, [inputValue]);

  const handleInputOnChange = debounce((value: string) => {
    if (value !== inputValue) {
      setIsShowResult(true);
      setIsloading(true);
      setInputValue(value);
    }
  }, 100);

  const resetSearch = () => {
    setIsShowResult(false);
    setIsloading(false);
    setErrors("");
    setListResult([]);
  };

  // Your code start here
  return (
    <>
      <div className="search__container">
        <input
          className="search__input"
          placeholder={placeholder}
          onChange={(e) => {
            if (!e.target.value) {
              resetSearch();
              setInputValue("");
              return;
            }
            handleInputOnChange(e.target.value);
          }}
        />
        {isShowResult && (
          <InputResult
            resultList={listResult}
            onSelectItem={onSelectItem}
            isLoading={isLoading}
            errors={errors}
          />
        )}
      </div>
    </>
  );
  // Your code end here
};

export default Input;
