import React from "react";
import SelectLanguageTwo from "@/components/form/selectOption/SelectLanguageTwo";

const Title = ({
  title,
  register,
  language,
  description,
  handleSelectLanguage,
}) => {
  return (
    <>
      <div className="flex md:flex-row flex-col justify-between pr-10">
        <div>
          <h4 className="text-xl font-medium">{title}</h4>
          <p className="mb-0 text-sm text-muted-foreground">{description}</p>
        </div>
        {handleSelectLanguage && (
          <SelectLanguageTwo
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
          />
        )}
      </div>
    </>
  );
};

export default Title;
