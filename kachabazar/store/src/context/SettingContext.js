"use client"; // This context will be used on the client side

import React, { createContext, useContext, useState, useMemo } from "react";

const SettingContext = createContext(null);

export function useSetting() {
  return useContext(SettingContext);
}

function fixSettingUrls(data) {
  if (!data || typeof data !== "object") return data;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  if (!origin) return data;
  const fixed = { ...data };
  for (const key of Object.keys(fixed)) {
    if (typeof fixed[key] === "string") {
      fixed[key] = fixed[key]
        .replace(/http:\/\/localhost:5056/g, origin)
        .replace(/http:\/\/192\.168\.29\.108/g, origin);
    }
  }
  return fixed;
}

export function SettingProvider({
  initialStoreSetting,
  initialGlobalSetting,
  initialCustomizationSetting,
  children,
}) {
  const [storeSetting, setStoreSetting] = useState(
    useMemo(() => fixSettingUrls(initialStoreSetting), [initialStoreSetting])
  );
  const [globalSetting, setGlobalSetting] = useState(
    useMemo(() => fixSettingUrls(initialGlobalSetting), [initialGlobalSetting])
  );
  const [storeCustomization, setStoreCustomization] = useState(
    useMemo(() => fixSettingUrls(initialCustomizationSetting), [initialCustomizationSetting])
  );

  return (
    <SettingContext.Provider
      value={{
        globalSetting,
        setGlobalSetting,
        storeSetting,
        setStoreSetting,
        storeCustomization,
        setStoreCustomization,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
}
