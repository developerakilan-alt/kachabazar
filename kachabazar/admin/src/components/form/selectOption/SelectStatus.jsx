import React, { useContext } from "react";

//internal import
import OrderServices from "@/services/OrderServices";
import { notifySuccess, notifyError } from "@/utils/toast";
import { SidebarContext } from "@/context/SidebarContext";
import { useQueryClient } from "@tanstack/react-query";

const SelectStatus = ({ id, order }) => {
  const queryClient = useQueryClient();
  const { setIsUpdate } = useContext(SidebarContext);

  const handleChangeStatus = (e) => {
    const status = e.target.value;
    OrderServices.updateOrder(id, { status })
      .then((res) => {
        notifySuccess(res.message);
        queryClient.invalidateQueries({
          queryKey: ["dashboardRecentOrder"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["allOrders"],
          exact: false,
        });
        setIsUpdate(true);
      })
      .catch((err) => notifyError(err.message));
  };

  return (
    <select
      value={order?.status?.toLowerCase() || ""}
      onChange={handleChangeStatus}
      className="h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm capitalize text-foreground shadow-xs outline-none focus:border-ring focus:ring-ring/40 focus:ring-[3px] dark:bg-input/30"
    >
      <option value="delivered">Delivered</option>
      <option value="pending">Pending</option>
      <option value="processing">Processing</option>
      <option value="out-for-delivery">Out for Delivery</option>
      <option value="cancel">Cancel</option>
    </select>
  );
};

export default SelectStatus;
