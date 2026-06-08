import React from "react";
import { TableCell, TableBody, TableRow } from "@/components/ui/table";

//internal import
import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const OrderTable = ({ orders }) => {
  // console.log("orders", orders);
  const { formatPrice, showDateTimeFormat } = useUtilsFunction();
  return (
    <>
      <TableBody>
        {orders?.map((order) => (
          <TableRow key={order._id}>
            <TableCell>
              <span className="text-sm">
                {showDateTimeFormat(order.createdAt)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm ">{order?.user_info?.name}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {order.paymentMethod}
              </span>
            </TableCell>

            <TableCell>
              {" "}
              <span className="text-sm font-semibold">
                {formatPrice(order.total)}
              </span>{" "}
            </TableCell>
            <TableCell>
              {" "}
              <span className="text-sm">{order?.user_info?.email}</span>{" "}
            </TableCell>
            <TableCell>{/* <Status status={order.status} /> */}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default OrderTable;
