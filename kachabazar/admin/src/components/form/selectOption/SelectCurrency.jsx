import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

// internal import
import useAsync from "@/hooks/useAsync";
import CurrencyServices from "@/services/CurrencyServices";

const SelectCurrency = ({ control, name, label, required, setValue }) => {
  const { data, loading } = useAsync(CurrencyServices.getShowingCurrency);

  if (loading) return "Loading...";

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? `${label} is required!` : false,
      }}
      render={({ field }) => (
        <Select
          value={field.value || ""}
          onValueChange={(value) => {
            field.onChange(value);
            // Also save the currency name as code-like identifier for Intl formatting
            const selected = data?.find((c) => c.symbol === value);
            if (selected && setValue) {
              setValue("default_currency_name", selected.name);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {data?.map((currency) => (
              <SelectItem key={currency._id} value={currency.symbol}>
                {currency.symbol} — {currency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
};

export default SelectCurrency;
