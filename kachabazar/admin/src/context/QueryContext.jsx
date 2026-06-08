import { useState, useContext, createContext } from "react";

const QueryContext = createContext();

export function QueryProvider({ children }) {
  const [pageMap, setPageMap] = useState({});
  const [limitMap, setLimitMap] = useState({});
  const [searchMap, setSearchMap] = useState({});
  const [sortMap, setSortMap] = useState({});
  const [filterMap, setFilterMap] = useState({});

  const handleSearch = (key, value) => {
    setSearchMap((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageMap((prev) => ({
      ...prev,
      [key]: 1,
    }));
  };

  const setPage = (key, value) => {
    setPageMap((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setLimit = (key, value) => {
    setLimitMap((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setSorting = (key, value) => {
    setSortMap((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageMap((prev) => ({
      ...prev,
      [key]: 1,
    }));
  };

  const setFilters = (key, value) => {
    setFilterMap((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageMap((prev) => ({
      ...prev,
      [key]: 1,
    }));
  };

  const getSortQuery = (key) => {
    const sorts = sortMap[key] || [];
    if (sorts.length === 0) return "";
    return sorts.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(",");
  };

  const getFilterQuery = (key) => {
    const filters = filterMap[key] || [];
    if (filters.length === 0) return {};
    const result = {};
    filters.forEach((f) => {
      if (f.value && Array.isArray(f.value) && f.value.length > 0) {
        result[f.id] = f.value.join(",");
      }
    });
    return result;
  };

  return (
    <QueryContext.Provider
      value={{
        getPage: (key) => pageMap[key] || 1,
        getLimit: (key) => limitMap[key] || 10,
        getSearchText: (key) => searchMap[key] || "",
        setPage,
        setLimit,
        handleSearch,
        getSorting: (key) => sortMap[key] || [],
        setSorting,
        getFilters: (key) => filterMap[key] || [],
        setFilters,
        getSortQuery,
        getFilterQuery,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
}

export const useQueryContext = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error("useQueryContext must be used within QueryProvider");
  }
  return context;
};
