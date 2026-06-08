import React from "react";

//internal imports
import useUtilsFunction from "@/hooks/useUtilsFunction";

const SelectLanguage = ({ handleLanguageChange }) => {
  const { languages, langError, langLoading, showingTranslateValue } =
    useUtilsFunction();

  return (
    <ul className="dropdown-content w-full">
      {!langError &&
        !langLoading &&
        languages?.map((lang) => (
          <li
            className="cursor-pointer flex items-center space-x-2 p-2 hover:bg-muted rounded-md"
            onClick={() => handleLanguageChange(lang)}
            key={lang._id}
          >
            {/* Flag */}

            <span>{lang?.flag}</span>

            {/* Language Name */}
            <span className="text-foreground pr-8 text-right">
              {showingTranslateValue(lang?.name)}
            </span>
          </li>
        ))}
    </ul>
  );
};

export default SelectLanguage;
