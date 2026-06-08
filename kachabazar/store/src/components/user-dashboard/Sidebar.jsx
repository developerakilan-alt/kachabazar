"use client";
import Link from "next/link";

//internal import
import {
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  BellIcon,
  StarIcon,
  UserCircleIcon,
  KeyIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useSetting } from "@context/SettingContext";
import { getUserSession } from "@lib/auth-client";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { storeCustomization } = useSetting();

  const userInfo = getUserSession();

  const dashboard = storeCustomization?.dashboard;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { showingTranslateValue } = useUtilsFunction();

  const handleLogOut = () => {
    signOut();
    Cookies.remove("couponInfo");
    router.push("/");
  };

  const userSidebar = [
    {
      title: showingTranslateValue(dashboard?.dashboard_title),
      href: "/user/dashboard",
      icon: Squares2X2Icon,
    },

    {
      title: showingTranslateValue(dashboard?.my_order),
      href: "/user/my-orders",
      icon: ClipboardDocumentListIcon,
    },
    {
      title: "Notifications",
      href: "/user/notifications",
      icon: BellIcon,
    },
    {
      title: "My Review",
      href: "/user/my-reviews",
      icon: StarIcon,
    },
    {
      title: "My Account",
      href: "/user/my-account",
      icon: UserCircleIcon,
    },
    {
      title: showingTranslateValue(dashboard?.update_profile),
      href: "/user/update-profile",
      icon: UserCircleIcon,
    },
    {
      title: showingTranslateValue(dashboard?.change_password),
      href: "/user/change-password",
      icon: KeyIcon,
    },
  ];

  return (
    <div>
      {/* Mobile Dropdown */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center cursor-pointer justify-between w-full p-3 bg-card rounded-xl border border-border transition-all"
        >
          <div className="flex flex-row items-center">
            <div className="relative w-10 h-10">
              <div className="relative rounded-full w-10 h-10 border-2 border-border flex items-center justify-center bg-muted overflow-hidden">
                {userInfo?.image &&
                (userInfo.image.startsWith("http://") ||
                  userInfo.image.startsWith("https://")) ? (
                  <Image
                    src={userInfo.image}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full bg-muted"
                    alt={userInfo?.name?.[0] || "U"}
                  />
                ) : (
                  <div className="flex items-center text-xl font-semibold justify-center">
                    {userInfo?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </div>
            <div className="ml-3">
              <h5 className="text-left text-md font-semibold leading-none text-foreground line-h">
                {userInfo?.name}
              </h5>
              <p className="text-sm text-muted-foreground">{userInfo?.email}</p>
            </div>
          </div>
          {isDropdownOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {isDropdownOpen && (
          <div className="mt-1 bg-card rounded-xl border border-border overflow-hidden">
            {userSidebar?.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center px-4 py-3 hover:bg-muted border-b border-border text-sm font-medium text-muted-foreground cursor-pointer"
                onClick={() => setIsDropdownOpen(false)}
              >
                <item.icon className="h-4 w-4 mr-3 text-muted-foreground shrink-0" />
                {item.title}
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogOut();
                setIsDropdownOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 hover:bg-muted text-sm font-medium cursor-pointer text-muted-foreground"
            >
              <ArrowRightStartOnRectangleIcon className="h-4 w-4 mr-3 text-muted-foreground shrink-0" />
              {showingTranslateValue(storeCustomization?.navbar?.logout)}
            </button>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="flex flex-col lg:flex-row w-full">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block shrink-0 w-full">
          <div className="rounded-2xl sticky top-4 bg-card border border-border p-5">
            {/* Avatar Section */}
            <div className="flex flex-row items-center mb-6 pb-5 border-b border-border">
              <div className="relative w-16 h-16">
                <div className="relative w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center bg-muted overflow-hidden">
                  {userInfo?.image &&
                  (userInfo.image.startsWith("http://") ||
                    userInfo.image.startsWith("https://")) ? (
                    <img
                      src={userInfo.image}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full bg-muted"
                      alt={userInfo?.name?.[0] || "U"}
                    />
                  ) : (
                    <div className="flex items-center text-xl font-semibold justify-center">
                      {userInfo?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
              </div>
              <div className="ml-3">
                <div>
                  <h5 className="text-lg text-left font-semibold leading-none text-foreground line-h">
                    {userInfo?.name}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {userInfo?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            {userSidebar?.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  href={item.href}
                  key={item.title}
                  className={`inline-flex items-center rounded-lg hover:bg-muted py-3 px-4 text-sm font-medium w-full mb-1 transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon
                    className={`shrink-0 h-4 w-4 mr-3 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    aria-hidden="true"
                  />

                  {item.title}
                </Link>
              );
            })}

            {/* Logout Button */}
            <span className="p-3 px-4 flex items-center rounded-lg hover:bg-red-50 w-full mt-2 pt-4 border-t border-border cursor-pointer group">
              <ArrowRightStartOnRectangleIcon className="shrink-0 h-4 w-4 text-muted-foreground group-hover:text-red-500" />
              <button
                onClick={handleLogOut}
                className="inline-flex items-center justify-between ml-3 text-sm font-medium w-full text-left cursor-pointer transition-colors text-muted-foreground group-hover:text-destructive"
              >
                {showingTranslateValue(storeCustomization?.navbar?.logout)}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
