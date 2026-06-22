import { useMemo, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { IoRemoveSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

//internal import
import useFilter from "@/hooks/useFilter";
import CategoryServices from "@/services/CategoryServices";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import UploadMany from "@/components/common/UploadMany";
import { useAction } from "@/context/ActionContext";
import CategoryDrawer from "@/components/drawer/CategoryDrawer";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import AnimatedContent from "@/components/common/AnimatedContent";
import ShowHideButton from "@/components/table/ShowHideButton";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { DynamicTableRowActions } from "@/components/table/DynamicTableRowActions";
import { selectColumn } from "@/components/table/selectColumn";

const Category = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { showingTranslateValue } = useUtilsFunction();
  const {
    open,
    setOpen,
    selectedId,
    selectedIds,
    setSelectedIds,
    isCheckAll,
    toggleDrawer,
    handleSelectAll,
  } = useAction();

  // Local table state (per-page to avoid cross-page interference)
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const {
    title,
    handleDeleteMany,
    handleUpdateMany,
    handleUpdate,
    handleModalOpen,
  } = useToggleDrawer();

  const [showChild, setShowChild] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Derive sort params from table sorting state
  const sortBy = sorting[0]?.id || "";
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : "";

  // Server-side paginated fetch
  const {
    data,
    error,
    isFetched,
    isLoading: loading,
  } = useQuery({
    queryKey: [
      "categories",
      currentPage,
      pageSize,
      searchText,
      statusFilter,
      sortBy,
      sortOrder,
      showChild,
    ],
    queryFn: () =>
      CategoryServices.getAllCategory({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        status: statusFilter || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
        parentOnly: showChild ? "false" : "true",
      }),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // Stable reference to avoid useFilter infinite loop
  const categories = useMemo(() => data?.categories || [], [data?.categories]);
  const totalDoc = data?.totalDoc || 0;

  // Fetch all categories (flat) for CSV export
  const { data: allCategories } = useQuery({
    queryKey: ["allCategories"],
    queryFn: () => CategoryServices.getAllCategories(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const categoryNameById = useMemo(() => {
    const map = new Map();
    if (Array.isArray(allCategories)) {
      allCategories.forEach((category) => {
        map.set(category._id, showingTranslateValue(category.name));
      });
    }
    return map;
  }, [allCategories, showingTranslateValue]);

  // Fetch category tree for drawer (parent picker)
  const { data: categoryTree } = useQuery({
    queryKey: ["categoryTree"],
    queryFn: () => CategoryServices.getAllCategory(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const {
    filename,
    isDisabled,
    handleSelectFile,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(categories);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchText("");
    setStatusFilter("");
    setShowChild(true);
    setCurrentPage(1);
  }, []);

  // ─── Table Columns ──────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      selectColumn,
      {
        accessorKey: "_id",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("catIdTbl")} />
        ),
        cell: ({ row }) => (
          <span className="font-semibold uppercase text-xs">
            {row.original?._id?.substring(20, 24)}
          </span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "icon",
        header: t("catIconTbl"),
        cell: ({ row }) => (
          <Avatar className="hidden md:block bg-muted p-1 h-8 w-8">
            <AvatarImage
              src={
                row.original?.icon ||
                "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
              }
              alt={row.original?.parent}
            />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("CatTbName")} />
        ),
        cell: ({ row }) => {
          const category = row.original;
          const name = showingTranslateValue(category?.name);
          return (
            <div className="font-medium text-sm">
              {category?.children?.length > 0 ? (
                <Link
                  to={`/categories/${category?._id}`}
                  className="text-foreground"
                >
                  {name}
                  {showChild && (
                    <div className="pl-2">
                      {category.children.map((child) => (
                        <div
                          key={child._id}
                          className="flex text-xs items-center text-muted-foreground"
                        >
                          <IoRemoveSharp className="mr-1" />
                          {showingTranslateValue(child.name)}
                        </div>
                      ))}
                    </div>
                  )}
                </Link>
              ) : (
                <span>{name}</span>
              )}
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "parentName",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("ParentCategory")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original?.parentId
              ? categoryNameById.get(row.original.parentId) ||
                row.original.parentName ||
                "Home"
              : "Home"}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("CatTbDescription")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {showingTranslateValue(row.original?.description)}
          </span>
        ),
        enableSorting: false,
      },
      {
        id: "published",
        header: () => (
          <span className="text-center block">{t("catPublishedTbl")}</span>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <ShowHideButton
              id={row.original._id}
              category
              status={row.original.status}
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "actions",
        header: () => (
          <span className="text-right block">{t("catActionsTbl")}</span>
        ),
        cell: ({ row }) => {
          const category = row.original;
          const actions = [];

          if (category?.children?.length > 0) {
            actions.push({
              key: "view",
              label: "View Children",
              icon: Eye,
              onClick: () => {},
              href: `/categories/${category._id}`,
            });
          }

          actions.push({
            key: "edit",
            label: t("Edit"),
            icon: Pencil,
            onClick: () => handleUpdate(category._id),
          });
          actions.push({ separator: true });
          actions.push({
            key: "delete",
            label: t("Delete"),
            icon: Trash2,
            variant: "delete",
            onClick: () =>
              handleModalOpen(
                category._id,
                showingTranslateValue(category?.name),
              ),
          });

          return <DynamicTableRowActions row={row} actions={actions} />;
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [
      t,
      showChild,
      showingTranslateValue,
      categoryNameById,
      handleUpdate,
      handleModalOpen,
    ],
  );

  return (
    <>
      <div className="flex items-center justify-between py-4 lg:py-8">
        <SectionTitle
          title={t("Category")}
          description={t("CategoriesPageDesc")}
        />
        <ButtonGroup>
          <UploadMany
            title="Categories"
            filename={filename}
            isDisabled={isDisabled}
            exportData={allCategories || []}
            handleSelectFile={handleSelectFile}
            handleUploadMultiple={handleUploadMultiple}
            handleRemoveSelectFile={handleRemoveSelectFile}
          />
          <Button
            disabled={selectedIds?.length < 1}
            onClick={() => handleUpdateMany(selectedIds)}
            variant="bulkAction"
          >
            <FiEdit className="mr-1" />
            {t("BulkAction")}
          </Button>
          <Button
            disabled={selectedIds?.length < 1}
            onClick={() =>
              handleDeleteMany(
                selectedIds,
                t("Selected") + " " + t("Categories"),
              )
            }
            variant="delete"
          >
            <FiTrash2 className="mr-1" />
            {t("Delete")}
          </Button>
          <Button onClick={toggleDrawer} variant="create">
            <FiPlus className="mr-1" />
            {t("AddCategory")}
          </Button>
        </ButtonGroup>
      </div>

      <DeleteModal
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
        ids={selectedIds?.length > 0 ? selectedIds : null}
      />

      <BulkActionDrawer
        ids={selectedIds}
        title="Categories"
        data={categoryTree || []}
      />

      <MainDrawer>
        <CategoryDrawer id={selectedId} data={categoryTree || []} />
      </MainDrawer>

      <AnimatedContent>
        <DynamicTable
          data={categories}
          columns={columns}
          loading={loading}
          serverSide
          searchText={searchText}
          onSearchChange={(v) => {
            setSearchText(v);
            setCurrentPage(1);
          }}
          searchPlaceholder={t("SearchCategory")}
          filters={[
            {
              title: "Published",
              options: [
                { label: "Published", value: "show" },
                { label: "Unpublished", value: "hide" },
              ],
              value: statusFilter,
              onChange: (v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              },
            },
            {
              title: "Children",
              options: [{ label: "All Categories", value: "yes" }],
              value: showChild ? "yes" : "",
              onChange: (v) => setShowChild(v === "yes"),
            },
          ]}
          onReset={handleResetFilters}
          sorting={sorting}
          setSorting={setSorting}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          setSelectedIds={setSelectedIds}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          totalCount={totalDoc}
          totalPages={Math.ceil(totalDoc / pageSize)}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </AnimatedContent>
    </>
  );
};

export default Category;
