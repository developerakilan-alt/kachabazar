import { Input } from "@/components/ui/input";
import { t } from "i18next";
import { Scrollbars } from "react-custom-scrollbars-2";

//internal import
import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import InputValue from "@/components/form/input/InputValue";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";
import useCouponSubmit from "@/hooks/useCouponSubmit";
import DrawerButton from "@/components/form/button/DrawerButton";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import SwitchToggleFour from "@/components/form/switch/SwitchToggleFour";

const CouponDrawer = ({ id }) => {
  const {
    register,
    language,
    handleSubmit,
    onSubmit,
    errors,
    setImageUrl,
    imageUrl,
    published,
    setPublished,
    currency,
    discountType,
    setDiscountType,
    isSubmitting,
    handleSelectLanguage,
  } = useCouponSubmit(id);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full relative  p-6 border-b bg-muted ">
        {id ? (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateCoupon")}
            description={t("UpdateCouponDescription")}
          />
        ) : (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddCoupon")}
            description={t("AddCouponDescription")}
          />
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <Scrollbars className="flex-1 mb-8">
          <div className="px-6 pt-8 pb-6 flex-grow scrollbar-hide w-full max-h-full">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("CouponBannerImage")} />
              <div className="col-span-8 sm:col-span-4">
                <Uploader
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  folder="coupon"
                  targetWidth={238}
                  targetHeight={238}
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("CampaignName")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Coupon title"
                  name="title"
                  type="text"
                  placeholder={t("CampaignName")}
                />
                <Error errorName={errors.title} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("CampaignCode")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Coupon Code"
                  name="couponCode"
                  type="text"
                  placeholder={t("CampaignCode")}
                />
                <Error errorName={errors.couponCode} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("CouponValidityTime")} />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  {...register(`endTime`, {
                    required: "Coupon Validation End Time",
                  })}
                  label="Coupon Validation End Time"
                  name="endTime"
                  type="datetime-local"
                  placeholder={t("CouponValidityTime")}
                />

                <Error errorName={errors.endTime} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("DiscountType")} />
              <div className="col-span-8 sm:col-span-4">
                <SwitchToggleFour
                  handleProcess={setDiscountType}
                  processOption={discountType}
                />
                <Error errorName={errors.discountType} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("Discount")} />
              <div className="col-span-8 sm:col-span-4">
                <InputValue
                  product
                  required={true}
                  register={register}
                  maxValue={discountType ? 99 : 1000}
                  minValue={1}
                  label="Discount"
                  name="discountPercentage"
                  type="number"
                  placeholder={discountType ? "Percentage" : "Fixed Amount"}
                  currency={discountType ? "%" : currency}
                />

                <Error errorName={errors.discountPercentage} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("MinimumAmount")} />
              <div className="col-span-8 sm:col-span-4">
                <InputValue
                  product
                  required={true}
                  register={register}
                  maxValue={20000000000}
                  minValue={0}
                  label="Minimum Amount"
                  name="minimumAmount"
                  type="number"
                  placeholder={t("MinimumAmountPlasholder")}
                  currency={currency}
                />
                <Error errorName={errors.minimumAmount} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Text Color" />
              <div className="col-span-8 sm:col-span-4">
                <input
                  type="color"
                  {...register("textColor")}
                  className="w-12 h-10 p-1 rounded border border-border cursor-pointer"
                />
                <Error errorName={errors.textColor} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Font Family" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Font Family"
                  name="fontFamily"
                  type="text"
                  placeholder="e.g. Arial, serif, cursive"
                />
                <Error errorName={errors.fontFamily} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("Published")} />
              <div className="col-span-8 sm:col-span-4">
                <SwitchToggle
                  handleProcess={setPublished}
                  processOption={published}
                />
                <Error errorName={errors.productType} />
              </div>
            </div>
          </div>
        </Scrollbars>

        <DrawerButton id={id} title="Coupon" isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default CouponDrawer;
