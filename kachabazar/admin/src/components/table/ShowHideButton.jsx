import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import { Switch } from "@/components/ui/switch";
import AttributeServices from "@/services/AttributeServices";
import CategoryServices from "@/services/CategoryServices";
import CouponServices from "@/services/CouponServices";
import CampaignServices from "@/services/CampaignServices";
import CurrencyServices from "@/services/CurrencyServices";
import LanguageServices from "@/services/LanguageServices";
import ProductServices from "@/services/ProductServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const ShowHideButton = ({ id, status, category, currencyStatusName }) => {
  const location = useLocation();
  const { setIsUpdate } = useContext(SidebarContext);

  const queryClient = useQueryClient();

  const refreshCategoryQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["categoryTree"] });
    queryClient.invalidateQueries({ queryKey: ["allCategories"] });
    queryClient.invalidateQueries({ queryKey: ["categories-all"] });
  };

  const handleChangeStatus = async () => {
    try {
      let newStatus;
      if (status === "show") {
        newStatus = "hide";
      } else {
        newStatus = "show";
      }

      if (location.pathname === "/categories" || category) {
        const res = await CategoryServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
        refreshCategoryQueries();
      }

      if (location.pathname === "/products") {
        const res = await ProductServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["products"]);
      }

      if (location.pathname === "/languages") {
        const res = await LanguageServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["languages"]);
      }
      if (location.pathname === "/currencies") {
        if (currencyStatusName === "status") {
          const res = await CurrencyServices.updateEnabledStatus(id, {
            status: newStatus,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["currencies"]);
        } else {
          const res = await CurrencyServices.updateLiveExchangeRateStatus(id, {
            live_exchange_rates: newStatus,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
        }
      }

      if (location.pathname === "/attributes") {
        const res = await AttributeServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["attributes"]);
      }

      if (
        location.pathname === `/attributes/${location.pathname.split("/")[2]}`
      ) {
        const res = await AttributeServices.updateChildStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["attribute"]);
      }

      if (location.pathname === "/coupons") {
        // console.log('coupns',id)
        const res = await CouponServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["coupons"]);
      }

      if (location.pathname === "/campaigns") {
        const res = await CampaignServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
        queryClient.invalidateQueries(["campaigns"]);
      }

      if (location.pathname === "/our-staff") {
        // console.log('coupns',id)
        const res = await CouponServices.updateStaffStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["our-staff"]);
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };

  return (
    <Switch
      checked={status === "show"}
      onCheckedChange={handleChangeStatus}
      className="ml-1"
    />
  );
};

export default ShowHideButton;
