import Select from "react-select";
import { useEffect, useState } from "react";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { useTheme } from "@/context/ThemeContext";

const AttributeOption = ({ id, attributes, values, setValues, resetRef }) => {
  const [attributeOptions, setAttributeOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const { theme } = useTheme();

  const { showingTranslateValue } = useUtilsFunction();

  const handleSelectValue = (selectedItems) => {
    setSelectedValues(selectedItems);

    // Check if "All" is selected
    const hasAll = selectedItems?.some((item) => item._id === "1");

    if (hasAll) {
      const result = attributes?.variants.filter((att) => att._id !== "1");
      setValues({
        ...values,
        [attributes._id]: result?.map((el) => el._id),
      });
    } else {
      setValues({
        ...values,
        [attributes._id]: selectedItems?.map((el) => el._id) || [],
      });
    }
  };

  useEffect(() => {
    const dd = attributes?.variants?.map((val) => {
      return {
        ...val,
        label: showingTranslateValue(val?.name),
        value: val?._id,
      };
    });
    setAttributeOptions(dd);
  }, [attributes?.variants]);

  return (
    <>
      <Select
        isMulti
        key={id}
        options={attributeOptions}
        value={selectedValues}
        onChange={handleSelectValue}
        placeholder={showingTranslateValue(attributes.title)}
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
    </>
  );
};

export default AttributeOption;
