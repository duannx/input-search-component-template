import { ReactNode } from "react";
import Loader from "../../Loader";
import "./inputResult.scss";

export interface InputSearchProps {
  resultList: string[] | null;
  onSelectItem: (item: string) => void;
  isLoading?: boolean;
  errors?: string;
}

const InputResult = ({
  resultList,
  isLoading = false,
  errors = "",
  onSelectItem,
}: InputSearchProps) => {
  if (!resultList) return <></>;

  const isLoadingClass = !!(
    isLoading ||
    (resultList && !resultList.length) ||
    errors
  );
  let previousSelectItem = "";

  const handleSelectItem = (value: string) => {
    if (previousSelectItem !== value) {
      onSelectItem(value);
      previousSelectItem = value;
    }
  };

  const renderResult = (): ReactNode => {
    if (isLoading) {
      return <div className="search-result__item-loading">{Loader()}</div>;
    }

    if (errors) {
      return <div className="search-result__errors">{errors}</div>;
    }

    if (resultList && !!resultList.length) {
      return resultList.map((value: string, index: number) => (
        <div
          key={`${value}-${index}`}
          className="search-result__item"
          onClick={() => {
            handleSelectItem(value);
          }}
        >
          {value}
        </div>
      ));
    }

    if (resultList && !resultList.length) {
      return <div className="search-result__item-no-result">No result!</div>;
    }

    return <></>;
  };

  return (
    <>
      <div
        className={`search-result__container ${
          isLoadingClass ? "search-result__container--loading" : ""
        }
          }`}
      >
        {renderResult()}
      </div>
    </>
  );
};

export default InputResult;
