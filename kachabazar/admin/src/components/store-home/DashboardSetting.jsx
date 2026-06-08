import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";

const fieldRow = "grid md:grid-cols-2 sm:grid-cols-2 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3";
const labelClass = "block md:text-sm text-xs font-semibold text-muted-foreground mb-1";

const DashboardSetting = ({ isSave, errors, register, isSubmitting }) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("section-dashboard");

  const navItems = [
    { id: "section-dashboard",      label: t("Dashboard") },
    { id: "section-update-profile", label: t("UpdateProfile") },
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

          {/* Dashboard */}
          <div className={activeSection === "section-dashboard" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("Dashboard")}</h3>
              </div>

              <div className={fieldRow}>
                {[
                  { label: "InvoiceMessage1st", name: "invoice_message_first" },
                  { label: "InvoiceMessage2nd", name: "invoice_message_last" },
                  { label: "PrintButton",       name: "print_button" },
                  { label: "DownloadButton",    name: "download_button" },
                  { label: "Dashboard",         name: "dashboard_title" },
                  { label: "TotalOrder",        name: "total_order" },
                  { label: "PendingOrder",      name: "pending_order" },
                  { label: "ProcessingOrder",   name: "processing_order" },
                  { label: "CompleteOrder",     name: "complete_order" },
                  { label: "RecentOrder",       name: "recent_order" },
                  { label: "MyOrder",           name: "my_order" },
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

          {/* Update Profile */}
          <div className={activeSection === "section-update-profile" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("UpdateProfile")}</h3>
              </div>
              
              <div className="mb-6">
                <label className={labelClass}>{t("UpdateProfile")}</label>
                <InputAreaTwo register={register} label={t("UpdateProfile")} name="update_profile" type="text" placeholder={t("UpdateProfile")} />
                <Error errorName={errors.update_profile} />
              </div>

              <div className={fieldRow}>
                {[
                  { label: "FullName",        name: "full_name" },
                  { label: "UserAddress",     name: "address" },
                  { label: "PhoneMobile",     name: "user_phone" },
                  { label: "EmailAddress",    name: "user_email" },
                  { label: "UpdateButton",    name: "update_button" },
                  { label: "CurrentPassword", name: "current_password" },
                  { label: "NewPassword",     name: "new_password" },
                  { label: "ChangePassword",  name: "change_password" },
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

export default DashboardSetting;
