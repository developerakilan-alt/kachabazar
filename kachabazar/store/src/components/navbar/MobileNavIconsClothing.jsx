"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "react-use-cart";
import { FiHome, FiUser, FiShoppingCart, FiAlignLeft } from "react-icons/fi";

import { getUserSession } from "@lib/auth-client";
import PagesDrawer from "@components/drawer/PagesDrawer";
import CartDrawer from "@components/drawer/CartDrawer";

const MobileNavIconsClothing = ({ categories, categoryError, storeCustomization }) => {
  const [openPageDrawer, setOpenPageDrawer] = useState(false);
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const { totalItems } = useCart();
  const [hydrated, setHydrated] = useState(false);
  const userInfo = getUserSession();

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left icons: menu + home */}
      <div className="flex items-center gap-1">
        <button
          aria-label="Bar"
          onClick={() => setOpenPageDrawer(true)}
          className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none p-2 rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <FiAlignLeft className="w-6 h-6 drop-shadow-xl" />
        </button>
        <Link
          href="/"
          className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
          aria-label="Home"
        >
          <FiHome className="w-6 h-6 drop-shadow-xl" />
        </Link>
      </div>

      {/* Center: logo */}
      <Link href="/" className="flex-shrink-0">
        <Image
          width={120}
          height={38}
          className="h-9 w-auto max-w-[120px] object-contain"
          priority
          src={storeCustomization?.navbar?.logo || "/logo/logo-light.png"}
          alt="logo"
        />
      </Link>

      {/* Right icons: cart + user */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setOpenCartDrawer(!openCartDrawer)}
          className="relative p-2 rounded-full text-white hover:bg-white/20 transition-colors"
          aria-label="Cart"
        >
          {hydrated && totalItems > 0 && (
            <span className="absolute z-10 top-0 right-0 inline-flex items-center justify-center p-1 h-5 w-5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 bg-red-500 rounded-full">
              {totalItems}
            </span>
          )}
          <FiShoppingCart className="w-6 h-6 drop-shadow-xl" />
        </button>

        <div className="p-2 rounded-full text-white hover:bg-white/20 transition-colors">
          {userInfo?.image &&
          (userInfo.image.startsWith("http://") ||
            userInfo.image.startsWith("https://")) ? (
            <Link href="/user/dashboard" aria-label="user" className="relative block w-6 h-6">
              <Image
                width={24}
                height={24}
                src={userInfo.image}
                alt="user"
                className="rounded-full"
              />
            </Link>
          ) : userInfo?.name ? (
            <Link
              aria-label="User"
              href="/user/dashboard"
              className="leading-none font-bold block"
            >
              {userInfo?.name[0]}
            </Link>
          ) : (
            <Link aria-label="user" href="/auth/login">
              <FiUser className="w-6 h-6 drop-shadow-xl" />
            </Link>
          )}
        </div>
      </div>

      <CartDrawer open={openCartDrawer} setOpen={setOpenCartDrawer} />
      <PagesDrawer
        open={openPageDrawer}
        setOpen={setOpenPageDrawer}
        categories={categories}
        categoryError={categoryError}
      />
    </div>
  );
};

export default MobileNavIconsClothing;
