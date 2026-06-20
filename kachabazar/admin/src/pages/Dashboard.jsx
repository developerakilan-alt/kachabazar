import { CustomPagination as Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/context/ThemeContext";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiCheck,
  FiCheckCircle,
  FiRefreshCw,
  FiShoppingCart,
  FiTruck,
  FiShoppingBag,
  FiArchive,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiLayers,
  FiLoader,
  FiPackage,
} from "react-icons/fi";
import { ImCreditCard, ImStack } from "react-icons/im";

//internal import
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import NotFound from "@/components/table/NotFound";
import ChartCard from "@/components/chart/ChartCard";
import OrderTable from "@/components/order/OrderTable";
import PieChart from "@/components/chart/Pie/PieChart";
import CardItem from "@/components/dashboard/CardItem";
import OrderServices from "@/services/OrderServices";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import CardItemTwo from "@/components/dashboard/CardItemTwo";
import LineChart from "@/components/chart/LineChart/LineChart";
import TableLoading from "@/components/preloader/TableLoading";
import AnimatedContent from "@/components/common/AnimatedContent";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  dayjs.extend(isBetween);
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);

  const { currentPage, handleChangePage } = useContext(SidebarContext);

  // react hook
  const [todayOrderAmount, setTodayOrderAmount] = useState(0);
  const [yesterdayOrderAmount, setYesterdayOrderAmount] = useState(0);
  const [salesReport, setSalesReport] = useState([]);
  const [todayCashPayment, setTodayCashPayment] = useState(0);
  const [todayCardPayment, setTodayCardPayment] = useState(0);
  const [todayCreditPayment, setTodayCreditPayment] = useState(0);
  const [yesterdayCashPayment, setYesterdayCashPayment] = useState(0);
  const [yesterdayCardPayment, setYesterdayCardPayment] = useState(0);
  const [yesterdayCreditPayment, setYesterdayCreditPayment] = useState(0);

  // const {
  //   data: bestSellerProductChart,
  //   loading: loadingBestSellerProduct,
  //   error,
  // } = useAsync(OrderServices.getBestSellerProductChart);

  const {
    data: bestSellerProductChart,
    isLoading: loadingBestSellerProduct,
    error: errorBestSeller,
  } = useQuery({
    queryKey: ["bestSellerProductChart"],
    queryFn: OrderServices.getBestSellerProductChart,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // const { data: dashboardRecentOrder, loading: loadingRecentOrder } = useAsync(
  //   () => OrderServices.getDashboardRecentOrder({ page: currentPage, limit: 8 })
  // );
  const {
    data: dashboardRecentOrder,
    isLoading: loadingRecentOrder,
    error: errorRecentOrder,
  } = useQuery({
    queryKey: ["dashboardRecentOrder", currentPage],
    queryFn: () =>
      OrderServices.getDashboardRecentOrder({ page: currentPage, limit: 8 }),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // const { data: dashboardOrderCount, loading: loadingOrderCount } = useAsync(
  //   OrderServices.getDashboardCount
  // );

  const {
    data: dashboardOrderCount,
    isLoading: loadingOrderCount,
    error: errorOrderCount,
  } = useQuery({
    queryKey: ["dashboardOrderCount"],
    queryFn: OrderServices.getDashboardCount,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // const { data: dashboardOrderAmount, loading: loadingOrderAmount } = useAsync(
  //   OrderServices.getDashboardAmount
  // );
  const {
    data: dashboardOrderAmount,
    isLoading: loadingOrderAmount,
    error: errorOrderAmount,
  } = useQuery({
    queryKey: ["dashboardOrderAmount"],
    queryFn: OrderServices.getDashboardAmount,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // Combined error flag — true if any dashboard query failed
  const hasError =
    errorBestSeller || errorRecentOrder || errorOrderCount || errorOrderAmount;

  // console.log("dashboardOrderCount", dashboardOrderCount);

  const { dataTable, serviceData } = useFilter(dashboardRecentOrder?.orders);

  useEffect(() => {
    // today orders show
    const todayOrder = dashboardOrderAmount?.ordersData?.filter((order) =>
      dayjs(order.updatedAt).isToday(),
    );
    //  console.log('todayOrder',dashboardOrderAmount.ordersData)
    const todayReport = todayOrder?.reduce((pre, acc) => pre + acc.total, 0);
    setTodayOrderAmount(todayReport);

    // yesterday orders
    const yesterdayOrder = dashboardOrderAmount?.ordersData?.filter((order) =>
      dayjs(order.updatedAt).isYesterday(),
    );

    const yesterdayReport = yesterdayOrder?.reduce(
      (pre, acc) => pre + acc.total,
      0,
    );
    setYesterdayOrderAmount(yesterdayReport);

    // sales orders chart data
    if (dashboardOrderAmount?.weeklySalesReport) {
      setSalesReport(dashboardOrderAmount.weeklySalesReport);
    } else {
      const salesOrderChartData = dashboardOrderAmount?.ordersData?.filter(
        (order) =>
          dayjs(order.updatedAt).isBetween(
            new Date().setDate(new Date().getDate() - 7),
            new Date(),
          ),
      );

      const report = salesOrderChartData?.reduce((res, value) => {
        let onlyDate = value.updatedAt.split("T")[0];

        if (!res[onlyDate]) {
          res[onlyDate] = { date: onlyDate, total: 0, order: 0 };
        }
        res[onlyDate].total += value.total;
        res[onlyDate].order += 1;
        return res;
      }, {});

      setSalesReport(Object.values(report || {}));
    }

    const todayPaymentMethodData = [];
    const yesterDayPaymentMethodData = [];

    // today order payment method
    dashboardOrderAmount?.ordersData?.filter((item, value) => {
      if (dayjs(item.updatedAt).isToday()) {
        if (item.paymentMethod === "Cash") {
          let cashMethod = {
            paymentMethod: "Cash",
            total: item.total,
          };
          todayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Credit") {
          const cashMethod = {
            paymentMethod: "Credit",
            total: item.total,
          };

          todayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Card") {
          const cashMethod = {
            paymentMethod: "Card",
            total: item.total,
          };

          todayPaymentMethodData.push(cashMethod);
        }
      }

      return item;
    });
    // yesterday order payment method
    dashboardOrderAmount?.ordersData?.filter((item, value) => {
      if (dayjs(item.updatedAt).isYesterday()) {
        if (item.paymentMethod === "Cash") {
          let cashMethod = {
            paymentMethod: "Cash",
            total: item.total,
          };
          yesterDayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Credit") {
          const cashMethod = {
            paymentMethod: "Credit",
            total: item?.total,
          };

          yesterDayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Card") {
          const cashMethod = {
            paymentMethod: "Card",
            total: item?.total,
          };

          yesterDayPaymentMethodData.push(cashMethod);
        }
      }

      return item;
    });

    const todayCsCdCit = Object.values(
      todayPaymentMethodData.reduce((r, { paymentMethod, total }) => {
        if (!r[paymentMethod]) {
          r[paymentMethod] = { paymentMethod, total: 0 };
        }
        r[paymentMethod].total += total;

        return r;
      }, {}),
    );
    const today_cash_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Cash",
    );
    setTodayCashPayment(today_cash_payment?.total);
    const today_card_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Card",
    );
    setTodayCardPayment(today_card_payment?.total);
    const today_credit_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Credit",
    );
    setTodayCreditPayment(today_credit_payment?.total);

    const yesterDayCsCdCit = Object.values(
      yesterDayPaymentMethodData.reduce((r, { paymentMethod, total }) => {
        if (!r[paymentMethod]) {
          r[paymentMethod] = { paymentMethod, total: 0 };
        }
        r[paymentMethod].total += total;

        return r;
      }, {}),
    );
    const yesterday_cash_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Cash",
    );
    setYesterdayCashPayment(yesterday_cash_payment?.total);
    const yesterday_card_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Card",
    );
    setYesterdayCardPayment(yesterday_card_payment?.total);
    const yesterday_credit_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Credit",
    );
    setYesterdayCreditPayment(yesterday_credit_payment?.total);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardOrderAmount]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between py-8 gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("DashboardOverview")}</PageTitle>
        </div>
      </div>

      {hasError && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-orange-300 bg-orange-50 dark:border-orange-500/30 dark:bg-orange-500/10 px-4 py-3 text-sm text-orange-700 dark:text-orange-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            Unable to connect to the server. Some data may be unavailable.
            Please check that the backend is running.
          </span>
        </div>
      )}

      <AnimatedContent>
        <div className="grid gap-2 mb-8 xl:grid-cols-5 md:grid-cols-2">
          <CardItemTwo
            mode={theme}
            title="Today Order"
            title2="TodayOrder"
            Icon={FiShoppingBag}
            cash={todayCashPayment || 0}
            card={todayCardPayment || 0}
            credit={todayCreditPayment || 0}
            price={todayOrderAmount || 0}
            color1="bg-blue-300"
            color2="bg-indigo-300"
            color3="bg-cyan-200"
            loading={loadingOrderAmount}
          />

          <CardItemTwo
            mode={theme}
            title="Yesterday Order"
            title2="YesterdayOrder"
            Icon={FiArchive}
            cash={yesterdayCashPayment || 0}
            card={yesterdayCardPayment || 0}
            credit={yesterdayCreditPayment || 0}
            price={yesterdayOrderAmount || 0}
            color1="bg-cyan-300"
            color2="bg-emerald-200"
            color3="bg-yellow-200"
            loading={loadingOrderAmount}
          />

          <CardItemTwo
            mode={theme}
            title2="ThisMonth"
            Icon={FiCalendar}
            price={dashboardOrderAmount?.thisMonthlyOrderAmount || 0}
            color1="bg-purple-300"
            color2="bg-pink-300"
            color3="bg-orange-200"
            loading={loadingOrderAmount}
          />

          <CardItemTwo
            mode={theme}
            title2="LastMonth"
            Icon={FiClock}
            loading={loadingOrderAmount}
            price={dashboardOrderAmount?.lastMonthOrderAmount || 0}
            color1="bg-teal-300"
            color2="bg-cyan-200"
            color3="bg-green-200"
          />

          <CardItemTwo
            mode={theme}
            title2="AllTimeSales"
            Icon={FiTrendingUp}
            price={dashboardOrderAmount?.totalAmount || 0}
            color1="bg-fuchsia-300"
            color2="bg-purple-300"
            color3="bg-pink-200"
            loading={loadingOrderAmount}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CardItem
            title="Total Order"
            Icon={FiLayers}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalOrder || 0}
            className="text-orange-500 bg-orange-500/10"
          />
          <CardItem
            title={t("OrderPending")}
            Icon={FiLoader}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalPendingOrder?.count || 0}
            amount={dashboardOrderCount?.totalPendingOrder?.total || 0}
            className="text-blue-500 bg-blue-500/10"
          />
          <CardItem
            title={t("OrderProcessing")}
            Icon={FiPackage}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalProcessingOrder || 0}
            className="text-indigo-500 bg-indigo-500/10"
          />
          <CardItem
            title={t("OrderDelivered")}
            Icon={FiCheckCircle}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalDeliveredOrder || 0}
            className="text-emerald-500 bg-emerald-500/10"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 my-8">
          <ErrorBoundary>
            <ChartCard
              mode={theme}
              loading={loadingOrderAmount}
              title={t("WeeklySales")}
            >
              <LineChart salesReport={salesReport} />
            </ChartCard>
          </ErrorBoundary>

          <ErrorBoundary>
            <ChartCard
              mode={theme}
              loading={loadingBestSellerProduct}
              title={t("BestSellingProducts")}
            >
              <PieChart data={bestSellerProductChart} />
            </ChartCard>
          </ErrorBoundary>
        </div>
      </AnimatedContent>

      <div className="pb-5">
        <PageTitle>{t("RecentOrder")}</PageTitle>
      </div>
      {/* <Loading loading={loading} /> */}
      <div className="min-w-0 border overflow-hidden bg-card rounded-lg mb-4">
        <div className="p-5">
          {loadingRecentOrder ? (
            <TableLoading row={5} col={4} />
          ) : errorRecentOrder ? (
            <span className="text-center mx-auto text-red-500 block py-8">
              Unable to load recent orders. Please check your server connection.
            </span>
          ) : serviceData?.length > 0 ? (
            <div>
              <TableContainer className="mb-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("InvoiceNo")}</TableHead>
                      <TableHead>{t("TimeTbl")}</TableHead>
                      <TableHead>{t("CustomerName")} </TableHead>
                      <TableHead> {t("MethodTbl")} </TableHead>
                      <TableHead> {t("AmountTbl")} </TableHead>
                      <TableHead>{t("OderStatusTbl")}</TableHead>
                      <TableHead>{t("ActionTbl")}</TableHead>
                      <TableHead className="text-right">
                        {t("InvoiceTbl")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <OrderTable orders={dataTable} />
                </Table>
              </TableContainer>
              <div className="mt-4 flex justify-center">
                <Pagination
                  totalresults={dashboardRecentOrder?.totalOrder}
                  resultsperpage={8}
                  onChange={handleChangePage}
                  label="Table navigation"
                />
              </div>
            </div>
          ) : (
            <NotFound title="Sorry, There are no orders right now." />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
