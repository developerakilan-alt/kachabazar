"use client";

import Link from "next/link";
import { FiUser } from "react-icons/fi";

//internal imports
import { userNavigation } from "@utils/data";
import { getUserSession } from "@lib/auth-client";
import { isValidImageUrl } from "@utils/imageUtils";

const ProfileDropDown = () => {
  const userInfo = getUserSession();
  const hasValidImage = isValidImageUrl(userInfo?.image);

  return (
    <>
      {userInfo?.email ? (
        <div className="relative group">
          {/* Trigger */}
          <button className="-m-1.5 flex items-center p-1.5">
            <span className="sr-only">Open user menu</span>

            {hasValidImage ? (
              <img
                src={userInfo.image}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full bg-muted"
                alt={userInfo?.name?.[0] || "U"}
              />
            ) : (
              <div className="flex items-center justify-center h-8 w-8 rounded-full dark:bg-muted bg-muted text-xl font-bold text-center mr-4">
                {userInfo?.name?.charAt(0) || "U"}
              </div>
            )}
          </button>

          {/* Hover dropdown panel */}
          <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute right-0 top-full pt-2 z-50 transition-all duration-200 ease-in-out">
            <div className="w-52 origin-top-right rounded-lg bg-card py-1.5 shadow-lg ring-1 ring-border">
              {userNavigation.map((item) => (
                <div
                  key={item.name}
                  className="px-2 py-0.5 hover:bg-accent transition-colors"
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:text-primary rounded-md"
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span>{item.name}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Link href="/auth/login" className="-m-1.5 flex items-center p-1.5">
          <span className="sr-only">Open user menu</span>

          <FiUser
            className="h-6 w-6 text-primary-foreground"
            aria-hidden="true"
          />
        </Link>
      )}
    </>
  );
};

export default ProfileDropDown;
