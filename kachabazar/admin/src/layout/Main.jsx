import React from "react";
import { cn } from "@/lib/utils";
import useGetCData from "@/hooks/useGetCData";
import NotFoundPage from "@/components/common/NotFoundPage";

const Main = ({ children, className }) => {
  const { path, accessList } = useGetCData();

  if (accessList && accessList.length > 0 && !accessList.includes(path)) {
    return <NotFoundPage />;
  }
  return (
    <main
      className={cn(
        "flex flex-1 flex-col sm:px-4",
        "bg-background",
        "peer-[.header-fixed]/header:mt-16",
        className,
      )}
    >
      <div className={cn("container min-h-full flex-1 pb-8 mx-auto")}>{children}</div>
    </main>
  );
};

export default Main;
