"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiLock, FiCheck } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

//internal import
import { notifyError, notifySuccess } from "@utils/toast";
import ShowToast from "@components/common/ShowToast";
import AuthButton from "@components/form/AuthButton";
import { Input } from "@components/ui/input";

// Zod validation schema for reset password
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const params = useParams();
  const router = useRouter();
  const token = params?.token;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword: data.newPassword }),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Failed to reset password");
      }

      notifySuccess(resData.message || "Password reset successful!");
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      notifyError(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Calculate password strength
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) return { level: score, label: "Weak", color: "bg-red-500" };
    if (score === 3)
      return { level: score, label: "Fair", color: "bg-yellow-500" };
    if (score === 4)
      return { level: score, label: "Good", color: "bg-green-400" };
    return { level: score, label: "Strong", color: "bg-primary" };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-muted py-8 px-4 flex items-center justify-center">
      <ShowToast />
      <div className="mx-auto max-w-md w-full">
        {success ? (
          <>
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary rounded-2xl shadow-lg mb-6">
                <FiCheck className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full opacity-60" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-accent rounded-full opacity-60" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Password Reset!
              </h1>
              <p className="text-muted-foreground">
                Your password has been changed successfully
              </p>
            </div>

            {/* Success Card */}
            <div className="bg-background rounded-2xl shadow-xl p-8 border border-border text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground mb-4">
                You can now sign in with your new password.
              </p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Redirecting to login page...
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary rounded-2xl shadow-lg mb-6">
                <FiLock className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full opacity-60" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-accent rounded-full opacity-60" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Reset Password
              </h1>
              <p className="text-muted-foreground">Enter your new password below</p>
            </div>

            {/* Form Card */}
            <div className="bg-background rounded-2xl shadow-xl p-8 border border-border">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="form-group">
                  <label className="block text-muted-foreground font-medium text-sm mb-2">
                    New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      type="password"
                      {...register("newPassword")}
                      placeholder="Enter new password"
                      hasError={errors.newPassword}
                      className="pl-11"
                    />
                  </div>
                  {newPassword && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-1.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              i <= strength.level
                                ? strength.color
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs font-medium ${
                          strength.level <= 2
                            ? "text-red-500"
                            : strength.level === 3
                            ? "text-yellow-500"
                            : "text-primary"
                        }`}
                      >
                        Password strength: {strength.label}
                      </p>
                    </div>
                  )}
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label className="block text-muted-foreground font-medium text-sm mb-2">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      type="password"
                      {...register("confirmPassword")}
                      placeholder="Confirm new password"
                      hasError={errors.confirmPassword}
                      className="pl-11"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <AuthButton
                  type="submit"
                  loading={loading}
                  loadingText="Resetting..."
                >
                  Reset Password
                </AuthButton>
              </form>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Protected by industry-standard encryption
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
