import React from "react";
import { TableCell, TableBody, TableRow } from "@/components/ui/table";

import useUtilsFunction from "@/hooks/useUtilsFunction";

const Invoice = ({ data }) => {
  const { formatPrice } = useUtilsFunction();
  return (
    <>
      <TableBody className="bg-card divide-y divide-border text-serif text-sm ">
        {data?.cart?.map((item, i) => (
          <TableRow key={i} className=" ">
            <TableCell className="px-6 py-1 whitespace-nowrap font-normal text-muted-foreground text-left">
              {i + 1}{" "}
            </TableCell>
            <TableCell className="px-6 py-1 whitespace-nowrap font-normal text-muted-foreground">
              <span
                className={`text-foreground font-semibold   text-xs ${
                  item.title.length > 15 ? "wrap-long-title" : "" // Apply class conditionally
                }`}
              >
                {item.title}
              </span>
            </TableCell>
            <TableCell className="px-6 py-1 whitespace-nowrap font-bold text-center">
              {item.quantity}{" "}
            </TableCell>
            <TableCell className="px-6 py-1 whitespace-nowrap font-bold text-center">
              {formatPrice(item.price)}
            </TableCell>

            <TableCell className="px-6 py-1 whitespace-nowrap text-right font-bold text-red-500 ">
              {formatPrice(item.itemTotal)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default Invoice;
