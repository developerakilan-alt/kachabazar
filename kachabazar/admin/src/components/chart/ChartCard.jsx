import React from "react";
import Skeleton from "react-loading-skeleton";

const Chart = ({ children, title, loading, mode }) => {
  return (
    <div className="min-w-0 p-4 bg-card text-card-foreground rounded-lg shadow-xs">
      <p className="mb-4 font-semibold text-foreground">
        {loading ? (
          <Skeleton
            count={1}
            height={20}
            className="bg-muted"
            baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
            highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
          />
        ) : (
          title
        )}
      </p>

      {title === "Best Selling Products" ? (
        <>
          {loading ? (
            <div className="flex justify-center">
              <Skeleton
                className="bg-muted"
                baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
                highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
                count={1}
                width={250}
                height={250}
                circle
              />
            </div>
          ) : (
            children
          )}
        </>
      ) : (
        <>
          {loading ? (
            <Skeleton
              className="bg-muted"
              baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
              highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
              count={13}
              height={20}
            />
          ) : (
            children
          )}
        </>
      )}
    </div>
  );
};

export default Chart;
