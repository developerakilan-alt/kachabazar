"use client";

import { FiLock, FiMail } from "react-icons/fi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

//internal  import
import Error from "@components/form/Error";
import { notifyError } from "@utils/toast";
import ErrorTwo from "@components/form/ErrorTwo";
import InputAreaTwo from "@components/form/InputAreaTwo";
import SubmitButton from "@components/form/SubmitButton";
import BottomNavigation from "@components/login/BottomNavigation";
import OtpLogin from "@components/login/OtpLogin";
import { handleLoginAction } from "@lib/actions/auth.actions";

const Login = () => {
  const redirectUrl = useSearchParams().get("redirectUrl");
  const [state, formAction] = useActionState(handleLoginAction, undefined);
  const [loginMethod, setLoginMethod] = useState("password"); // "password" | "otp"

  useEffect(() => {
    if (state?.error) {
      notifyError(state?.error);
    }
  });

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="py-4 flex flex-col lg:flex-row w-full">
          <div className="w-full sm:p-5 lg:p-8">
            <div className="mx-auto text-left justify-center rounded-md w-full max-w-lg px-4 py-8 sm:p-10 overflow-hidden align-middle transition-all transform bg-background shadow-xl rounded-2x">
              <div className="overflow-hidden mx-auto">
                <div className="text-center">
                  <h2 className="text-3xl font-bold">Login</h2>
                  <p className="text-sm md:text-base text-muted-foreground mt-1 mb-4">
                    {loginMethod === "password"
                      ? "Login with your email and password"
                      : "Login with OTP verification"}
                  </p>
                </div>

                {/* Login Method Toggle */}
                <div className="flex rounded-lg border border-border mb-6 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setLoginMethod("password")}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                      loginMethod === "password"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod("otp")}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                      loginMethod === "otp"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    OTP Login
                  </button>
                </div>

                {loginMethod === "password" ? (
                  <>
                    <form
                      action={formAction}
                      className="flex flex-col justify-center"
                    >
                      <div className="grid grid-cols-1 gap-5">
                        <div className="form-group">
                          <InputAreaTwo
                            defaultValue=""
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            Icon={FiMail}
                          />
                          <Error errorName={state?.errors?.email?.join(" ")} />
                        </div>
                        <div className="form-group">
                          <InputAreaTwo
                            defaultValue=""
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            Icon={FiLock}
                          />
                          {state?.errors?.password && (
                            <ErrorTwo errors={state?.errors?.password} />
                          )}
                        </div>

                        {/* passing the redirect url for redirect from page after login */}
                        <div className="form-group hidden">
                          <InputAreaTwo
                            defaultValue={redirectUrl || "user/dashboard"}
                            label="redirectUrl"
                            name="redirectUrl"
                            type="text"
                            placeholder="redirectUrl"
                            readOnly={true}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex ms-auto">
                            <Link
                              href={"/auth/forget-password"}
                              type="button"
                              className="text-end text-sm text-foreground ps-3 underline hover:no-underline focus:outline-none"
                            >
                              Forgot password?
                            </Link>
                          </div>
                        </div>
                      </div>
                      <SubmitButton title={"Login"} />
                    </form>
                  </>
                ) : (
                  <OtpLogin redirectUrl={redirectUrl} />
                )}

                <BottomNavigation
                  or={true}
                  route={"/auth/signup"}
                  pageName={"Sign Up"}
                  loginTitle="Login"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
