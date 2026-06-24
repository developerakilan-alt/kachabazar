"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

//internal import
import BottomNavigation from "@components/login/BottomNavigation";
import LoginSlideshow from "@components/login/LoginSlideshow";
import { notifyError, notifySuccess } from "@utils/toast";
import ShowToast from "@components/common/ShowToast";
import Error from "@components/form/Error";
import AuthButton from "@components/form/AuthButton";
import { Input } from "@components/ui/input";
import { useSetting } from "@context/SettingContext";

// Zod validation schema for forget password
const forgetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const ForgetPassword = () => {
  const { globalSetting } = useSetting() || {};
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    setSubmittedEmail(formData.email);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer/forget-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      notifySuccess(
        data.message || "Password reset email sent! Please check your inbox.",
      );
      setSent(true);
    } catch (error) {
      notifyError(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ShowToast />
      <div className="min-h-screen flex flex-col lg:flex-row bg-background">
        {/* Left Side: Background Image Area (hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/2">
          <LoginSlideshow />
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-y-auto">
          <div className="max-w-md w-full">
            {/* Logo */}
            <div className="mb-8 flex justify-center lg:justify-start">
              <Link href="/" className="inline-block relative h-10 w-40">
                <Image
                  src={globalSetting?.logo || "/logo/logo-color.png"}
                  alt={globalSetting?.shop_name || "hautecouturejewellery"}
                  fill
                  unoptimized
                  className="object-contain object-left"
                />
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Forgot password?
              </h1>
              <p className="text-sm text-muted-foreground">
                {sent
                  ? "Check your email for reset instructions"
                  : "No worries, we'll send you reset instructions"}
              </p>
            </div>

            {/* Form & Context */}
            {sent ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiMail className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Check your email
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  We've sent a password reset link to
                </p>
                <p className="font-semibold text-foreground mb-6">
                  {submittedEmail}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    try again
                  </button>
                </p>

                <Link
                  href="/auth/login"
                  className="inline-block w-full py-3 px-4 font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-foreground font-medium text-sm mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="Enter your registered email"
                      hasError={errors.email}
                      className={`pl-11 w-full h-12 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                        errors.email ? "border-destructive" : "border-border"
                      }`}
                    />
                  </div>
                  <Error errorMessage={errors.email} />
                </div>

                <AuthButton
                  type="submit"
                  loading={loading}
                  loadingText="Sending..."
                  className="w-full h-12 text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none transition-colors disabled:opacity-70 mt-4 block"
                >
                  Send Reset Link
                </AuthButton>

                <div className="mt-8 text-center">
                  <Link
                    href="/auth/login"
                    className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                  >
                    &larr; Back to login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
