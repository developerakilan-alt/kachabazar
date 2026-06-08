import { Input } from "@/components/ui/input";

const InputValue = ({
  name,
  label,
  type,
  disabled,
  register,
  required,
  maxValue,
  minValue,
  currency,
  product,
  defaultValue,
  placeholder,
  onFocus,
}) => {
  const value = {
    valueAsNumber: true,
    required: required ? `${label} is required!` : false,
    max: {
      value: maxValue,
      message: `Maximum value ${maxValue}!`,
    },
    min: {
      value: minValue,
      message: `Minimum value ${minValue}!`,
    },
    pattern: {
      value: /^[0-9]*$/,
      message: `Invalid ${label}!`,
    },
  };

  return (
    <>
      <div className={`flex flex-row`}>
        {product && (
          <span className="inline-flex items-center px-3 rounded rounded-r-none border border-r-0 border-border bg-muted text-muted-foreground text-sm  focus:border-primary/30   dark:border ">
            {currency}
          </span>
        )}
        <Input
          {...register(`${name}`, value)}
          type={type}
          name={name}
          step={0.01}
          disabled={disabled}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onFocus={onFocus}
          className={`mr-2 ${product && "rounded-l-none"}`}
        />
      </div>
    </>
  );
};

export default InputValue;
