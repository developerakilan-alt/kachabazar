import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { useTranslation } from "react-i18next";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Controller } from "react-hook-form";

//internal import
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import LabelArea from "@/components/form/selectOption/LabelArea";
import InputArea from "@/components/form/input/InputArea";
import DrawerButton from "@/components/form/button/DrawerButton";
import TagInputTwo from "@/components/common/TagInputTwo";
import useAttributeSubmit from "@/hooks/useAttributeSubmit";

const AttributeDrawer = ({ id }) => {
  const {
    control,
    language,
    handleSubmit,
    onSubmit,
    register,
    errors,
    variants,
    addVariant,
    isSubmitting,
    removeVariant,
    handleSelectLanguage,
  } = useAttributeSubmit(id);

  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      <div className="w-full relative px-6 py-4 border-b bg-muted">
        {id ? (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateAttribute")}
            description={t("UpdateAttributeDesc")}
          />
        ) : (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddAttribute")}
            description={t("AddAttributeDesc")}
          />
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <Scrollbars className="flex-1 mb-8">
          <div className="px-6 pt-8 pb-6 flex-grow scrollbar-hide w-full max-h-full">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("DrawerAttributeTitle")} />
              <div className="col-span-8 sm:col-span-4">
                {/* <SelectAttribute
                  register={register}
                  label="Attribute Title"
                  name="title"
                /> */}
                <InputArea
                  required={true}
                  register={register}
                  label="Attribute Title"
                  name="title"
                  type="text"
                  placeholder="Color or Size or Dimension or Material or Fabric"
                  hasError={errors.title}
                />
                <Error errorName={errors.title} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
              <LabelArea label={t("DisplayName")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Display Name"
                  name="name"
                  type="text"
                  placeholder="Display Name"
                  hasError={errors.name}
                />
                <Error errorName={errors.name} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 relative">
              <LabelArea label={t("DrawerOptions")} />
              <div className="col-span-8 sm:col-span-4 ">
                <Controller
                  name="option"
                  control={control}
                  defaultValue="dropdown"
                  rules={{ required: "Option is required!" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue="dropdown"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("DrawerSelecttype")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dropdown">
                          {t("Dropdown")}
                        </SelectItem>
                        <SelectItem value="radio">{t("Radio")}</SelectItem>
                        <SelectItem value="checkbox">
                          {t("Checkbox")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Error errorName={errors.option} />
              </div>
            </div>
          </div>

          {!id && (
            <div className="px-6 flex-grow scrollbar-hide w-full max-h-full pb-6 mb-8">
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
                <LabelArea label={t("Variants")} />
                <div className="col-span-8 sm:col-span-4">
                  <TagInputTwo
                    notes={variants}
                    addNote={addVariant}
                    removeNote={removeVariant}
                  />
                </div>
              </div>
            </div>
          )}
        </Scrollbars>

        <DrawerButton id={id} title="Attribute" isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default AttributeDrawer;
