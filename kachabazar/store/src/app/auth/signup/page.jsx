"use client";

import Link from "next/link";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import { useActionState, useEffect, useState } from "react";
import Image from "next/image";

//internal import
import Error from "@components/form/Error";
import { notifyError, notifySuccess } from "@utils/toast";
import ErrorTwo from "@components/form/ErrorTwo";
import InputAreaTwo from "@components/form/InputAreaTwo";
import BottomNavigation from "@components/login/BottomNavigation";
import AuthButton from "@components/form/AuthButton";
import { verifyEmailAction } from "@lib/actions/auth.actions";
import { useSetting } from "@context/SettingContext";
import OtpLogin from "@components/login/OtpLogin";

// Password strength calculation
const calculatePasswordStrength = (password) => {
  if (!password) return { level: 0, label: "", color: "bg-muted" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2)
    return {
      level: 1,
      label: "Weak",
      color: "bg-red-500",
      textColor: "text-red-500",
    };
  if (score <= 3)
    return {
      level: 2,
      label: "Fair",
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
    };
  if (score <= 4)
    return {
      level: 3,
      label: "Good",
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
    };
  return {
    level: 4,
    label: "Strong",
    color: "bg-emerald-600",
    textColor: "text-emerald-600",
  };
};

const SignUp = () => {
  const { globalSetting } = useSetting() || {};
  const [state, formAction, isPending] = useActionState(
    verifyEmailAction,
    undefined,
  );
  const [password, setPassword] = useState("");
  const [signupMethod, setSignupMethod] = useState("email"); // "email" | "otp"
  const passwordStrength = calculatePasswordStrength(password);

  useEffect(() => {
    if (state?.error) {
      notifyError(state?.error);
    }
    if (state?.user) {
      notifySuccess("Verification email sent! Please check your inbox.");
    }
  }, [state]);

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row bg-background">
        {/* Left Side: Background Image Area (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-muted">
          <Image
            src="https://images.unsplash.com/photo-1632406897798-e5472b4a989e?q=80" // Large image placeholder
            alt="Signup Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-y-auto">
          <div className="max-w-md w-full">
            {/* Logo */}
            <div className="mb-8">
              <Link href="/" className="inline-block relative h-10 w-40">
                <Image
                  src={globalSetting?.logo || "/logo/logo-color.svg"}
                  alt={globalSetting?.shop_name || "Kacha Bazar"}
                  fill
                  className="object-contain object-left"
                />
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Signup Method Toggle */}
            <div className="flex mb-6 border-b border-border">
              <button
                type="button"
                onClick={() => setSignupMethod("email")}
                className={`flex-1 pb-2 text-sm font-semibold transition-all duration-200 border-b-2 ${
                  signupMethod === "email"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setSignupMethod("otp")}
                className={`flex-1 pb-2 text-sm font-semibold transition-all duration-200 border-b-2 ${
                  signupMethod === "otp"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                OTP Sign Up
              </button>
            </div>

            {signupMethod === "email" ? (
              <>
                {state?.user ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiMail className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Check Your Email
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      We've sent a verification link to your email address.
                      Please check your inbox and click the link to activate
                      your account.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Didn't receive it? Check your spam folder.
                    </p>
                  </div>
                ) : (
                  <form action={formAction} className="space-y-6">
                    <div>
                      <InputAreaTwo
                        label="Full Name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        Icon={FiUser}
                        defaultValue="Justin"
                        hasError={state?.errors?.name}
                      />
                      <Error errorName={state?.errors?.name?.join(" ")} />
                    </div>

                    <div>
                      <InputAreaTwo
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        Icon={FiMail}
                        defaultValue="justin@gmail.com"
                        hasError={state?.errors?.email}
                      />
                      <Error errorName={state?.errors?.email?.join(" ")} />
                    </div>

                    <div>
                      <InputAreaTwo
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        Icon={FiLock}
                        defaultValue="12345678"
                        onChange={(e) => setPassword(e.target.value)}
                        hasError={state?.errors?.password}
                      />

                      {/* Password Strength Indicator */}
                      {password && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-muted-foreground font-medium">
                              Strength
                            </span>
                            <span
                              className={`text-xs font-semibold ${passwordStrength.textColor}`}
                            >
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
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
                        <div className="mt-1">
                          <ErrorTwo errors={state?.errors?.password} />
                        </div>
                      )}
                    </div>

                    <AuthButton
                      type="submit"
                      loading={isPending}
                      loadingText="Signing Up..."
                      className="h-12 w-full text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none transition-colors disabled:opacity-70 mt-4 block"
                    >
                      Sign Up
                    </AuthButton>
                  </form>
                )}
              </>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-6 font-medium">
                  Sign up instantly using your phone or email OTP.
                </p>
                <OtpLogin redirectUrl="/user/dashboard" />
              </div>
            )}

            <div className="mt-8">
              <BottomNavigation
                or={signupMethod === "email" && !state?.user}
                route="/auth/login"
                pageName="Login"
                loginTitle="Sign Up"
                hideSignupText={true}
              />
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-muted-foreground mt-8">
              By signing up, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
