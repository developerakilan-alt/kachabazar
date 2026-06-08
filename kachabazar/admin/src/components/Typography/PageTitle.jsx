import React from "react";

const PageTitle = ({ children }) => {
  return (
    <h2 className="text-2xl/7 font-bold sm:truncate sm:tracking-tight text-foreground">
      {children}
    </h2>
  );
};

export default PageTitle;
