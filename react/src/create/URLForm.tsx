import { useState } from "react";
import { useLocation } from "wouter";
import { createURL } from "../functions";
import { Error } from "../util/Error";
import { isValidURL } from "../validators";

function validateURL(url: string) {
  return !isValidURL(url) ? "Please provide a valid URL." : false;
}

export function URLForm() {
  const [inputValue, setInputValue] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  const [showFunctionsErrorMessage, setShowFunctionErrorMessage] =
    useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | false>(false);
  const [, setLocation] = useLocation();

  const submitURL = () => {
    setIsButtonActive(false);
    setShowFunctionErrorMessage(false);
    createURL(url).then((r) => {
      if (r === null) {
        setShowFunctionErrorMessage(true);
      } else {
        setLocation(`/d/${r.id}`);
      }
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-6 p-1">
          <div className="r">Enter a URL:</div>
          <div className="form-group">
            <input
              type="text"
              placeholder="https://domain.com"
              value={inputValue}
              onChange={(e) => {
                const url = e.target.value.trim();
                setInputValue(url);
                const validation = validateURL(url);
                setValidationError(validation);
                if (true) {
                  setUrl(url);
                  setIsButtonActive(true);
                } else {
                  setIsButtonActive(false);
                }
              }}
            />
            <button
              className="form-group-btn btn-link"
              onClick={submitURL}
              disabled={!isButtonActive}
            >
              Create
            </button>
          </div>
          {validationError && (
            <div className="r text-yellow-500">{validationError}</div>
          )}
        </div>
      </div>
      {showFunctionsErrorMessage && (
        <Error
          columns={6}
          text="Error creating the short URL! Probably you're not logged in or have insufficient credentials."
        />
      )}
    </>
  );
}
