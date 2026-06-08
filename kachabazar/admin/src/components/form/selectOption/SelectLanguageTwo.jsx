//internal import
import useUtilsFunction from "@/hooks/useUtilsFunction";

const SelectLanguageTwo = ({ handleSelectLanguage, register, language }) => {
  const { languages } = useUtilsFunction();
  // console.log({ language });

  return (
    <>
      <select
        name="language"
        {...register(`language`, {
          required: `language is required!`,
        })}
        onChange={(e) => handleSelectLanguage(e.target.value)}
        className="block w-20 h-8 border border-primary/50 bg-muted px-2 py-1 text-sm  focus:outline-none rounded-md form-select focus:bg-card"
      >
        <option value={language} defaultChecked hidden>
          {language}
        </option>
        {languages?.map((lang) => (
          <option key={lang?._id} value={lang?.code}>
            {lang?.code}{" "}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectLanguageTwo;
