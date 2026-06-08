import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Skeleton from "react-loading-skeleton";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const CardItem = ({
  title,
  Icon,
  quantity,
  amount,
  className,
  loading,
  mode,
  pending,
  todayPending,
  olderPending,
}) => {
  const { formatPrice } = useUtilsFunction();

  return (
    <>
      {loading ? (
        <Skeleton
          count={2}
          height={40}
          className="bg-muted rounded-xl"
          baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
          highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
        />
      ) : (
        <Card className="flex h-full group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-border/50 bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden">
          <CardContent className="p-3.5 flex flex-col justify-between w-full relative z-10 bg-card">
            
            {/* Top Area: Icon */}
            <div className="flex items-center justify-start mb-2 w-full">
               <div
                  className={`flex items-center justify-center p-1.5 rounded-lg h-9 w-9 text-center shadow-inner transition-transform duration-300 group-hover:scale-110 ${className}`}
                >
                  <Icon size={16} />
                </div>
            </div>

            {/* Bottom Area: Content Box */}
            <div className="mt-auto pt-3">
              <h6 className="text-[14px] mb-0 font-medium text-muted-foreground flex items-center gap-1.5">
                <span>{title}</span>
                {amount && (
                  <span className="text-red-500 font-semibold bg-red-500/10 px-1.5 py-0.5 rounded-full text-[9px]">
                    {formatPrice(amount)}
                  </span>
                )}
              </h6>
              
              <p className="text-lg font-bold tracking-tight text-foreground leading-none mt-1">
                {quantity}
              </p>

              {pending && (
                <div className="grid grid-cols-2 gap-2 w-full mt-2 text-[10px] font-medium text-muted-foreground pt-1.5 border-t border-border/50">
                  <div className="flex flex-col">
                    <span className="opacity-70 text-[9px]">Today</span>
                    <span className="text-primary font-semibold mt-0.5 leading-none">
                      {formatPrice(todayPending)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="opacity-70 text-[9px]">Older</span>
                    <span className="text-orange-500 font-semibold mt-0.5 leading-none">
                      {formatPrice(olderPending)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CardItem;
