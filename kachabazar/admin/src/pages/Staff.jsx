import { useContext, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { FiPlus, FiZoomIn } from "react-icons/fi";
import { Pencil, Trash2, ShieldCheck, ShieldOff } from "lucide-react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

//internal import
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { AdminContext } from "@/context/AdminContext";
import AdminServices from "@/services/AdminServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import DeleteModal from "@/components/modal/DeleteModal";
import RoleAssignModal from "@/components/modal/RoleAssignModal";
import { useAction } from "@/context/ActionContext";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import Status from "@/components/table/Status";
import ActiveInActiveButton from "@/components/table/ActiveInActiveButton";
import AccessListModal from "@/components/modal/AccessListModal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { DynamicTableRowActions } from "@/components/table/DynamicTableRowActions";
import { selectColumn } from "@/components/table/selectColumn";

const Staff = () => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const {
    open,
    setOpen,
    selectedId,
    selectedIds,
    setSelectedIds,
    toggleDrawer,
  } = useAction();

  // Local table state (per-page to avoid cross-page interference)
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const {
    title,
    handleUpdate,
    handleModalOpen,
    isSubmitting,
    handleResetPassword,
  } = useToggleDrawer();
  const { t } = useTranslation();
  const { showDateFormat, showingTranslateValue } = useUtilsFunction();

  // Server-side state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Derive sort params from table sorting state
  const sortBy = sorting[0]?.id || "";
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : "";

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: [
      "staff",
      currentPage,
      pageSize,
      searchText,
      roleFilter,
      statusFilter,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      AdminServices.getAllStaff({
        email: adminInfo.email,
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
      }),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const staffList = data?.staff || data || [];
  const totalDoc = data?.totalDoc || staffList?.length || 0;

  const handleResetFilters = useCallback(() => {
    setSearchText("");
    setRoleFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  }, []);

  // Access list modal state
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  const handleAccessModalOpen = (staff) => {
    setSelectedStaff(staff);
    setIsAccessModalOpen(true);
  };

  const handleAccessModalClose = () => {
    setSelectedStaff(null);
    setIsAccessModalOpen(false);
  };

  // Role assign/unassign modal state
  const [roleModalStaff, setRoleModalStaff] = useState(null);
  const [roleModalMode, setRoleModalMode] = useState("assign");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const isSuperAdmin = adminInfo?.role === "super admin";

  const handleAssignRole = (staff) => {
    setRoleModalStaff(staff);
    setRoleModalMode("assign");
    setIsRoleModalOpen(true);
  };

  const handleUnassignRole = (staff) => {
    setRoleModalStaff(staff);
    setRoleModalMode("unassign");
    setIsRoleModalOpen(true);
  };

  const handleRoleModalClose = () => {
    setRoleModalStaff(null);
    setIsRoleModalOpen(false);
  };

  // ─── Table Columns ──────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      selectColumn,
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("StaffNameTbl")} />
        ),
        cell: ({ row }) => {
          const staff = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="hidden md:block bg-muted h-8 w-8">
                <AvatarImage src={staff.image} alt="staff" />
                <AvatarFallback>{staff.name?.[0] || "S"}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {showingTranslateValue(staff?.name)}
              </span>
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("StaffEmailTbl")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.email}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("StaffContactTbl")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.phone}</span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "joiningData",
        header: ({ column }) => (
          <DynamicTableColumnHeader
            column={column}
            title={t("StaffJoiningDateTbl")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm">
            {showDateFormat(row.original.joiningData)}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title={t("StaffRoleTbl")} />
        ),
        cell: ({ row }) => (
          <span className="text-sm font-semibold capitalize">
            {row.original?.role}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: () => (
          <span className="text-center block">{t("OderStatusTbl")}</span>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <Status status={row.original.status} />
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "published",
        header: () => (
          <span className="text-center block">{t("PublishedTbl")}</span>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <ActiveInActiveButton
              id={row.original?._id}
              staff={row.original}
              option="staff"
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
          <span className="text-center block">{t("StaffActionsTbl")}</span>
        ),
        cell: ({ row }) => {
          const staff = row.original;
          return (
            <div className="flex justify-center items-center gap-1">
              <button
                onClick={() => handleAccessModalOpen(staff)}
                className="p-2 text-muted-foreground hover:text-primary"
              >
                <FiZoomIn className="w-4 h-4" />
              </button>
              <DynamicTableRowActions
                row={row}
                actions={[
                  {
                    key: "edit",
                    label: t("Edit"),
                    icon: Pencil,
                    onClick: () => handleUpdate(staff._id),
                  },
                  ...(isSuperAdmin
                    ? [
                        { separator: true },
                        {
                          key: "assign-role",
                          label: t("AssignRole") || "Assign Role",
                          icon: ShieldCheck,
                          onClick: () => handleAssignRole(staff),
                        },
                        {
                          key: "unassign-role",
                          label: t("UnassignRole") || "Unassign Role",
                          icon: ShieldOff,
                          onClick: () => handleUnassignRole(staff),
                        },
                      ]
                    : []),
                  { separator: true },
                  {
                    key: "delete",
                    label: t("Delete"),
                    icon: Trash2,
                    variant: "delete",
                    onClick: () =>
                      handleModalOpen(
                        staff._id,
                        showingTranslateValue(staff?.name),
                      ),
                  },
                ]}
              />
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [
      t,
      showDateFormat,
      showingTranslateValue,
      handleUpdate,
      handleModalOpen,
      isSuperAdmin,
    ],
  );

  return (
    <>
      {isAccessModalOpen && (
        <AccessListModal
          staff={selectedStaff}
          isOpen={isAccessModalOpen}
          onClose={handleAccessModalClose}
          showingTranslateValue={showingTranslateValue}
        />
      )}

      {isRoleModalOpen && roleModalStaff && (
        <RoleAssignModal
          isOpen={isRoleModalOpen}
          onClose={handleRoleModalClose}
          staff={roleModalStaff}
          mode={roleModalMode}
          showingTranslateValue={showingTranslateValue}
        />
      )}

      <div className="flex items-center justify-between py-4 lg:py-8">
        <SectionTitle
          title={t("StaffPageTitle")}
          description={t("StaffPageDesc")}
        />
        <ButtonGroup>
          <Button onClick={toggleDrawer} variant="create">
            <FiPlus className="mr-1" />
            {t("AddStaff")}
          </Button>
        </ButtonGroup>
      </div>

      <MainDrawer>
        <StaffDrawer id={selectedId} />
      </MainDrawer>

      <DeleteModal
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
        ids={selectedIds?.length > 0 ? selectedIds : null}
      />

      <AnimatedContent>
        <DynamicTable
          data={staffList}
          columns={columns}
          loading={loading}
          serverSide
          searchText={searchText}
          onSearchChange={(v) => {
            setSearchText(v);
            setCurrentPage(1);
          }}
          searchPlaceholder={t("StaffSearchBy")}
          filters={[
            {
              title: t("StaffRole"),
              options: [
                { label: t("StaffRoleAdmin"), value: "Admin" },
                { label: t("StaffRoleCeo"), value: "CEO" },
                { label: t("StaffRoleManager"), value: "Manager" },
                { label: t("StaffRoleAccountant"), value: "Accountant" },
                { label: t("StaffRoleDriver"), value: "Driver" },
                { label: t("StaffRoleSecurity"), value: "Security Guard" },
                { label: t("StaffRoleDelivery"), value: "Delivery Person" },
                { label: t("SelectSuperAdmin"), value: "Super Admin" },
                { label: t("SelectCashiers"), value: "Cashier" },
              ],
              value: roleFilter,
              onChange: (v) => {
                setRoleFilter(v);
                setCurrentPage(1);
              },
            },
            {
              title: t("Status"),
              options: [
                { label: t("Active"), value: "active" },
                { label: t("Inactive"), value: "inactive" },
              ],
              value: statusFilter,
              onChange: (v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              },
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
          totalPages={Math.ceil(totalDoc / pageSize) || 1}
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

export default Staff;
