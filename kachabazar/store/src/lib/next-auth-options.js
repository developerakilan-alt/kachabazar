// dynamicSettings.js

import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import {
  loginCustomer,
  signUpWithOauthProvider,
  verifyOtpAndLogin,
} from "@services/CustomerServices";
import { getBaseURL, resilientFetch } from "@services/CommonService";

async function refreshAccessToken(token) {
  // console.log("token", token);
  const apiBase = getBaseURL();

  try {
    const response = await resilientFetch(`${apiBase}/customer/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const refreshedTokens = await response.json();
    // console.log("refreshTokens", refreshedTokens);

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      token: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + refreshedTokens.expiresIn * 1000,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken, // reuse old if not rotated
    };
  } catch (error) {
    // console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const getDynamicAuthOptions = async () => {
  const providers = [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || process.env.NEXT_PUBLIC_GITHUB_SECRET || "",
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID || process.env.NEXT_PUBLIC_FACEBOOK_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || process.env.NEXT_PUBLIC_FACEBOOK_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        phone: { label: "Phone", type: "text" },
      },
      authorize: async (credentials) => {
        // OTP-based login (email or phone)
        if (credentials.otp) {
          const { userInfo, error } = await verifyOtpAndLogin({
            email: credentials.email || undefined,
            phone: credentials.phone || undefined,
            otp: credentials.otp,
          });
          if (error) {
            throw new Error(error);
          }
          return userInfo;
        }

        // Password-based login
        const { userInfo, error } = await loginCustomer(credentials);
        if (error) {
          throw new Error(error);
        }
        return userInfo;
      },
    }),
  ];

  const authOptions = {
    providers,
    callbacks: {
      async signIn({ user, account }) {
        if (account.provider !== "credentials") {
          try {
            const { res, error } = await signUpWithOauthProvider(user);

            if (error) {
              console.error("OAuth sign-in error:", error);
              return false;
            }

            if (res.token) {
              user.token = res.token;
              user.refreshToken = res.refreshToken;
              user.expiresIn = res.expiresIn;
              user._id = res._id;
              user.address = res.address;
              user.phone = res.phone;
              user.image = res.image;
            } else {
              console.error("OAuth sign-in: No token received");
              return false;
            }
          } catch (error) {
            console.error("OAuth sign-in exception:", error);
            return false;
          }
        }
        return true;
      },
      async jwt({ token, user, trigger, session }) {
        if (user) {
          token.id = user._id;
          token.name = user.name;
          token.email = user.email;
          token.address = user.address;
          token.phone = user.phone;
          token.image = user.image;
          token.token = user.token;
          token.refreshToken = user.refreshToken;
          token.accessTokenExpires =
            Date.now() + (user.expiresIn || 900) * 1000;
        }

        if (trigger === "update" && session) {
          return {
            ...token,
            ...session.user,
          };
        }

        // return token;
        // If token still valid, just return it
        if (Date.now() < token.accessTokenExpires) {
          return token;
        }

        // Otherwise refresh it
        return await refreshAccessToken(token);
      },
      async session({ session, token }) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.address = token.address;
        session.user.phone = token.phone;
        session.user.image = token.image;
        session.user.token = token.token;
        session.user.refreshToken = token.refreshToken;
        session.error = token.error;

        return session;
      },
      async redirect({ url, baseUrl }) {
        return url.startsWith(baseUrl) ? url : `${baseUrl}/user/dashboard`;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
  };

  return authOptions;
};
