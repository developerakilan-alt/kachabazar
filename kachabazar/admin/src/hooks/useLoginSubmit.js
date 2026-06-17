import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";

//internal import
import { AdminContext } from "@/context/AdminContext";
import AdminServices from "@/services/AdminServices";
import DeliveryBoyServices from "@/services/DeliveryBoyServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import { handleApiValidationErrors } from "@/utils/validation";

const useLoginSubmit = () => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AdminContext);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({
    name,
    email,
    verifyEmail,
    password,
    role,
    loginMode,
  }) => {
    setLoading(true);
    const cookieTimeOut = 0.5;

    try {
      if (location.pathname === "/login") {
        let res;

        if (loginMode === "delivery-boy") {
          res = await DeliveryBoyServices.loginDeliveryBoy({ email, password });
        } else {
          res = await AdminServices.loginAdmin({ email, password });
        }

        if (res) {
          notifySuccess("Login Success!");
          dispatch({ type: "USER_LOGIN", payload: res });
          Cookies.set("adminInfo", JSON.stringify(res), {
            expires: cookieTimeOut,
            sameSite: "Lax",
          });

          if (loginMode === "delivery-boy") {
            navigate("/my-dashboard", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }
      }

      if (location.pathname === "/signup") {
        const res = await AdminServices.registerAdmin({
          name,
          email,
          password,
          role,
        });

        if (res) {
          notifySuccess("Register Success!");
          dispatch({ type: "USER_LOGIN", payload: res });
          Cookies.set("adminInfo", JSON.stringify(res), {
            expires: cookieTimeOut,
            sameSite: "Lax",
          });
          navigate("/", { replace: true });
        }
      }

      if (location.pathname === "/forgot-password") {
        const res = await AdminServices.forgetPassword({ verifyEmail });

        notifySuccess(res.message);
      }
    } catch (err) {
      // Handle validation errors from API and set field-level errors
      handleApiValidationErrors(err, setError, notifyError);
    } finally {
      setLoading(false);
    }
  };

  return {
    control,
    onSubmit,
    register,
    handleSubmit,
    errors,
    loading,
    setValue,
  };
};

export default useLoginSubmit;
