import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

//internal import
import DeliveryBoyServices from "@/services/DeliveryBoyServices";
import { SidebarContext } from "@/context/SidebarContext";
import { notifyError, notifySuccess } from "@/utils/toast";
import useTranslationValue from "./useTranslationValue";
import { useAction } from "@/context/ActionContext";
import useDisableForDemo from "./useDisableForDemo";
import { handleApiValidationErrors } from "@/utils/validation";

const useDeliveryBoySubmit = (id) => {
  const { setIsUpdate } = useContext(SidebarContext);
  const { closeDrawer } = useAction();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD"),
  );
  const [language, setLanguage] = useState("en");
  const [resData, setResData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handlerTextTranslateHandler } = useTranslationValue();
  const { handleDisableForDemo } = useDisableForDemo();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (handleDisableForDemo()) {
        return;
      }
      setIsSubmitting(true);

      const nameTranslates = await handlerTextTranslateHandler(
        data.name,
        language,
        resData?.name,
      );

      const deliveryBoyData = {
        name: {
          ...nameTranslates,
          [language]: data.name,
        },
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        zipCode: data.zipCode,
        vehicleType: data.vehicleType,
        vehicleNumber: data.vehicleNumber,
        licenseNumber: data.licenseNumber,
        joiningDate: selectedDate
          ? selectedDate
          : dayjs(new Date()).format("YYYY-MM-DD"),
        image: imageUrl,
      };

      if (id) {
        await DeliveryBoyServices.updateDeliveryBoy(id, deliveryBoyData);
        setIsUpdate(true);
        queryClient.invalidateQueries({ queryKey: ["delivery-boys"] });
        setIsSubmitting(false);
        notifySuccess("Delivery Boy Updated Successfully!");
        closeDrawer();
      } else {
        const res = await DeliveryBoyServices.addDeliveryBoy(deliveryBoyData);
        setIsUpdate(true);
        queryClient.invalidateQueries({ queryKey: ["delivery-boys"] });
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      setIsSubmitting(false);
      // Handle validation errors from API and set field-level errors
      handleApiValidationErrors(err, setError, notifyError);
    }
  };

  const getDeliveryBoyData = async () => {
    try {
      const res = await DeliveryBoyServices.getDeliveryBoyById(id);

      if (res) {
        setResData(res);
        setValue("name", res.name[language ? language : "en"]);
        setValue("email", res.email);
        setValue("phone", res.phone);
        setValue("address", res.address);
        setValue("city", res.city);
        setValue("country", res.country);
        setValue("zipCode", res.zipCode);
        setValue("vehicleType", res.vehicleType);
        setValue("vehicleNumber", res.vehicleNumber);
        setValue("licenseNumber", res.licenseNumber);
        setSelectedDate(dayjs(res.joiningDate).format("YYYY-MM-DD"));
        setImageUrl(res.image);
      }
    } catch (err) {
      // Handle validation errors from API and set field-level errors
      handleApiValidationErrors(err, setError, notifyError);
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);

    if (Object.keys(resData).length > 0) {
      setValue("name", resData.name[lang ? lang : "en"]);
    }
  };

  useEffect(() => {
    if (id) {
      getDeliveryBoyData();
    }
  }, [id]);

  return {
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
  };
};

export default useDeliveryBoySubmit;
