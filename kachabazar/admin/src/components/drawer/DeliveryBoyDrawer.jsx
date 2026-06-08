import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import useDeliveryBoySubmit from "@/hooks/useDeliveryBoySubmit";
import DrawerButton from "@/components/form/button/DrawerButton";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";

const DeliveryBoyDrawer = ({ id }) => {
  const {
    language,
    control,
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    isSubmitting,
    selectedDate,
    setSelectedDate,
    handleSelectLanguage,
  } = useDeliveryBoySubmit(id);
  const { t } = useTranslation();

  const vehicleOptions = [
    { value: "bike", label: "Bike" },
    { value: "bicycle", label: "Bicycle" },
    { value: "car", label: "Car" },
    { value: "van", label: "Van" },
    { value: "scooter", label: "Scooter" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="w-full relative px-6 py-4 border-b bg-muted">
        {id ? (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title="Update Delivery Boy"
            description="Update delivery boy information and details"
          />
        ) : (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title="Add Delivery Boy"
            description="Add a new delivery boy with all required information"
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
              <LabelArea label="Photo" />
              <div className="col-span-8 sm:col-span-4">
                <Uploader
                  folder="delivery-boy"
                  targetWidth={238}
                  targetHeight={238}
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Name" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Name"
                  name="name"
                  type="text"
                  placeholder="Delivery boy name"
                />
                <Error errorName={errors.name} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Email" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Email"
                  name="email"
                  type="text"
                  pattern={
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
                  }
                  placeholder="Email"
                />
                <Error errorName={errors.email} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Password" />
              <div className="col-span-8 sm:col-span-4">
                {id ? (
                  <InputArea
                    register={register}
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Password (leave empty to keep current)"
                  />
                ) : (
                  <InputArea
                    required={true}
                    register={register}
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                )}
                <Error errorName={errors.password} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Phone" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Phone"
                  name="phone"
                  pattern={/^[+]?\d*$/}
                  minLength={6}
                  maxLength={15}
                  type="text"
                  placeholder="Phone number"
                />
                <Error errorName={errors.phone} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Address" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Address"
                  name="address"
                  type="text"
                  placeholder="Address"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="City" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="City"
                  name="city"
                  type="text"
                  placeholder="City"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Country" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Country"
                  name="country"
                  type="text"
                  placeholder="Country"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Vehicle Type" />
              <div className="col-span-8 sm:col-span-4">
                <select
                  {...register("vehicleType", {
                    required: "Vehicle type is required!",
                  })}
                  className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none focus:border-ring focus:ring-ring/40 focus:ring-[3px]"
                >
                  <option value="" hidden>
                    Select vehicle type
                  </option>
                  {vehicleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <Error errorName={errors.vehicleType} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Vehicle Number" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Vehicle Number"
                  name="vehicleNumber"
                  type="text"
                  placeholder="Vehicle number"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="License Number" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="License Number"
                  name="licenseNumber"
                  type="text"
                  placeholder="License number"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Joining Date" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  onChange={(e) => setSelectedDate(e.target.value)}
                  label="Joining Date"
                  name="joiningDate"
                  value={selectedDate}
                  type="date"
                  placeholder="Joining date"
                />
              </div>
            </div>
          </div>
        </Scrollbars>

        <DrawerButton
          id={id}
          title="Delivery Boy"
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};

export default DeliveryBoyDrawer;
