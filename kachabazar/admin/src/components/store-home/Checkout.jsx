import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";

const fieldRow = "grid md:grid-cols-2 sm:grid-cols-2 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3";
const labelClass = "block md:text-sm text-xs font-semibold text-muted-foreground mb-1";

const Checkout = ({ isSave, errors, register, isSubmitting }) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("section-personal-info");

  const navItems = [
    { id: "section-personal-info", label: t("PersonalInfo") },
    { id: "section-shipping-info", label: t("ShippingInfo") },
    { id: "section-cart-items",    label: t("CartItemSection") },
  ];

  return (
    <div className="font-sans lg:pr-4 space-y-0">
      <div className="flex flex-col lg:flex-row gap-0 relative">

        {/* ── Sidebar Nav ── */}
        <nav className="w-full lg:w-xs shrink-0 lg:sticky top-0 self-start overflow-y-auto bg-card rounded-lg border border-border pt-6 mb-6 lg:mb-0 lg:mr-6">
          <ul className="flex flex-col mb-4 lg:mb-6">
            {navItems.map((item) => (
              <li key={item.id} className="px-3 mb-1">
                <button
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-150 rounded-md ${
                    activeSection === item.id
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0">

          {/* Personal Info */}
          <div className={activeSection === "section-personal-info" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("PersonalInfo")}</h3>
              </div>
              <div className="mb-6">
                <label className={labelClass}>{t("PersonalInfo")}</label>
                <InputAreaTwo register={register} label={t("PersonalInfo")} name="personal_details" type="text" placeholder={t("PersonalInfo")} />
                <Error errorName={errors.personal_details} />
              </div>

              <div className={fieldRow}>
                {[
                  { label: "firstName",      name: "first_name" }, // Intentionally keeping the double first_name from original code
                  { label: "firstName",      name: "first_name" },
                  { label: "lastName",       name: "last_name" },
                  { label: "emailAddress",   name: "email_address" },
                  { label: "Phone",          name: "checkout_phone" },
                ].map(({ label, name }, i) => (
                  <div key={i}>
                    <label className={labelClass}>{t(label)}</label>
                    <InputAreaTwo register={register} label={t(label)} name={name} type="text" placeholder={t(label)} />
                    <Error errorName={errors[name]} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className={activeSection === "section-shipping-info" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("ShippingInfo")}</h3>
              </div>
              <div className="mb-6">
                <label className={labelClass}>{t("ShippingInfo")}</label>
                <InputAreaTwo register={register} label={t("ShippingInfo")} name="shipping_details" type="text" placeholder={t("ShippingInfo")} />
                <Error errorName={errors.shipping_details} />
              </div>

              <div className={fieldRow}>
                {[
                  { label: "streetAddress",   name: "street_address" },
                  { label: "City",            name: "city" },
                  { label: "Country",         name: "country" },
                  { label: "ZipCode",         name: "zip_code" },
                  { label: "Shippingcost",    name: "shipping_cost" },
                  { label: "ShippingNameOne", name: "shipping_name_one" },
                  { label: "ShippingOneDes",  name: "shipping_one_desc" },
                  { label: "ShippingOneCost", name: "shipping_one_cost" },
                  { label: "ShippingNameTwo", name: "shipping_name_two" },
                  { label: "ShippingTwoDes",  name: "shipping_two_desc" },
                  { label: "ShippingTwoCost", name: "shipping_two_cost" },
                  { label: "PaymentMethod",   name: "payment_method" },
                  { label: "ContinueButton",  name: "continue_button" },
                  { label: "ConfirmButton",   name: "confirm_button" },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <label className={labelClass}>{t(label)}</label>
                    <InputAreaTwo register={register} label={t(label)} name={name} type="text" placeholder={t(label)} />
                    <Error errorName={errors[name]} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Item Section */}
          <div className={activeSection === "section-cart-items" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("CartItemSection")}</h3>
              </div>
              <div className={fieldRow}>
                {[
                  { label: "OrderSummary",  name: "order_summary" },
                  { label: "ApplyButton",   name: "apply_button" },
                  { label: "Subtotal",      name: "sub_total" },
                  { label: "DiscountLower", name: "discount" },
                  { label: "TotalCost",     name: "total_cost" },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <label className={labelClass}>{t(label)}</label>
                    <InputAreaTwo register={register} label={t(label)} name={name} type="text" placeholder={t(label)} />
                    <Error errorName={errors[name]} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Update button */}
          <div className="flex justify-center pb-8">
            {isSubmitting ? (
              <Button disabled={true} type="button" className="h-12 px-10 rounded-lg text-base w-64">
                <img src={spinnerLoadingImage} alt="Loading" width={20} height={10} />{" "}
                <span className="font-serif ml-2 font-light">{t("Processing")}</span>
              </Button>
            ) : (
              <Button type="submit" className="h-12 px-10 rounded-lg text-base w-64">
                {isSave ? t("SaveBtn") : t("UpdateBtn")}
              </Button>
            )}
          </div>

        </div>{/* end flex-1 */}
      </div>
    </div>
  );
};

export default Checkout;
