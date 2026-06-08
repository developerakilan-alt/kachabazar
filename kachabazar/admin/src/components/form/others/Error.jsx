import React from "react";

const Error = ({ errorName, className = "" }) => {
  if (!errorName) return null;

  // Handle both react-hook-form error format and plain string messages
  const message = typeof errorName === "string" ? errorName : errorName.message;

  if (!message) return null;

  return (
    <span
      className={`text-red-500 text-sm mt-1 block animate-in fade-in duration-200 ${className}`}
      role="alert"
    >
      {message}
    </span>
  );
};

export default Error;
