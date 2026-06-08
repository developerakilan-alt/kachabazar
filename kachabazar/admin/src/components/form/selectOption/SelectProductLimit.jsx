import React from "react";
// import { CODES } from 'currencies-map';

const SelectProductLimit = ({ register, name, label, required }) => {
  return (
    <>
      <select
        name={name}
        {...register(`${name}`, {
          required: required ? `${label} is required!` : false,
        })}
        className="block w-full h-10 border border-primary/50 bg-muted px-2 py-1 text-sm  focus:outline-none rounded-md form-select focus:bg-card"
      >
        <option value="" defaultValue hidden>
          Select Products Limit
        </option>
        {/* {CODES.map((currency) => (
          <option key={currency} value={currency}>
            {currency}{' '}
          </option>
        ))} */}

        <option value="6">6</option>
        <option value="12">12</option>
        <option value="18">18</option>
      </select>
    </>
  );
};
export default SelectProductLimit;
