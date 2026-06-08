import React, { useContext } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import Select from "react-select";

//internal import
import { routeAccessList } from "@/routes";
import useGetCData from "@/hooks/useGetCData";
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import useStaffSubmit from "@/hooks/useStaffSubmit";
import { useTheme } from "@/context/ThemeContext";
import SelectRole from "@/components/form/selectOption/SelectRole";
import DrawerButton from "@/components/form/button/DrawerButton";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";

const StaffDrawer = ({ id }) => {
  const { role } = useGetCData();
  const { theme } = useTheme();
  const {
    language,
    control,
    register,
    handleSubmit,
    onSubmit,
    errors,
    adminInfo,
    imageUrl,
    setImageUrl,
    isSubmitting,
    selectedDate,
    setSelectedDate,
    accessedRoutes,
    setAccessedRoutes,
    handleSelectLanguage,
  } = useStaffSubmit(id);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      <div className="w-full relative px-6 py-4 border-b bg-muted">
        {id ? (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateStaff")}
            description={t("UpdateStaffdescription")}
          />
        ) : (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddStaffTitle")}
            description={t("AddStaffdescription")}
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
              <LabelArea label="Staff Image" />
              <div className="col-span-8 sm:col-span-4">
                <Uploader
                  folder="admin"
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
                  autoComplete="username"
                  placeholder="Staff name"
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
                  autoComplete="username"
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
                    autoComplete="current-password"
                    placeholder="Password"
                  />
                ) : (
                  <InputArea
                    required={true}
                    register={register}
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                  />
                )}

                <Error errorName={errors.password} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Contact Number" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Contact Number"
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
              <LabelArea label="Joining Date" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  onChange={(e) => setSelectedDate(e.target.value)}
                  label="Joining Date"
                  name="joiningDate"
                  value={selectedDate}
                  type="date"
                  placeholder={t("StaffJoiningDate")}
                />
                <Error errorName={errors.joiningDate} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Staff Role" />
              <div className="col-span-8 sm:col-span-4">
                <SelectRole label="Role" name="role" control={control} />
                {/* <Error errorName={errors.role} /> */}
              </div>
            </div>

            {role === "admin" ||
              (role === "super admin" && (
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Select Routes to given Access" />
                  <div className="col-span-8 sm:col-span-4">
                    <div className="flex items-center justify-end mb-1">
                      <button
                        type="button"
                        className="text-xs text-primary hover:text-primary font-medium"
                        onClick={() => {
                          if (
                            accessedRoutes?.length === routeAccessList.length
                          ) {
                            setAccessedRoutes([]);
                          } else {
                            setAccessedRoutes(routeAccessList);
                          }
                        }}
                      >
                        {accessedRoutes?.length === routeAccessList.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>
                    <Select
                      isMulti
                      options={routeAccessList}
                      value={accessedRoutes}
                      onChange={(v) => setAccessedRoutes(v)}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select Routes"
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
                </div>
              ))}
          </div>
        </Scrollbars>

        <DrawerButton id={id} title="Staff" isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default StaffDrawer;
