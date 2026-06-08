import React from "react";

const Stock = ({ stock, card }) => {
  return (
    <>
      {stock <= 0 ? (
        <span className="bg-red-100 text-red-500 rounded-full inline-flex items-center justify-center px-2 py-0 text-xs font-medium font-serif">
          Stock Out
        </span>
      ) : (
        <span>
          <span
            className={`${
              card
                ? "bg-muted text-primary rounded-full text-xs px-2 py-0 font-medium"
                : "bg-primary/10 text-primary rounded-full inline-flex items-center justify-center px-2 py-0 text-xs font-semibold  font-serif"
            }`}
          >
            Stock :
            <span className="text-red-500 pl-1 font-bold">
              {stock}{" "}
            </span>
          </span>
        </span>
      )}
    </>
  );
};

export default Stock;
