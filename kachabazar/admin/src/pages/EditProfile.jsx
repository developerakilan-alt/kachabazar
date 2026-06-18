import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

//internal import
import { AdminContext } from "@/context/AdminContext";
import useStaffSubmit from "@/hooks/useStaffSubmit";
import PageTitle from "@/components/common/PageTitle";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";
import InputArea from "@/components/form/input/InputArea";
import Error from "@/components/form/others/Error";
import SelectRole from "@/components/form/selectOption/SelectRole";
import AnimatedContent from "@/components/common/AnimatedContent";
import DeliveryBoyServices from "@/services/DeliveryBoyServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import useTranslationValue from "@/hooks/useTranslationValue";

const EditProfile = () => {
  const { t } = useTranslation();
  const {
    state: { adminInfo },
    dispatch,
  } = useContext(AdminContext);

  const isDeliveryBoy = adminInfo?.role === "delivery-boy";

  // Admin profile editing (existing flow — only used when NOT delivery boy)
  const staffSubmit = useStaffSubmit(isDeliveryBoy ? null : adminInfo?._id);

  // Delivery boy profile editing (separate flow)
  const [dbImageUrl, setDbImageUrl] = useState("");
  const [dbLoading, setDbLoading] = useState(false);
  const [dbSubmitting, setDbSubmitting] = useState(false);
  const { showingTranslateValue } = useUtilsFunction();
  const { handlerTextTranslateHandler } = useTranslationValue();

  const {
    register: dbRegister,
    handleSubmit: dbHandleSubmit,
    setValue: dbSetValue,
    formState: { errors: dbErrors },
  } = useForm();

  // Load delivery boy profile
  useEffect(() => {
    if (!isDeliveryBoy) return;
    const loadProfile = async () => {
      try {
        setDbLoading(true);
        const res = await DeliveryBoyServices.getMyProfile();
        if (res) {
          dbSetValue("name", showingTranslateValue(res.name) || "");
          dbSetValue("email", res.email || "");
          dbSetValue("phone", res.phone || "");
          setDbImageUrl(res.image || "");
        }
      } catch (err) {
        notifyError(err?.response?.data?.message || err?.message);
      } finally {
        setDbLoading(false);
      }
    };
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeliveryBoy]);

  const onDeliveryBoySubmit = async (data) => {
    if (!data.name?.trim()) {
      return notifyError("Name is required!");
    }
    if (!data.phone?.trim()) {
      return notifyError("Contact number is required!");
    }

    try {
      setDbSubmitting(true);

      const nameTranslates = await handlerTextTranslateHandler(
        data.name,
        "en",
        adminInfo?.name,
      );

      const profileData = {
        name: { ...nameTranslates, en: data.name },
        phone: data.phone,
        image: dbImageUrl,
      };

      if (data.password) {
        if (data.password.length < 6) {
          setDbSubmitting(false);
          return notifyError("Password must be at least 6 characters!");
        }
        profileData.password = data.password;
      }

      const res = await DeliveryBoyServices.updateMyProfile(profileData);

      // Update cookie with fresh data
      const cookieTimeOut = 0.5;
      dispatch({ type: "USER_LOGIN", payload: res });
      Cookies.set("adminInfo", JSON.stringify(res), {
        expires: cookieTimeOut,
        sameSite: "Lax",
      });

      notifySuccess(res.message || "Profile updated successfully!");
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setDbSubmitting(false);
    }
  };

  // Delivery Boy edit profile (limited fields)
  if (isDeliveryBoy) {
    return (
      <>
        <PageTitle> {t("EditProfile")} </PageTitle>
        <AnimatedContent>
          <div className="w-full mx-auto max-w-4xl mt-6 pb-20">
            {dbLoading ? (
              <div className="p-12 text-center text-muted-foreground">
                Loading profile...
              </div>
            ) : (
              <form onSubmit={dbHandleSubmit(onDeliveryBoySubmit)}>
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle>Delivery Boy Profile</CardTitle>
                    <CardDescription>
                      Manage your profile information and account security.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label={t("ProfilePicture")} />
                    <div className="col-span-8 sm:col-span-4">
                      <Uploader
                        imageUrl={dbImageUrl}
                        setImageUrl={setDbImageUrl}
                        folder="delivery-boy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label={t("ProfileName")} />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                        required={true}
                        register={dbRegister}
                        label="Name"
                        name="name"
                        type="text"
                        placeholder="Your Name"
                      />
                      <Error errorName={dbErrors.name} />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label={t("ProfileEmail")} />
                    <div className="col-span-8 sm:col-span-4">
                      <Input
                        value={adminInfo?.email || ""}
                        type="text"
                        placeholder="Email"
                        disabled
                        className="disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Email cannot be changed. Contact admin for updates.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label={t("ProfileContactNumber")} />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                        required={true}
                        register={dbRegister}
                        label="Contact Number"
                        name="phone"
                        type="text"
                        placeholder="Contact Number"
                      />
                      <Error errorName={dbErrors.phone} />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="New Password" />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                        register={dbRegister}
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Leave blank to keep current password"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum 6 characters. Leave blank to keep current.
                      </p>
                    </div>
                  </div>
                  </CardContent>
                </Card>

                <div className="sticky bottom-6 flex justify-center mt-6 z-50 pointer-events-none">
                  <Button
                    type="submit"
                    className="h-12 px-8 shadow-lg rounded-full text-base pointer-events-auto"
                    disabled={dbSubmitting}
                  >
                    {dbSubmitting ? "Updating..." : t("updateProfile")}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </AnimatedContent>
      </>
    );
  }

  // Admin/Staff edit profile (full access)
  const {
    control,
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
  } = staffSubmit;

  return (
    <>
      <PageTitle> {t("EditProfile")} </PageTitle>
      <AnimatedContent>
        <div className="w-full mx-auto max-w-4xl mt-6 pb-20">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>
                  Manage your personal information and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProfilePicture")} />
                <div className="col-span-8 sm:col-span-4">
                  <Uploader
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    folder="customer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProfileName")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    required={true}
                    register={register}
                    label="Name"
                    name="name"
                    type="text"
                    placeholder="Your Name"
                  />
                  <Error errorName={errors.name} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProfileEmail")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    required={true}
                    register={register}
                    label="Email"
                    name="email"
                    type="text"
                    placeholder="Email"
                  />
                  <Error errorName={errors.email} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProfileContactNumber")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    required={true}
                    register={register}
                    label="Contact Number"
                    name="phone"
                    type="text"
                    placeholder="Contact Number"
                  />
                  <Error errorName={errors.phone} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProfileYourRole")} />
                <div className="col-span-8 sm:col-span-4">
                  <SelectRole
                    register={register}
                    control={control}
                    label="Role"
                    name="role"
                  />
                  <Error errorName={errors.role} />
                  <Error errorName={errors.role} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="sticky bottom-6 flex justify-center mt-6 z-50 pointer-events-none">
            <Button type="submit" className="h-12 px-8 shadow-lg rounded-full text-base pointer-events-auto">
              {t("updateProfile")}
            </Button>
          </div>
        </form>
        </div>
      </AnimatedContent>
    </>
  );
};

export default EditProfile;
