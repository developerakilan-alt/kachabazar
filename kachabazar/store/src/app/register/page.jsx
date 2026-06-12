"use client";

import Link from "next/link";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import { useActionState, useEffect, useState } from "react";

//internal import
import Error from "@components/form/Error";
import { notifyError } from "@utils/toast";
import ErrorTwo from "@components/form/ErrorTwo";
import ShowToast from "@components/common/ShowToast";
import SubmitButton from "@components/form/SubmitButton";
import InputAreaTwo from "@components/form/InputAreaTwo";
import BottomNavigation from "@components/login/BottomNavigation";
import { verifyEmailAction } from "@lib/actions/auth.actions";

// Password strength calculation
const calculatePasswordStrength = (password) => {
  if (!password) return { level: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { level: 1, label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { level: 2, label: "Fair", color: "bg-yellow-500" };
  if (score <= 4) return { level: 3, label: "Good", color: "bg-blue-500" };
  return { level: 4, label: "Strong", color: "bg-green-500" };
};

const Register = () => {
  const [state, formAction] = useActionState(verifyEmailAction, undefined);
  const [password, setPassword] = useState("");
  const passwordStrength = calculatePasswordStrength(password);

  useEffect(() => {
    // console.log("state error 1st", state);
    if (state?.error) {
      // console.log("state error", state);
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
                  <h2 className="text-3xl font-bold ">Signing Up</h2>
                  <p className="text-sm md:text-base text-muted-foreground mt-1 mb-4">
                    Create an account with email
                  </p>
                </div>
                <form
                  action={formAction}
                  className="flex flex-col justify-center"
                >
                  <div className="grid grid-cols-1 gap-5">
                    <div className="form-group">
                      <InputAreaTwo
                        label="Name"
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        Icon={FiUser}
                      />

                      <Error errorName={state?.errors?.name?.join(" ")} />
                    </div>

                    <div className="form-group">
                      <InputAreaTwo
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
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        Icon={FiLock}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      {/* Password Strength Indicator */}
                      {password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">
                              Password Strength
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                passwordStrength.level === 1
                                  ? "text-red-600"
                                  : passwordStrength.level === 2
                                    ? "text-yellow-600"
                                    : passwordStrength.level === 3
                                      ? "text-blue-600"
                                      : "text-green-600"
                              }`}
                            >
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={`h-1.5 flex-1 rounded-full ${
                                  level <= passwordStrength.level
                                    ? passwordStrength.color
                                    : "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {state?.errors?.password && (
                        <ErrorTwo errors={state?.errors?.password} />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex ms-auto">
                        <Link
                          href="/auth/forget-password"
                          className="text-end text-sm text-foreground ps-3 underline hover:no-underline focus:outline-none"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                    <SubmitButton title={"Register"} />
                  </div>
                </form>
                <BottomNavigation
                  route={"/auth/login"}
                  pageName={"Login"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
