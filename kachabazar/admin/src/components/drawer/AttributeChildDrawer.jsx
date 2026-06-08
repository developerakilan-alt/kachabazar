import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

//internal import
import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import DrawerButton from "@/components/form/button/DrawerButton";
import useAttributeSubmit from "@/hooks/useAttributeSubmit";

const AttributeChildDrawer = ({ id }) => {
  const {
    language,
    handleSubmit,
    onSubmits,
    register,
    errors,
    published,
    isSubmitting,
    setPublished,
    handleSelectLanguage,
  } = useAttributeSubmit(id);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full relative px-6 py-4 border-b bg-muted">
        {id ? (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title="Add/Update Attribute Valu"
            description="Add your attribute values and necessary information from here"
          />
        ) : (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title="Add/Update Attribute Values"
            description="Add your attribute values and necessary information from here"
          />
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmits)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <Scrollbars className="flex-1 mb-8">
          <div className="px-6 pt-8 pb-6 flex-grow scrollbar-hide w-full max-h-full">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 items-center">
              <LabelArea label="Display Name" />

              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Display Name"
                  name="name"
                  type="text"
                  placeholder="Color or Size or Dimension or Material or Fabric"
                />
                <Error errorName={errors.name} />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 items-center">
              <LabelArea label="Published" />

              <div className="col-span-8 sm:col-span-4">
                <SwitchToggle
                  handleProcess={setPublished}
                  processOption={published}
                />
                <Error errorName={errors.published} />
              </div>
            </div>
          </div>
        </Scrollbars>

        <DrawerButton id={id} title="Attribute" isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default AttributeChildDrawer;
