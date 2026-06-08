import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiArrowLeft, FiEdit, FiClock, FiPackage } from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

//internal import
import CampaignServices from "@/services/CampaignServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import AnimatedContent from "@/components/common/AnimatedContent";
import { SectionTitle } from "@/components/common/SectionTitle";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency, formatPrice, showDateFormat, showingTranslateValue } =
    useUtilsFunction();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => CampaignServices.getCampaignById(id),
    enabled: !!id,
  });

  const campaignStatusInfo = useMemo(() => {
    if (!campaign) return {};
    const now = dayjs();
    const start = dayjs(campaign.startTime);
    const end = dayjs(campaign.endTime);

    if (now.isBefore(start)) {
      return {
        status: "upcoming",
        label: "Upcoming",
        variant: "warning",
        timeInfo: `Starts ${start.fromNow()}`,
      };
    }
    if (now.isAfter(end)) {
      return {
        status: "expired",
        label: "Expired",
        variant: "error",
        timeInfo: `Ended ${end.fromNow()}`,
      };
    }
    return {
      status: "active",
      label: "Active",
      variant: "success",
      timeInfo: `Ends ${end.fromNow()}`,
    };
  }, [campaign]);

  const stats = useMemo(() => {
    if (!campaign?.products) return {};
    const products = campaign.products;
    const totalProducts = products.length;
    const activeProducts = products.filter(
      (p) => p.isActive && p.soldCount < p.stockLimit,
    ).length;
    const totalStock = products.reduce((acc, p) => acc + p.stockLimit, 0);
    const totalSold = products.reduce((acc, p) => acc + (p.soldCount || 0), 0);
    const totalRevenue = products.reduce(
      (acc, p) => acc + (p.soldCount || 0) * p.campaignPrice,
      0,
    );

    return {
      totalProducts,
      activeProducts,
      totalStock,
      totalSold,
      soldPercentage:
        totalStock > 0 ? Math.round((totalSold / totalStock) * 100) : 0,
      totalRevenue,
    };
  }, [campaign]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">Campaign not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/campaigns")}
        >
          Back to Campaigns
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between py-4 lg:py-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/campaigns")}
          >
            <FiArrowLeft className="mr-1" /> Back
          </Button>
          <SectionTitle
            title={showingTranslateValue(campaign.title)}
            description={campaignStatusInfo.timeInfo}
          />
          <Badge variant={campaignStatusInfo.variant} className="ml-2">
            {campaignStatusInfo.label}
          </Badge>
        </div>
      </div>

      <AnimatedContent>
        {/* Campaign Banner */}
        {campaign.banner && (
          <div className="mb-6 rounded-xl overflow-hidden border border-border">
            <img
              src={campaign.banner}
              alt={showingTranslateValue(campaign.title)}
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FiPackage className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Products</span>
            </div>
            <p className="text-2xl font-bold">
              {stats.activeProducts}
              <span className="text-sm font-normal text-muted-foreground">
                /{stats.totalProducts}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Active products
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <FiPackage className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-sm text-muted-foreground">Total Sold</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalSold}</p>
            <p className="text-xs text-muted-foreground mt-1">
              of {stats.totalStock} total stock
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <FiClock className="h-5 w-5 text-orange-500" />
              </div>
              <span className="text-sm text-muted-foreground">Sold %</span>
            </div>
            <p className="text-2xl font-bold">{stats.soldPercentage}%</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  stats.soldPercentage >= 90
                    ? "bg-destructive"
                    : stats.soldPercentage >= 60
                      ? "bg-orange-500"
                      : "bg-primary"
                }`}
                style={{ width: `${stats.soldPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FiPackage className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm text-muted-foreground">Revenue</span>
            </div>
            <p className="text-2xl font-bold">
              {currency}
              {stats.totalRevenue?.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              From campaign sales
            </p>
          </div>
        </div>

        {/* Campaign Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Duration
            </h3>
            <p className="text-sm">
              {showDateFormat(campaign.startTime)} →{" "}
              {showDateFormat(campaign.endTime)}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Display Section
            </h3>
            <p className="text-sm capitalize">
              {campaign.showSection?.replace(/_/g, " ") || "None"}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Settings
            </h3>
            <div className="flex gap-2">
              <Badge variant={campaign.status === "show" ? "success" : "error"}>
                {campaign.status === "show" ? "Published" : "Unpublished"}
              </Badge>
              {campaign.isFeatured && <Badge variant="default">Featured</Badge>}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-5 border-b border-border">
            <h3 className="text-lg font-semibold">Campaign Products</h3>
            <p className="text-sm text-muted-foreground">
              Products included in this campaign with pricing and stock info
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="text-center p-4 text-xs font-medium text-muted-foreground">
                    Original Price
                  </th>
                  <th className="text-center p-4 text-xs font-medium text-muted-foreground">
                    Campaign Price
                  </th>
                  <th className="text-center p-4 text-xs font-medium text-muted-foreground">
                    Discount
                  </th>
                  <th className="text-center p-4 text-xs font-medium text-muted-foreground">
                    Stock Progress
                  </th>
                  <th className="text-center p-4 text-xs font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaign.products?.map((cp, index) => {
                  const product = cp.product;
                  const remaining = cp.stockLimit - (cp.soldCount || 0);
                  const soldPercent =
                    cp.stockLimit > 0
                      ? Math.round(((cp.soldCount || 0) / cp.stockLimit) * 100)
                      : 0;

                  return (
                    <tr
                      key={index}
                      className="border-b border-border/50 hover:bg-muted/30"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product?.image?.[0] ||
                              "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                            }
                            alt=""
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {product
                                ? showingTranslateValue(product.title)
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-sm text-muted-foreground line-through">
                          {currency}
                          {cp.originalPrice}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-sm font-bold text-primary">
                          {currency}
                          {cp.campaignPrice}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="outline">
                          {cp.discountType === "percentage"
                            ? `${cp.discountValue}%`
                            : `${currency}${cp.discountValue}`}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="min-w-[140px]">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Sold: {cp.soldCount || 0}</span>
                            <span>Left: {remaining}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                soldPercent >= 90
                                  ? "bg-destructive"
                                  : soldPercent >= 60
                                    ? "bg-orange-500"
                                    : "bg-primary"
                              }`}
                              style={{ width: `${soldPercent}%` }}
                            />
                          </div>
                          <div className="text-xs text-center mt-1 font-medium">
                            {soldPercent}%
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {!cp.isActive || cp.soldCount >= cp.stockLimit ? (
                          <Badge variant="error">Sold Out</Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {(!campaign.products || campaign.products.length === 0) && (
              <div className="text-center py-12 text-muted-foreground">
                No products in this campaign
              </div>
            )}
          </div>
        </div>
      </AnimatedContent>
    </>
  );
};

export default CampaignDetails;
