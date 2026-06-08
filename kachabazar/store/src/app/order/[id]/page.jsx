import { getOrderById } from "@lib/actions/order.actions";
import DownloadPrintButton from "@components/invoice/DownloadPrintButton";
import { getCustomizationSettings } from "@lib/actions/settings.actions";

const Order = async ({ params }) => {
  const { id } = await params;
  const { order: data, error } = await getOrderById(id);
  const { storeCustomizationSetting } = await getCustomizationSettings();
  // console.log("params", params);

  return (
    <>
      <div className="max-w-screen-2xl mx-auto py-10 px-3 sm:px-6">
        <DownloadPrintButton
          data={data}
          storeCustomizationSetting={storeCustomizationSetting}
        />
      </div>
    </>
  );
};

export default Order;
