import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { Pencil, Trash2, Eye } from "lucide-react";
import dayjs from "dayjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

//internal import
import CampaignServices from "@/services/CampaignServices";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import CampaignDrawer from "@/components/drawer/CampaignDrawer";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import AnimatedContent from "@/components/common/AnimatedContent";
import { useAction } from "@/context/ActionContext";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import ShowHideButton from "@/components/table/ShowHideButton";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import { DynamicTable } from "@/components/table/DynamicTable";
import { DynamicTableColumnHeader } from "@/components/table/DynamicTableColumnHeader";
import { DynamicTableRowActions } from "@/components/table/DynamicTableRowActions";
import { selectColumn } from "@/components/table/selectColumn";

const Campaigns = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  // Server-side state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [campaignStatus, setCampaignStatus] = useState("");

  const sortBy = sorting[0]?.id || "";
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : "";

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: [
      "campaigns",
      currentPage,
      pageSize,
      searchText,
      statusFilter,
      campaignStatus,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      CampaignServices.getAllCampaigns({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        status: statusFilter || undefined,
        campaignStatus: campaignStatus || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
      }),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const campaigns = useMemo(() => data?.campaigns || [], [data?.campaigns]);
  const totalDoc = data?.totalDoc || 0;

  const {
    title,
    handleDeleteMany,
    handleUpdateMany,
    handleUpdate,
    handleModalOpen,
  } = useToggleDrawer();
  const { currency, formatPrice, showDateFormat, showingTranslateValue } =
    useUtilsFunction();

  const handleResetFilters = useCallback(() => {
    setSearchText("");
    setStatusFilter("");
    setCampaignStatus("");
    setCurrentPage(1);
  }, []);

  const getCampaignStatusBadge = (campaign) => {
    const now = dayjs();
    const start = dayjs(campaign.startTime);
    const end = dayjs(campaign.endTime);

    if (now.isBefore(start)) {
      return <Badge variant="warning">Upcoming</Badge>;
    }
    if (now.isAfter(end)) {
      return <Badge variant="error">Expired</Badge>;
    }
    return <Badge variant="success">Active</Badge>;
  };

  const columns = useMemo(
    () => [
      selectColumn,
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Campaign Name" />
        ),
        cell: ({ row }) => {
          const campaign = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="hidden md:block bg-muted p-0.5 shadow-none h-10 w-10 rounded">
                <AvatarImage
                  src={
                    campaign?.banner ||
                    "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                  }
                  alt="campaign"
                  className="object-cover"
                />
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
              <div>
                <span className="text-sm font-medium">
                  {showingTranslateValue(campaign?.title)}
                </span>
                {campaign?.isFeatured && (
                  <Badge variant="default" className="ml-2 text-[10px] px-1.5">
                    🏠 Home Page
                  </Badge>
                )}
              </div>
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "products",
        header: () => <span className="text-center block">Products</span>,
        cell: ({ row }) => {
          const products = row.original.products || [];
          const active = products.filter(
            (p) => p.isActive && p.soldCount < p.stockLimit,
          ).length;
          return (
            <div className="text-center">
              <span className="text-sm font-semibold">{active}</span>
              <span className="text-xs text-muted-foreground">
                /{products.length}
              </span>
            </div>
          );
        },
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
              status={row.original.status}
              category
              useService={{
                updateStatus: CampaignServices.updateStatus,
              }}
            />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "startTime",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Start Date" />
        ),
        cell: ({ row }) => (
          <span className="text-sm">
            {showDateFormat(row.original.startTime)}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "endTime",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="End Date" />
        ),
        cell: ({ row }) => (
          <span className="text-sm">
            {showDateFormat(row.original.endTime)}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: "campaignStatus",
        header: ({ column }) => (
          <DynamicTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => getCampaignStatusBadge(row.original),
        enableSorting: false,
      },
      {
        accessorKey: "showSection",
        header: () => <span className="block">Section</span>,
        cell: ({ row }) => {
          const section = row.original.showSection;
          const labels = {
            home_top: "Home Top",
            home_middle: "Home Middle",
            home_bottom: "Home Bottom",
            sidebar: "Sidebar",
            none: "Flash Sale Only",
          };
          return <span className="text-xs">{labels[section] || section}</span>;
        },
        enableSorting: false,
      },
      {
        id: "actions",
        header: () => (
          <span className="text-right block">{t("CoupTblActions")}</span>
        ),
        cell: ({ row }) => (
          <DynamicTableRowActions
            row={row}
            actions={[
              {
                key: "view",
                label: "View Details",
                icon: Eye,
                onClick: () => navigate(`/campaign/${row.original._id}`),
              },
              {
                key: "edit",
                label: t("Edit"),
                icon: Pencil,
                onClick: () => handleUpdate(row.original._id),
              },
              { separator: true },
              {
                key: "delete",
                label: t("Delete"),
                icon: Trash2,
                variant: "delete",
                onClick: () =>
                  handleModalOpen(
                    row.original._id,
                    showingTranslateValue(row.original?.title),
                  ),
              },
            ]}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [
      t,
      currency,
      showDateFormat,
      showingTranslateValue,
      handleUpdate,
      handleModalOpen,
      navigate,
    ],
  );

  return (
    <>
      <div className="flex items-center justify-between py-4 lg:py-8">
        <SectionTitle
          title="Campaigns"
          description="Manage flash sale campaigns and promotional offers"
        />
        <ButtonGroup>
          <Button
            variant="bulkAction"
            disabled={selectedIds?.length < 1}
            onClick={() => handleUpdateMany(selectedIds)}
          >
            <FiEdit className="mr-1" />
            {t("BulkAction")}
          </Button>
          <Button
            variant="delete"
            disabled={selectedIds?.length < 1}
            onClick={() =>
              handleDeleteMany(selectedIds, t("Selected") + " Campaigns")
            }
          >
            <FiTrash2 className="mr-1" />
            {t("Delete")}
          </Button>
          <Button variant="create" onClick={toggleDrawer}>
            <FiPlus className="mr-1" />
            Add Campaign
          </Button>
        </ButtonGroup>
      </div>

      <DeleteModal
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
        ids={selectedIds?.length > 0 ? selectedIds : null}
        useService={{
          deleteCoupon: CampaignServices.deleteCampaign,
          deleteManyCoupons: CampaignServices.deleteManyCampaigns,
        }}
      />
      <BulkActionDrawer ids={selectedIds} title="Campaigns" />

      <MainDrawer>
        <CampaignDrawer id={selectedId} />
      </MainDrawer>

      <AnimatedContent>
        <DynamicTable
          data={campaigns}
          columns={columns}
          loading={loading}
          serverSide
          searchText={searchText}
          onSearchChange={(v) => {
            setSearchText(v);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search campaigns by name..."
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
              title: "Status",
              options: [
                { label: "Active", value: "active" },
                { label: "Upcoming", value: "upcoming" },
                { label: "Expired", value: "expired" },
              ],
              value: campaignStatus,
              onChange: (v) => {
                setCampaignStatus(v);
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

export default Campaigns;
