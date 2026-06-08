import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Truck } from "lucide-react";

// internal imports
import Error from "@/components/form/others/Error";
import LabelArea from "@/components/form/selectOption/LabelArea";
import InputArea from "@/components/form/input/InputArea";
import ImageLight from "@/assets/img/login-office.jpeg";
import ImageDark from "@/assets/img/login-office-dark.jpeg";
import useLoginSubmit from "@/hooks/useLoginSubmit";

const Login = () => {
  const { t } = useTranslation();
  const { onSubmit, register, handleSubmit, errors, loading, setValue } =
    useLoginSubmit();
  const [loginMode, setLoginMode] = useState("admin"); // "admin" | "delivery-boy"

  // Update default values when login mode changes
  useEffect(() => {
    if (loginMode === "admin") {
      setValue("email", "admin@gmail.com");
      setValue("password", "12345678");
    } else {
      setValue("email", "james.rider@gmail.com");
      setValue("password", "12345678");
    }
  }, [loginMode, setValue]);

  return (
    <div className="flex items-center min-h-screen p-6 bg-[#f8f7f4] ">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-card rounded-lg shadow-xl ">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              {/* Login Mode Toggle */}
              <div className="flex rounded-lg bg-muted p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setLoginMode("admin")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
                    loginMode === "admin"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode("delivery-boy")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
                    loginMode === "delivery-boy"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Truck className="h-4 w-4" />
                  Delivery Boy
                </button>
              </div>

              <h1 className="mb-6 text-2xl font-semibold text-foreground">
                {loginMode === "admin" ? "Admin Login" : "Delivery Boy Login"}
              </h1>
              <form
                onSubmit={handleSubmit((data) =>
                  onSubmit({ ...data, loginMode }),
                )}
              >
                <LabelArea label="Email" />
                <InputArea
                  required
                  register={register}
                  defaultValue={
                    loginMode === "admin"
                      ? "admin@gmail.com"
                      : "james.rider@gmail.com"
                  }
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder={
                    loginMode === "admin"
                      ? "admin@example.com"
                      : "rider@example.com"
                  }
                />
                <Error errorName={errors.email} />

                <div className="mt-6" />

                <LabelArea label="Password" />
                <InputArea
                  required
                  register={register}
                  defaultValue="12345678"
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="********"
                />
                <Error errorName={errors.password} />

                <Button
                  disabled={loading}
                  isLoading={loading}
                  type="submit"
                  size="lg"
                  className="mt-4 w-full"
                >
                  {t("LoginTitle")}
                </Button>
              </form>

              <div className="mt-6 flex flex-col space-y-2">
                <Link
                  className="text-sm font-medium text-primary  hover:underline"
                  to="/forgot-password"
                >
                  {t("ForgotPassword")}
                </Link>
                {loginMode === "admin" && (
                  <Link
                    className="text-sm font-medium text-primary  hover:underline"
                    to="/signup"
                  >
                    {t("CreateAccountTitle")}
                  </Link>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Login;
