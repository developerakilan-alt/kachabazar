import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

//internal import

import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import useCustomerSubmit from "@/hooks/useCustomerSubmit";
import DrawerButton from "@/components/form/button/DrawerButton";

const CustomerDrawer = ({ id }) => {
  const { register, handleSubmit, onSubmit, errors, isSubmitting } =
    useCustomerSubmit(id);

  // console.log('##CustomerDrawer',)
  return (
    <div className="flex flex-col h-full">
      <div className="w-full relative px-6 py-4 border-b bg-muted">
        {id ? (
          <Title
            title={"Update Customer"}
            description={"Update your Customer necessary information from here"}
          />
        ) : (
          <Title
            title={"Add Customer"}
            description={"Add your Customer necessary information from here"}
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
              <LabelArea label={"Name"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Name"
                  name="name"
                  type="text"
                  placeholder={"Name"}
                />
                <Error errorName={errors.name} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Email"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Email"
                  name="email"
                  type="email"
                  placeholder={"Email"}
                />
                <Error errorName={errors.email} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Phone"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Phone"
                  name="phone"
                  type="text"
                  placeholder={"Phone"}
                />
                <Error errorName={errors.phone} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Address"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Address"
                  name="address"
                  type="text"
                  placeholder={"Address"}
                />
                <Error errorName={errors.address} />
              </div>
            </div>
          </div>
        </Scrollbars>

        <DrawerButton id={id} title="Customer" isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default CustomerDrawer;
