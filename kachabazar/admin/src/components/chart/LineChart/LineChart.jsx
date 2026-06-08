import { useState } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

const LineChart = ({ salesReport }) => {
  // console.log("saleReport", salesReport);
  // Create a Set to store unique dates
  const uniqueDates = new Set();

  // Use filter to iterate through the array and add unique dates to the Set
  const updatedSalesReport = salesReport?.filter((item) => {
    const isUnique = !uniqueDates.has(item.date);
    uniqueDates.add(item.date);
    return isUnique;
  });

  // console.log("updatedSalesReport", updatedSalesReport);

  const [activeButton, setActiveButton] = useState({
    title: "Sales",
    color: "emerald",
  });

  const handleClick = ({ title, color }) => {
    setActiveButton({ title, color });
  };

  const barOptions = {
    data: {
      labels: updatedSalesReport
        ?.sort((a, b) => new Date(a.date) - new Date(b.date))
        ?.map((or) => or.date),
      datasets: [
        activeButton.title === "Sales"
          ? {
              label: "Sales",
              data: updatedSalesReport
                ?.sort((a, b) => new Date(a.date) - new Date(b.date))
                ?.map((or) => or.total),
              borderColor: "#10B981",
              backgroundColor: "#10B981",
              borderWidth: 3,
              yAxisID: "y",
            }
          : {
              label: "Order",
              data: updatedSalesReport
                ?.sort((a, b) => new Date(a.date) - new Date(b.date))
                ?.map((or) => or.order),
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

  const { t } = useTranslation();

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
              {t("Sales")}
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
              {t("Orders")}
            </button>
          </li>
        </ul>
      </div>

      <Line {...barOptions} />
    </>
  );
};

export default LineChart;
