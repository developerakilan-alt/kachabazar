import { useState, createContext, useContext, useEffect } from "react";

const ActionContext = createContext(null);

export default function ActionProvider({ children }) {
  const [open, setOpen] = useState(null);
  const [option, setOption] = useState({
    title: "",
    description: "",
    variant: "",
    btn: "",
  });
  const [currentRow, setCurrentRow] = useState(null);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [openBulkAction, setOpenBulkAction] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);

  // Table state (market-nest pattern)
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const [windowDimension, setWindowDimension] = useState(window.innerWidth);

  const handleSelect = (e) => {
    const { id, checked } = e.target;
    setSelectedIds([...selectedIds, id]);
    if (!checked) {
      setSelectedIds(selectedIds?.filter((item) => item !== id));
    }
  };

  const handleSelectAll = (data) => {
    setIsCheckAll(!isCheckAll);
    setSelectedIds(data?.map((li) => li._id));
    if (isCheckAll) {
      setSelectedIds([]);
    }
  };

  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const closeDrawer = () => setOpenDrawer(false);

  useEffect(() => {
    function handleResize() {
      setWindowDimension(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ActionContext.Provider
      value={{
        open,
        setOpen,
        option,
        setOption,
        currentRow,
        setCurrentRow,
        isUpdate,
        setIsUpdate,
        openDrawer,
        selectedId,
        setSelectedId,
        setOpenDrawer,
        isCheckAll,
        closeDrawer,
        setIsCheckAll,
        openBulkAction,
        toggleDrawer,
        setOpenBulkAction,
        selectedIds,
        setSelectedIds,
        handleSelect,
        handleSelectAll,
        // Table state
        sorting,
        setSorting,
        rowSelection,
        setRowSelection,
        columnFilters,
        setColumnFilters,
        columnVisibility,
        setColumnVisibility,
        windowDimension,
        setWindowDimension,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAction = () => {
  const actionContext = useContext(ActionContext);

  if (!actionContext) {
    throw new Error("useAction has to be used within <ActionContext>");
  }

  return actionContext;
};
