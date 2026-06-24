"use client";

import { FiLock, FiMail } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LoginSlideshow from "@components/login/LoginSlideshow";

//internal imports
import { notifyError } from "@utils/toast";
import Error from "@components/form/Error";
import InputArea from "@components/form/InputArea";
import ShowToast from "@components/common/ShowToast";
import { useSetting } from "@context/SettingContext";

// Zod validation schema for login
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const { globalSetting } = useSetting();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || "/user/dashboard";

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      notifyError(decodeURIComponent(error));
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "justin@gmail.com",
      password: "12345678",
    },
  });

  const submitHandler = async ({ email, password }) => {
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: redirectUrl || "/",
    });

    setLoading(false);

    if (result?.error) {
      notifyError(result?.error);
    } else if (result?.ok) {
      router.push(result.url);
    }
  };

  return (
    <>
      <ShowToast />
      <div className="min-h-screen flex flex-col lg:flex-row bg-background">
        {/* Left Side: Category Slideshow (hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/2">
          <LoginSlideshow />
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
          <div className="max-w-md w-full">
            {/* Logo */}
            <div className="mb-8">
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
            {/* Headers */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Sign in to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            <form
                onSubmit={handleSubmit(submitHandler)}
                className="space-y-6"
              >
                <div>
                  <InputArea
                    register={register}
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="justin@gmail.com"
                    Icon={FiMail}
                  />
                  <Error errorMessage={errors.email} />
                </div>

                <div>
                  <InputArea
                    register={register}
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    Icon={FiLock}
                  />
                  <Error errorMessage={errors.password} />
                </div>

                <div className="flex items-center justify-start mt-2">
                  <Link
                    href="/auth/forget-password"
                    className="text-sm font-semibold text-primary hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-3 px-4 font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-70 mt-4"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
