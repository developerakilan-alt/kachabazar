import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Mail, Trash2, Package, ShoppingCart } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

//internal import
import { notifyError, notifySuccess } from "@/utils/toast";
import NotificationServices from "@/services/NotificationServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import { useAction } from "@/context/ActionContext";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { DynamicTableRowActions } from "@/components/table/DynamicTableRowActions";
import { selectColumn } from "@/components/table/selectColumn";

const Notifications = () => {
  const queryClient = useQueryClient();
  const { open, setOpen, selectedId, selectedIds, setSelectedIds } =
    useAction();

  // Local table state (per-page to avoid cross-page interference)
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Server-side state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch notifications — server-side paginated
  const {
    data: notificationData,
    isLoading: loading,
    isFetched,
  } = useQuery({
    queryKey: [
      "notifications",
      currentPage,
      pageSize,
      searchText,
      statusFilter,
    ],
    queryFn: () =>
      NotificationServices.getAllNotification({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        status: statusFilter || undefined,
      }),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const notifications = useMemo(
    () => (isFetched ? notificationData?.notifications || [] : []),
    [isFetched, notificationData],
  );

  const totalDoc = notificationData?.totalDoc || 0;
  const totalUnreadDoc = notificationData?.totalUnreadDoc || 0;

  const handleResetFilters = useCallback(() => {
    setSearchText("");
    setStatusFilter("");
    setCurrentPage(1);
  }, []);

  // Handle mark selected as read
  const handleMarkIsRead = useCallback(async () => {
    if (!selectedIds?.length) return;
    try {
      const res = await NotificationServices.updateManyStatusNotification({
        ids: selectedIds,
        status: "read",
      });
      notifySuccess(res.message);
      setRowSelection({});
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  }, [selectedIds, queryClient, setRowSelection, setSelectedIds]);

  // Handle delete many
  const handleDeleteMany = useCallback(async () => {
    if (!selectedIds?.length) return;
    try {
      const res = await NotificationServices.deleteManyNotification({
        ids: selectedIds,
      });
      notifySuccess(res.message);
      setRowSelection({});
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  }, [selectedIds, queryClient, setRowSelection, setSelectedIds]);

  // Handle single notification status change
  const handleMarkSingleRead = useCallback(
    async (id) => {
      try {
        await NotificationServices.updateStatusNotification(id, {
          status: "read",
        });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      } catch (err) {
        notifyError(err?.response?.data?.message || err?.message);
      }
    },
    [queryClient],
  );

  // Handle single delete
  const handleDeleteSingle = useCallback(
    async (id) => {
      try {
        await NotificationServices.deleteNotification(id);
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        notifySuccess("Notification deleted");
      } catch (err) {
        notifyError(err?.response?.data?.message || err?.message);
      }
    },
    [queryClient],
  );

  // ─── Table Columns ──────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      selectColumn,
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.original?.status;
          return (
            <Badge
              variant={status === "unread" ? "default" : "secondary"}
              className="capitalize"
            >
              {status === "unread" ? "Unread" : "Read"}
            </Badge>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "message",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Notification" />
        ),
        cell: ({ row }) => {
          const notification = row.original;
          const linkTo = notification.productId
            ? `/product/${notification.productId}`
            : `/order/${notification.orderId}`;

          return (
            <Link
              to={linkTo}
              onClick={() => {
                if (notification.status === "unread") {
                  handleMarkSingleRead(notification._id);
                }
              }}
              className="flex items-center gap-3 min-w-0"
            >
              <Avatar className="h-8 w-8 shrink-0 border">
                <AvatarImage src={notification.image} alt="notification" />
                <AvatarFallback>
                  {notification.productId ? (
                    <Package className="h-4 w-4" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm truncate max-w-md ${notification.status === "unread" ? "font-semibold" : ""}`}
                >
                  {notification.message}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {notification.productId ? (
                    <Badge variant="destructive" className="text-[10px] px-1.5">
                      Stock Out
                    </Badge>
                  ) : (
                    <Badge
                      variant="default"
                      className="bg-primary text-[10px] px-1.5"
                    >
                      New Order
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {dayjs(row.original.createdAt).fromNow()}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        header: () => <span className="text-right block">Actions</span>,
        cell: ({ row }) => (
          <DynamicTableRowActions
            row={row}
            actions={[
              ...(row.original.status === "unread"
                ? [
                    {
                      key: "markRead",
                      label: "Mark as Read",
                      icon: Mail,
                      onClick: () => handleMarkSingleRead(row.original._id),
                    },
                    { separator: true },
                  ]
                : []),
              {
                key: "delete",
                label: "Delete",
                icon: Trash2,
                variant: "delete",
                onClick: () => handleDeleteSingle(row.original._id),
              },
            ]}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [handleMarkSingleRead, handleDeleteSingle],
  );

  return (
    <>
      <div className="flex items-center justify-between py-4 lg:py-8">
        <SectionTitle
          title="Notifications"
          description={`${totalUnreadDoc} unread notification${totalUnreadDoc !== 1 ? "s" : ""}`}
        />
        <ButtonGroup>
          <Button
            size="sm"
            disabled={!selectedIds?.length}
            onClick={handleMarkIsRead}
          >
            <Mail className="mr-2 h-4 w-4" />
            Mark as Read
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={!selectedIds?.length}
            onClick={handleDeleteMany}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </ButtonGroup>
      </div>

      <AnimatedContent>
        <DynamicTable
          data={notifications}
          columns={columns}
          loading={loading}
          serverSide
          searchText={searchText}
          onSearchChange={(v) => {
            setSearchText(v);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search notifications..."
          filters={[
            {
              title: "Status",
              options: [
                { label: "Unread", value: "unread" },
                { label: "Read", value: "read" },
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

export default Notifications;
