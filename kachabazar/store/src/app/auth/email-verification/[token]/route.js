import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { token } = await params;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5056/v1";
    const response = await fetch(`${apiBase}/customer/register/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.redirect(
        new URL(
          `/auth/login?error=${encodeURIComponent(data.message || "Verification failed. Link may have expired.")}`,
          request.url,
        ),
      );
    }

    const data = await response.json();

    const redirectResponse = NextResponse.redirect(
      new URL("/user/dashboard", request.url),
    );

    redirectResponse.cookies.set("_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    redirectResponse.cookies.set(
      "_userInfo",
      JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      },
    );

    return redirectResponse;
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        `/auth/login?error=${encodeURIComponent("Verification service unavailable. Please try again.")}`,
        request.url,
      ),
    );
  }
}
