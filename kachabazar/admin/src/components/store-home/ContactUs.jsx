import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import TextAreaCom from "@/components/form/others/TextAreaCom";
import Uploader from "@/components/image-uploader/Uploader";

const fieldRow = "grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3";
const labelClass = "block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground md:mb-1";

const ContactUs = ({
  isSave,
  errors,
  register,
  setContactPageHeader,
  contactPageHeader,
  setContactHeaderBg,
  contactHeaderBg,
  setEmailUsBox,
  emailUsBox,
  setCallUsBox,
  callUsBox,
  setAddressBox,
  addressBox,
  setContactMidLeftColStatus,
  contactMidLeftColStatus,
  setContactMidLeftColImage,
  contactMidLeftColImage,
  setContactFormStatus,
  contactFormStatus,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("section-page-header");

  const navItems = [
    { id: "section-page-header",   label: t("PageHeader") },
    { id: "section-email-us",      label: t("EmailUs") },
    { id: "section-call-us",       label: t("CallUs") },
    { id: "section-address",       label: t("Address") },
    { id: "section-mid-left-col",  label: t("MidLeftCol") },
    { id: "section-contact-form",  label: t("ContactForm") },
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

          {/* Page Header */}
          <div className={activeSection === "section-page-header" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("PageHeader")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setContactPageHeader} processOption={contactPageHeader} name={contactPageHeader} />
                </div>
              </div>
              <div style={{ height: contactPageHeader ? "auto" : 0, overflow: "hidden", transition: "all 0.5s", visibility: !contactPageHeader ? "hidden" : "visible", opacity: !contactPageHeader ? "0" : "1" }}>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("PageHeaderBg")}</label>
                  <div className="sm:col-span-4">
                    <Uploader imageUrl={contactHeaderBg} setImageUrl={setContactHeaderBg} />
                  </div>
                </div>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("PageTitle")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Page Title" name="contact_page_title" type="text" placeholder={t("PageTitle")} />
                    <Error errorName={errors.contact_page_title} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Us */}
          <div className={activeSection === "section-email-us" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("EmailUs")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setEmailUsBox} processOption={emailUsBox} name={emailUsBox} />
                </div>
              </div>
              <div style={{ height: emailUsBox ? "auto" : 0, overflow: "hidden", transition: "all 0.5s", visibility: !emailUsBox ? "hidden" : "visible", opacity: !emailUsBox ? "0" : "1" }}>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("EboxTitle")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Title" name="email_box_title" type="text" placeholder={t("EboxTitle")} />
                    <Error errorName={errors.email_box_title} />
                  </div>
                </div>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("EboxEmail")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Email" name="email_box_email" type="text" placeholder={t("EboxEmail")} />
                    <Error errorName={errors.email_box_email} />
                  </div>
                </div>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("Eboxtext")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Text" name="email_box_text" type="text" placeholder={t("Eboxtext")} />
                    <Error errorName={errors.email_box_text} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call Us */}
          <div className={activeSection === "section-call-us" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("CallUs")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setCallUsBox} processOption={callUsBox} name={callUsBox} />
                </div>
              </div>
              <div style={{ height: callUsBox ? "auto" : 0, overflow: "hidden", transition: "all 0.5s", visibility: !callUsBox ? "hidden" : "visible", opacity: !callUsBox ? "0" : "1" }}>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("CallusboxTitle")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Title" name="callUs_box_title" type="text" placeholder={t("CallusboxTitle")} />
                    <Error errorName={errors.callUs_box_title} />
                  </div>
                </div>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("CallUsboxPhone")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Phone" name="callUs_box_phone" type="text" placeholder={t("CallUsboxPhone")} />
                    <Error errorName={errors.callUs_box_phone} />
                  </div>
                </div>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("CallUsboxText")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Text" name="callUs_box_text" type="text" placeholder={t("CallUsboxText")} />
                    <Error errorName={errors.callUs_box_text} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className={activeSection === "section-address" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("Address")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setAddressBox} processOption={addressBox} name={addressBox} />
                </div>
              </div>
              <div style={{ height: addressBox ? "auto" : 0, overflow: "hidden", transition: "all 0.5s", visibility: !addressBox ? "hidden" : "visible", opacity: !addressBox ? "0" : "1" }}>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("AddressboxTitle")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Title" name="address_box_title" type="text" placeholder={t("AddressboxTitle")} />
                    <Error errorName={errors.address_box_title} />
                  </div>
                </div>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("AddressboxAddressOne")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Address" name="address_box_address_one" type="text" placeholder={t("AddressboxAddressOne")} />
                    <Error errorName={errors.address_box_address_one} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mid Left Col */}
          <div className={activeSection === "section-mid-left-col" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("MidLeftCol")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setContactMidLeftColStatus} processOption={contactMidLeftColStatus} name={contactMidLeftColStatus} />
                </div>
              </div>
              <div style={{ height: contactMidLeftColStatus ? "auto" : 0, overflow: "hidden", transition: "all 0.5s", visibility: !contactMidLeftColStatus ? "hidden" : "visible", opacity: !contactMidLeftColStatus ? "0" : "1" }}>
                <div className={`${fieldRow} relative`}>
                  <label className={labelClass}>{t("MidLeftImage")}</label>
                  <div className="sm:col-span-4">
                    <Uploader imageUrl={contactMidLeftColImage} setImageUrl={setContactMidLeftColImage} targetWidth={874} targetHeight={877} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={activeSection === "section-contact-form" ? "block w-full" : "hidden"}>
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t("ContactForm")}</h3>
              </div>
              <div className={fieldRow}>
                <label className={labelClass}>{t("EnableThisBlock")}</label>
                <div className="sm:col-span-4">
                  <SwitchToggle title="" handleProcess={setContactFormStatus} processOption={contactFormStatus} name={contactFormStatus} />
                </div>
              </div>
              <div style={{ height: contactFormStatus ? "auto" : 0, overflow: "hidden", transition: "all 0.5s", visibility: !contactFormStatus ? "hidden" : "visible", opacity: !contactFormStatus ? "0" : "1" }}>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("ContactFormTitle")}</label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo register={register} label="Title" name="contact_form_title" type="text" placeholder={t("ContactFormTitle")} />
                    <Error errorName={errors.contact_form_title} />
                  </div>
                </div>
                <div className={fieldRow}>
                  <label className={labelClass}>{t("ContactFormDescription")}</label>
                  <div className="sm:col-span-4">
                    <TextAreaCom register={register} label="Description" name="contact_form_description" type="text" placeholder={t("ContactFormDescription")} />
                    <Error errorName={errors.contact_form_description} />
                  </div>
                </div>
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

export default ContactUs;
