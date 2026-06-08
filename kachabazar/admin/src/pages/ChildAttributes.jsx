import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { FiChevronRight, FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { Pencil, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

//internal import
import useToggleDrawer from "@/hooks/useToggleDrawer";
import MainDrawer from "@/components/drawer/MainDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import AttributeServices from "@/services/AttributeServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import AttributeChildDrawer from "@/components/drawer/AttributeChildDrawer";
import { useAction } from "@/context/ActionContext";
import ShowHideButton from "@/components/table/ShowHideButton";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { DynamicTableRowActions } from "@/components/table/DynamicTableRowActions";
import { selectColumn } from "@/components/table/selectColumn";

const ChildAttributes = () => {
  const { id } = useParams();
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
  const { showingTranslateValue } = useUtilsFunction();
  const { t } = useTranslation();

  // Fetch attribute by ID
  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["attribute", id],
    queryFn: () => AttributeServices.getAttributeById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const variants = useMemo(() => data?.variants || [], [data?.variants]);

  // ─── Table Columns ──────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      selectColumn,
      {
        accessorKey: "_id",
        header: () => <span>Id</span>,
        cell: ({ row }) => (
          <span className="font-semibold uppercase text-xs">
            {row.original?._id?.substring(20, 24)}
          </span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-sm">
            {showingTranslateValue(row.original?.name)}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: "type",
        header: () => <span>Type</span>,
        cell: () => <span className="font-medium text-sm">{data?.option}</span>,
        enableSorting: false,
      },
      {
        id: "published",
        header: () => <span className="text-center block">Status</span>,
        cell: ({ row }) => (
          <div className="text-center">
            <ShowHideButton
              id={row.original._id}
              status={row.original.status}
            />
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "actions",
        header: () => <span className="text-right block">Actions</span>,
        cell: ({ row }) => (
          <DynamicTableRowActions
            row={row}
            actions={[
              {
                key: "edit",
                label: "Edit",
                icon: Pencil,
                onClick: () => handleUpdate(row.original._id),
              },
              { separator: true },
              {
                key: "delete",
                label: "Delete",
                icon: Trash2,
                variant: "delete",
                onClick: () =>
                  handleModalOpen(
                    row.original._id,
                    showingTranslateValue(row.original?.name),
                  ),
              },
            ]}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [data?.option, showingTranslateValue, handleUpdate, handleModalOpen],
  );

  return (
    <>
      <div className="flex items-center justify-between py-4 lg:py-8">
        <div className="min-w-0 flex-1">
          <SectionTitle
            title="Attribute Values"
            description={t("ChildAttributesPageDesc")}
          />
          <div className="flex items-center py-2">
            <ol className="flex items-center w-full overflow-hidden font-serif">
              <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer hover:text-primary font-semibold">
                <Link className="text-blue-700" to="/attributes">
                  Attributes
                </Link>
              </li>
              <span className="flex items-center font-serif">
                <li className="text-sm mt-[1px]">
                  <FiChevronRight />
                </li>
                <li className="text-sm pl-1 font-semibold">
                  {!loading && showingTranslateValue(data?.title)}
                </li>
              </span>
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
            Bulk Action
          </Button>
          <Button
            disabled={selectedIds?.length < 1}
            onClick={() =>
              handleDeleteMany(
                selectedIds,
                t("Selected") + " " + t("Attributes"),
              )
            }
            variant="delete"
          >
            <FiTrash2 className="mr-1" />
            {t("Delete")}
          </Button>
          <Button onClick={toggleDrawer} variant="create">
            <FiPlus className="mr-1" />
            Add Value
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
        childId={id}
        ids={selectedIds}
        title="Attribute Value(s)"
      />

      <MainDrawer>
        <AttributeChildDrawer id={selectedId} />
      </MainDrawer>

      <AnimatedContent>
        <DynamicTable
          data={variants}
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
          searchPlaceholder="Search by name..."
        />
      </AnimatedContent>
    </>
  );
};

export default ChildAttributes;
