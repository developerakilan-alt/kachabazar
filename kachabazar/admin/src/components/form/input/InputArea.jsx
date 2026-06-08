import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const InputArea = ({
  register,
  defaultValue,
  required,
  name,
  label,
  type,
  autoComplete,
  placeholder,
  hasError,
  disabled,
  className,
}) => {
  return (
    <>
      <Input
        {...register(`${name}`, {
          required: required ? `${label} is required!` : false,
        })}
        defaultValue={defaultValue}
        type={type}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
        disabled={disabled}
        className={cn(
          hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className,
        )}
      />
    </>
  );
};

export default InputArea;
