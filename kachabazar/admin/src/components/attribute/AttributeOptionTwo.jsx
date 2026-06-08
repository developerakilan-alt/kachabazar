import React, { useEffect, useState } from "react";
import Select from "react-select";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { useTheme } from "@/context/ThemeContext";

const AttributeOptionTwo = ({
  attributes,
  values,
  setValues,
  selectedValueClear,
}) => {
  const [attributeOptions, setAttributeOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const { theme } = useTheme();
  // console.log('attributes in attribute option',attributes)

  const { showingTranslateValue } = useUtilsFunction();

  const handleSelectValue = (items) => {
    // setSelectedValueClear(false);
    setSelected(items);
    setValues({
      ...values,
      [attributes._id]: items?.map((el) => el._id),
    });
  };

  useEffect(() => {
    const options = attributes?.variants?.map((val) => {
      return {
        ...val,
        label: showingTranslateValue(val?.name),
        value: val?._id,
      };
    });
    setAttributeOptions(options);
  }, [attributes?.variants]);

  useEffect(() => {
    if (selectedValueClear) {
      setSelected([]);
    }
  }, [selectedValueClear]);

  const handleSelectAll = () => {
    if (selected?.length === attributeOptions?.length) {
      handleSelectValue([]);
    } else {
      handleSelectValue(attributeOptions || []);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-1">
        <button
          type="button"
          className="text-xs text-primary hover:text-primary font-medium"
          onClick={handleSelectAll}
        >
          {selected?.length === attributeOptions?.length &&
          attributeOptions?.length > 0
            ? "Deselect All"
            : "Select All"}
        </button>
      </div>
      <Select
        isMulti
        options={attributeOptions}
        value={selected}
        onChange={(v) => handleSelectValue(v)}
        placeholder="Select"
        className="react-select-container"
        classNamePrefix="react-select"
        getOptionLabel={(option) => showingTranslateValue(option?.name)}
        getOptionValue={(option) => option._id}
        theme={(selectTheme) => ({
          ...selectTheme,
          colors: {
            ...selectTheme.colors,
            primary: theme === "dark" ? "#374151" : "#3b82f6",
            primary25: theme === "dark" ? "#1f2937" : "#dbeafe",
            neutral0: theme === "dark" ? "#1f2937" : "#ffffff",
            neutral80: theme === "dark" ? "#e5e7eb" : "#1f2937",
          },
        })}
      />
    </div>
  );
};

export default AttributeOptionTwo;
