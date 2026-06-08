import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { FiPlus, FiZoomIn } from "react-icons/fi";
import { Pencil, Trash2, Star, Truck } from "lucide-react";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { Link } from "react-router-dom";

//internal import
import MainDrawer from "@/components/drawer/MainDrawer";
import DeliveryBoyDrawer from "@/components/drawer/DeliveryBoyDrawer";
import DeliveryBoyServices from "@/services/DeliveryBoyServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import DeleteModal from "@/components/modal/DeleteModal";
import { useAction } from "@/context/ActionContext";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import ActiveInActiveButton from "@/components/table/ActiveInActiveButton";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { selectColumn } from "@/components/table/selectColumn";
import { notifySuccess, notifyError } from "@/utils/toast";

const DeliveryBoys = () => {
  const {
    open,
    setOpen,
    selectedId,
    selectedIds,
    setSelectedIds,
    toggleDrawer,
  } = useAction();

  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const { title, handleUpdate, handleModalOpen } = useToggleDrawer();
  const { t } = useTranslation();
  const { showDateFormat, showingTranslateValue } = useUtilsFunction();
  const queryClient = useQueryClient();

  // Server-side state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  const sortBy = sorting[0]?.id || "";
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : "";

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: [
      "delivery-boys",
      currentPage,
      pageSize,
      searchText,
      statusFilter,
      availabilityFilter,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      DeliveryBoyServices.getAllDeliveryBoys({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        status: statusFilter || undefined,
        availability: availabilityFilter || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
      }),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // Dashboard stats
  const { data: dashboardData } = useQuery({
    queryKey: ["delivery-boy-dashboard"],
    queryFn: () => DeliveryBoyServices.getDeliveryBoyDashboard(),
    staleTime: 5 * 60 * 1000,
  });

  const deliveryBoyList = data?.deliveryBoys || data || [];
  const totalDoc = data?.totalDoc || deliveryBoyList?.length || 0;

  const handleStatusChange = useCallback(
    async (id, currentStatus) => {
      try {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        await DeliveryBoyServices.updateDeliveryBoyStatus(id, {
          status: newStatus,
        });
        notifySuccess(`Delivery Boy ${newStatus}!`);
        queryClient.invalidateQueries(["delivery-boys"]);
      } catch (err) {
        notifyError(err?.response?.data?.message || err?.message);
      }
    },
    [queryClient],
  );

  const handleDeleteDeliveryBoy = async (id) => {
    try {
      await DeliveryBoyServices.deleteDeliveryBoy(id);
      notifySuccess("Delivery Boy Deleted!");
      queryClient.invalidateQueries(["delivery-boys"]);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  const handleDeleteMany = async () => {
    try {
      await DeliveryBoyServices.deleteManyDeliveryBoys({
        ids: selectedIds,
      });
      notifySuccess("Delivery Boys Deleted!");
      queryClient.invalidateQueries(["delivery-boys"]);
      setSelectedIds([]);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  const handleResetFilters = useCallback(() => {
    setSearchText("");
    setStatusFilter("");
    setAvailabilityFilter("");
    setCurrentPage(1);
  }, []);

  const availabilityBadge = (availability) => {
    const colors = {
      available:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      "on-delivery":
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      offline:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colors[availability] || colors.offline}`}
      >
        {availability?.replace("-", " ")}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      selectColumn,
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="hidden sm:flex h-8 w-8">
                <AvatarImage src={item.image} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {showingTranslateValue(item?.name)?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium text-sm">
                  {showingTranslateValue(item?.name)}
                </span>
                <p className="text-xs text-muted-foreground">{item.email}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Phone" />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.phone}</span>
        ),
      },
      {
        accessorKey: "vehicleType",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Vehicle" />
        ),
        cell: ({ row }) => (
          <span className="text-sm capitalize">{row.original.vehicleType}</span>
        ),
      },
      {
        accessorKey: "availability",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Availability" />
        ),
        cell: ({ row }) => availabilityBadge(row.original.availability),
      },
      {
        accessorKey: "completedDeliveries",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Deliveries" />
        ),
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            {row.original.completedDeliveries || 0}/
            {row.original.totalDeliveries || 0}
          </span>
        ),
      },
      {
        accessorKey: "averageRating",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Rating" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">
              {row.original.averageRating || 0}
            </span>
            <span className="text-xs text-muted-foreground">
              ({row.original.totalRatings || 0})
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <ActiveInActiveButton
            status={row.original.status}
            onClick={() =>
              handleStatusChange(row.original._id, row.original.status)
            }
          />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Link to={`/delivery-boy/${row.original._id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FiZoomIn className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUpdate(row.original._id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700"
              onClick={() =>
                handleModalOpen(
                  row.original._id,
                  showingTranslateValue(row.original?.name),
                )
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [
      handleStatusChange,
      handleUpdate,
      handleModalOpen,
      showingTranslateValue,
      showDateFormat,
    ],
  );

  return (
    <>
      <DeleteModal
        ids={selectedIds?.length > 0 ? selectedIds : null}
        id={selectedId}
        open={open}
        onOpenChange={() => setOpen(false)}
        title={title}
      />

      <MainDrawer>
        <DeliveryBoyDrawer id={selectedId} />
      </MainDrawer>

      <div className="flex items-center justify-between py-4 lg:py-8">
        <SectionTitle
          title={t("DeliveryBoys")}
          description={t("ManageDeliveryPartners")}
        />
        <ButtonGroup>
          <Button onClick={toggleDrawer} variant="create">
            <FiPlus className="mr-1" />
            {t("AddDeliveryBoy")}
          </Button>
        </ButtonGroup>
      </div>

      {/* Dashboard Stats */}
      {dashboardData && (
        <div className="grid gap-4 mb-6 grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center p-4 bg-card rounded-lg border">
            <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:bg-blue-900/30">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("Total")}</p>
              <p className="text-lg font-semibold">
                {dashboardData.totalDeliveryBoys}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-card rounded-lg border">
            <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:bg-green-900/30">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("Active")}</p>
              <p className="text-lg font-semibold">
                {dashboardData.activeDeliveryBoys}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-card rounded-lg border">
            <div className="p-3 mr-4 text-emerald-500 bg-emerald-100 rounded-full dark:bg-emerald-900/30">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("Available")}</p>
              <p className="text-lg font-semibold">
                {dashboardData.availableDeliveryBoys}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-card rounded-lg border">
            <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:bg-orange-900/30">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("OnDelivery")}</p>
              <p className="text-lg font-semibold">
                {dashboardData.onDeliveryBoys}
              </p>
            </div>
          </div>
        </div>
      )}

      <AnimatedContent>
        <DynamicTable
          data={deliveryBoyList}
          columns={columns}
          loading={loading}
          serverSide
          searchText={searchText}
          onSearchChange={(v) => {
            setSearchText(v);
            setCurrentPage(1);
          }}
          searchPlaceholder={t("SearchByNameEmailPhone")}
          filters={[
            {
              title: t("Status"),
              options: [
                { label: t("Active"), value: "active" },
                { label: t("Inactive"), value: "inactive" },
                { label: t("Suspended"), value: "suspended" },
              ],
              value: statusFilter,
              onChange: (v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              },
            },
            {
              title: t("Availability"),
              options: [
                { label: t("Available"), value: "available" },
                { label: t("OnDelivery"), value: "on-delivery" },
                { label: t("Offline"), value: "offline" },
              ],
              value: availabilityFilter,
              onChange: (v) => {
                setAvailabilityFilter(v);
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

export default DeliveryBoys;
