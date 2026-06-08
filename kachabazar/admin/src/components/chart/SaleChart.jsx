import useUtilsFunction from "@/hooks/useUtilsFunction";
import { useState } from "react";
import { Line } from "react-chartjs-2";

const SaleChart = ({ salesReport }) => {
  const { getNumber } = useUtilsFunction();
  const [activeButton, setActiveButton] = useState({
    title: "Sales",
    color: "emerald",
  });

  const handleClick = ({ title, color }) => {
    setActiveButton({ title, color });
  };

  const barOptions = {
    data: {
      labels: salesReport?.map((or) => or.date),
      datasets: [
        activeButton.title === "Sales"
          ? {
              label: "Sales",
              data: salesReport?.map((or) => getNumber(or.total)),
              borderColor: "#10B981",
              backgroundColor: "#10B981",
              borderWidth: 3,
              yAxisID: "y",
            }
          : {
              label: "Order",
              data: salesReport?.map((or) => or.order),
              borderColor: "#F97316",
              backgroundColor: "#F97316",
              borderWidth: 3,
              yAxisID: "y",
            },
      ],
    },
    options: {
      responsive: true,
    },
    legend: {
      display: false,
    },
  };

  return (
    <>
      <div className="text-sm font-medium text-center text-muted-foreground border-b border-border   mb-4">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => handleClick({ title: "Sales", color: "emerald" })}
              type="button"
              className={`inline-block p-2 rounded-t-lg border-b-2 border-transparent ${
                activeButton.title === "Sales"
                  ? "text-primary border-primary  "
                  : "hover:text-muted-foreground hover:border-muted"
              }  focus:outline-none`}
            >
              Sales
            </button>
          </li>

          <li className="mr-2">
            <button
              onClick={() => handleClick({ title: "Orders", color: "red" })}
              type="button"
              className={`inline-block p-2 rounded-t-lg border-b-2 border-transparent ${
                activeButton.title === "Orders"
                  ? "text-orange-500 border-orange-500  "
                  : "hover:text-muted-foreground hover:border-muted"
              }  focus:outline-none`}
            >
              Orders
            </button>
          </li>
        </ul>
      </div>

      <Line {...barOptions} />
    </>
  );
};

export default SaleChart;
