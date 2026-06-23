import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import CategoryServices from "@/services/CategoryServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import useTranslationValue from "./useTranslationValue";
import { useAction } from "@/context/ActionContext";
import { categorySchema, handleApiValidationErrors } from "@/utils/validation";

const useCategorySubmit = (id, data) => {
  const { setIsUpdate, lang } = useContext(SidebarContext);
  const { openDrawer, closeDrawer } = useAction();
  const [resData, setResData] = useState({});
  const [checked, setChecked] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [children, setChildren] = useState([]);
  const [language, setLanguage] = useState("en");
  const [published, setPublished] = useState(true);
  const [selectCategoryName, setSelectCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handlerTextTranslateHandler } = useTranslationValue();

  const queryClient = useQueryClient();

  const refreshCategoryQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
    queryClient.invalidateQueries({ queryKey: ["allCategories"] });
    queryClient.invalidateQueries({ queryKey: ["categories-all"] });
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  // console.log("lang", lang, language);

  // console.log("resData", resData);

  const onSubmit = async ({ name, description }) => {
    console.log("[CategorySubmit] onSubmit called:", { name, description, id });
    try {
      setIsSubmitting(true);
      const nameTranslates = await handlerTextTranslateHandler(
        name,
        language,
        resData?.name,
      );
      // console.log("nameTranslates", nameTranslates);
      // return;
      const descriptionTranslates = await handlerTextTranslateHandler(
        description,
        language,
        resData?.description,
      );

      const categoryData = {
        name: {
          ...nameTranslates,
          [language]: name,
        },
        description: {
          ...descriptionTranslates,
          [language]: description ? description : "",
        },
        parentId: checked ? checked : undefined,
        parentName: selectCategoryName ? selectCategoryName : "Home",

        icon: imageUrl,
        status: published ? "show" : "hide",
        lang: language,
      };

      console.log("[CategorySubmit] Submitting data:", { categoryData, resData, checked, imageUrl });
      // setIsSubmitting(false);
      // return;

      if (id) {
        const res = await CategoryServices.updateCategory(id, categoryData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        reset();
        refreshCategoryQueries();
      } else {
        const res = await CategoryServices.addCategory(categoryData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        refreshCategoryQueries();
      }
    } catch (err) {
      console.error("[CategorySubmit] Error:", err);
      setIsSubmitting(false);
      // Handle validation errors from API and set field-level errors
      handleApiValidationErrors(err, setError, notifyError);
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue("name", resData.name[lang ? lang : "en"]);
      setValue("description", resData.description[lang ? lang : "en"]);
    }
  };

  useEffect(() => {
    if (!id) {
      setResData({});
      setValue("name");
      setValue("parentId");
      setValue("parentName");
      setValue("description");
      setValue("icon");
      setImageUrl("");
      setPublished(true);
      clearErrors("name");
      clearErrors("parentId");
      clearErrors("parentName");
      clearErrors("description");
      setSelectCategoryName("Home");
      setLanguage(lang);
      setValue("language", language);

      if (data !== undefined && data[0]?._id !== undefined) {
        setChecked(data[0]._id);
      }
      return;
    }
  }, [setValue, id, openDrawer, clearErrors, lang]);
    useEffect(() => {
      if (id) {
        (async () => {
          try {
            const res = await CategoryServices.getCategoryById(id);
            console.log("[CategorySubmit] Fetched category:", { id, res });

            if (res) {
              setResData(res);
              setValue("name", res.name[language ? language : "en"]);
              setValue(
                "description",
                res.description[language ? language : "en"],
              );
              setValue("language", language);
              const parentIdValue = res.parentId || "";
              setValue("parentId", parentIdValue);
              setValue("parentName", res.parentName);
              setSelectCategoryName(res.parentName);
              setChecked(parentIdValue);
              setImageUrl(res.icon);
              setPublished(res.status === "show" ? true : false);
            }
          } catch (err) {
            console.error("[CategorySubmit] Fetch error:", err);
            notifyError(
              err?.response?.data?.message || err?.message || "Failed to load category"
            );
          }
        })();
      }
    }, [id]);

  return {
    control,
    register,
    language,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    children,
    setChildren,
    published,
    setPublished,
    checked,
    setChecked,
    isSubmitting,
    selectCategoryName,
    setSelectCategoryName,
    handleSelectLanguage,
  };
};

export default useCategorySubmit;
