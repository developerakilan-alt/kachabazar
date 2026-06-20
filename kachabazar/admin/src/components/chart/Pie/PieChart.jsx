import "chart.js/auto";
import { Pie } from "react-chartjs-2";

const PieChart = ({ data }) => {
  const products = data?.bestSellingProduct;

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        No data available
      </div>
    );
  }

  const PieOption = {
    data: {
      datasets: [
        {
          data: products.map((selling) => selling.count),
          backgroundColor: [
            "#10B981",
            "#3B82F6",
            "#F97316",
            "#0EA5E9",
            "#8B5CF6",
          ],
          label: "Dataset 1",
        },
      ],
      labels: products.map((selling) => {
        const label = selling._id;
        return typeof label === "object"
          ? label?.en || Object.values(label || {})[0] || "Product"
          : label || "Product";
      }),
    },
    options: {
      responsive: true,
      cutoutPercentage: 80,
    },
    legend: {
      display: false,
    },
  };

  return (
    <div>
      <Pie {...PieOption} className="chart" />
    </div>
  );
};

export default PieChart;
