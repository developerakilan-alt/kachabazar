"use client";

import { Input } from "@components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const SearchInput = ({ variant = "default" }) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchText.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/store?title=${searchText}`
        );
        const data = await res.json();
        setSuggestions(data?.products?.slice(0, 6) || []);
        setShowDropdown(true);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    if (searchText) {
      router.push(`/search?query=${searchText}`, { scroll: true });
      setSearchText("");
    } else {
      router.push(`/`, { scroll: true });
      setSearchText("");
    }
  };

  const handleSuggestionClick = (product) => {
    setShowDropdown(false);
    setSearchText("");
    router.push(`/product/${product.slug}`);
  };

  const isElectronic = variant === "electronic";

  return (
    <div className="relative w-full" ref={dropdownRef}>
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
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            className={`form-input w-full appearance-none transition ease-in-out text-sm font-sans focus:ring-0 outline-none border-none focus:outline-none ${
              isElectronic
                ? "pl-5 h-9 bg-transparent focus:bg-transparent text-foreground placeholder:text-muted-foreground rounded-l-full"
                : "pl-5 h-9 rounded-md bg-background text-muted-foreground"
            }`}
            placeholder="Search for products"
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

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden">
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((product) => (
                <li
                  key={product._id}
                  onClick={() => handleSuggestionClick(product)}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {product.image?.[0] && (
                    <img
                      src={product.image[0]}
                      alt={product.title?.en || product.title}
                      className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                    />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                      {product.title?.en || product.title}
                    </span>
                    <span className="text-xs text-primary font-semibold">
                      ₹{product.prices?.price || product.price}
                    </span>
                  </div>
                </li>
              ))}
              <li
                onClick={() => {
                  setShowDropdown(false);
                  router.push(`/search?query=${searchText}`);
                  setSearchText("");
                }}
                className="px-4 py-2 text-sm text-primary font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-t border-gray-100 dark:border-gray-700"
              >
                See all results for "{searchText}"
              </li>
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;