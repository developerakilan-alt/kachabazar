"use client";

import { Input } from "@components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchInput = ({ variant = "default" }) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchText) {
      router.push(`/search?query=${searchText}`, { scroll: true });
      setSearchText("");
    } else {
      router.push(`/`, { scroll: true });
      setSearchText("");
    }
  };

  const isElectronic = variant === "electronic";

  return (
    <>
      <form
        onSubmit={handleSearch}
        className={`relative overflow-hidden w-full ${
          isElectronic
            ? "flex bg-primary-foreground rounded-full p-1"
            : "pr-12 md:pr-14 shadow-sm rounded-md bg-background"
        }`}
      >
        <label
          className={`flex items-center ${isElectronic ? "w-full" : "py-0.5"}`}
        >
          <Input
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            className={`form-input w-full appearance-none transition ease-in-out text-sm font-sans focus:ring-0 outline-none border-none focus:outline-none ${
              isElectronic
                ? "pl-5 h-9 bg-transparent focus:bg-transparent text-foreground placeholder:text-muted-foreground rounded-l-full"
                : "pl-5 h-9 rounded-md bg-background text-muted-foreground"
            }`}
            placeholder="Search for products (e.g. shirt, pant)"
          />
        </label>
        <button
          aria-label="Search"
          type="submit"
          className={`outline-none flex items-center justify-center transition duration-200 ease-in-out focus:outline-none ${
            isElectronic
              ? "w-9 h-9 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shrink-0"
              : "absolute top-0 right-0 end-0 w-12 md:w-14 h-full text-xl text-muted-foreground hover:text-foreground"
          }`}
        >
          <MagnifyingGlassIcon
            className={`h-5 w-5 ${isElectronic && "stroke-2"}`}
            aria-hidden="true"
          />
        </button>
      </form>
    </>
  );
};

export default SearchInput;
