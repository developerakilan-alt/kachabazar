import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FiChevronRight, FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { IoRemoveSharp } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";

//internal import
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import { useAction } from "@/context/ActionContext";
import CategoryDrawer from "@/components/drawer/CategoryDrawer";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import AnimatedContent from "@/components/common/AnimatedContent";
import ShowHideButton from "@/components/table/ShowHideButton";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import CategoryServices from "@/services/CategoryServices";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { DynamicTableRowActions } from "@/components/table/DynamicTableRowActions";
import { selectColumn } from "@/components/table/selectColumn";

const ChildCategory = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { showingTranslateValue } = useUtilsFunction();
  const {
    open,
    setOpen,
    selectedId,
    selectedIds,
    setSelectedIds,
    toggleDrawer,
  } = useAction();

  // Local table state
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

  const [showChild, setShowChild] = useState(false);

  // Fetch category tree (no params = tree structure)
  const {
    data: categoryTree,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["categoryTree"],
    queryFn: () => CategoryServices.getAllCategory(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  // Find the current category and its ancestors from the tree
  const { childCategories, ancestors } = useMemo(() => {
    if (!categoryTree || !Array.isArray(categoryTree)) {
      return { childCategories: [], ancestors: [] };
    }

    const findNode = (nodes, target) => {
      for (const node of nodes) {
        if (node._id === target) return node;
        if (node.children?.length > 0) {
          const found = findNode(node.children, target);
          if (found) return found;
        }
      }
      return undefined;
    };

    const getAncestors = (target, nodes, trail = []) => {
      for (const node of nodes) {
        if (node._id === target) return trail.concat(node);
        if (node.children?.length > 0) {
          const found = getAncestors(target, node.children, trail.concat(node));
          if (found) return found;
        }
      }
      return undefined;
    };

    const result = findNode(categoryTree, id);
    const ancestorList = getAncestors(id, categoryTree) || [];

    return {
      childCategories: result?.children || [],
      ancestors: ancestorList,
    };
  }, [categoryTree, id]);

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
    [t, showChild, showingTranslateValue, handleUpdate, handleModalOpen],
  );

  return (
    <>
      <div className="flex items-center justify-between py-4 lg:py-8">
        <div className="min-w-0 flex-1">
          <SectionTitle
            title={t("CategoryPageTitle")}
            description={t("ChildCategoriesPageDesc")}
          />
          <div className="flex items-center py-2">
            <ol className="flex items-center w-full overflow-hidden font-serif">
              <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer hover:text-primary font-semibold">
                <Link to="/categories">{t("Categories")}</Link>
              </li>
              {ancestors?.map((child, i) => (
                <span key={i + 1} className="flex items-center font-serif">
                  <li className="text-sm mt-[1px]">
                    <FiChevronRight />
                  </li>
                  <li className="text-sm pl-1 transition duration-200 ease-in cursor-pointer text-blue-700 hover:text-primary font-semibold">
                    <Link to={`/categories/${child._id}`}>
                      {showingTranslateValue(child?.name)}
                    </Link>
                  </li>
                </span>
              ))}
            </ol>
          </div>
        </div>

        <ButtonGroup>
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
                t("Selected") + " " + t("ChildCategories"),
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
        category
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
        ids={selectedIds?.length > 0 ? selectedIds : null}
      />

      <BulkActionDrawer
        ids={selectedIds}
        title="Child Categories"
        data={categoryTree || []}
      />

      <MainDrawer>
        <CategoryDrawer id={selectedId} data={categoryTree || []} />
      </MainDrawer>

      <AnimatedContent>
        <DynamicTable
          data={childCategories}
          columns={columns}
          loading={loading}
          sorting={sorting}
          setSorting={setSorting}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          setSelectedIds={setSelectedIds}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          searchPlaceholder={t("SearchCategory")}
          filters={[
            {
              title: "Children",
              options: [{ label: "Show Children", value: "yes" }],
              value: showChild ? "yes" : "",
              onChange: (v) => setShowChild(v === "yes"),
            },
          ]}
        />
      </AnimatedContent>
    </>
  );
};

export default ChildCategory;
