import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";

//internal import
import Main from "@/layout/Main";
import RootLayout from "@/layout/root-layout";
import { AppSidebar } from "@/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import ThemeSuspense from "@/components/theme/ThemeSuspense";
import { routes } from "@/routes";

const Page404 = lazy(() => import("@/pages/404"));

const Layout = () => {
  const isOnline = navigator.onLine;
  const defaultOpen = Cookies.get("sidebar_state") !== "false";

  return (
    <>
      {!isOnline && (
        <div className="flex justify-center bg-red-600 text-white">
          You are in offline mode!
        </div>
      )}
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <div
          id="content"
          className={cn(
            "ml-auto w-full max-w-full",
            "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
            "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
            "sm:transition-[width] sm:duration-200 sm:ease-linear",
            "flex h-svh flex-col",
            "min-h-svh",
            "group-data-[scroll-locked=1]/body:h-full",
            "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh",
          )}
        >
          <RootLayout>
            <Main>
              <Suspense fallback={<ThemeSuspense />}>
                <Routes>
                  {routes.map((route, i) => {
                    if (!route.component) return null;
                    return (
                      <Route
                        key={i}
                        path={route.path}
                        element={<route.component />}
                      />
                    );
                  })}
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Page404 />} />
                </Routes>
              </Suspense>
            </Main>
          </RootLayout>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Layout;
