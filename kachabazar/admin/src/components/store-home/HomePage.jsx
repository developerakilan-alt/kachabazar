import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSettings } from "react-icons/fi";
import ReactSelect from "react-select";

import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tabs as TabsComponent,
} from "react-tabs";

//internal import
import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import Uploader from "@/components/image-uploader/Uploader";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import TextAreaCom from "@/components/form/others/TextAreaCom";
import SelectProductLimit from "@/components/form/selectOption/SelectProductLimit";
import { Button } from "../ui/button";
import { useTheme } from "@/context/ThemeContext";

const HomePage = ({
  register,
  errors,
  coupons,
  headerLogo,
  setHeaderLogo,
  sliderImage,
  setSliderImage,
  sliderImageTwo,
  setSliderImageTwo,
  sliderImageThree,
  setSliderImageThree,
  sliderImageFour,
  setSliderImageFour,
  sliderImageFive,
  setSliderImageFive,
  placeholderImage,
  setPlaceHolderImage,
  quickSectionImage,
  setQuickSectionImage,
  getYourDailyNeedImageLeft,
  setGetYourDailyNeedImageLeft,
  getYourDailyNeedImageRight,
  setGetYourDailyNeedImageRight,
  footerLogo,
  setFooterLogo,
  paymentImage,
  setPaymentImage,
  isSave,
  isCoupon,
  isSliderFullWidth,
  setIsCoupon,
  setIsSliderFullWidth,
  featuredCategories,
  setFeaturedCategories,
  popularProducts,
  setPopularProducts,
  setQuickDelivery,
  quickDelivery,
  setLatestDiscounted,
  latestDiscounted,
  setDailyNeeds,
  dailyNeeds,
  setFeaturePromo,
  featurePromo,
  customerReviewsEnabled,
  setCustomerReviewsEnabled,
  reviewImage1,
  setReviewImage1,
  reviewImage2,
  setReviewImage2,
  reviewImage3,
  setReviewImage3,
  reviewImage4,
  setReviewImage4,
  reviewImage5,
  setReviewImage5,
  reviewImage6,
  setReviewImage6,
  reviewImage7,
  setReviewImage7,
  reviewImage8,
  setReviewImage8,
  reviewImage9,
  setReviewImage9,
  reviewImage10,
  setReviewImage10,
  setFooterBlock1,
  footerBlock1,
  setFooterBlock2,
  footerBlock2,
  setFooterBlock3,
  footerBlock3,
  setFooterBlock4,
  footerBlock4,
  setFooterSocialLinks,
  footerSocialLinks,
  setFooterPaymentMethod,
  footerPaymentMethod,
  allowPromotionBanner,
  setAllowPromotionBanner,
  isSubmitting,
  setLeftRightArrow,
  leftRightArrow,
  setBottomDots,
  bottomDots,
  setBothSliderOption,
  bothSliderOption,
  getButton1image,
  setGetButton1image,
  getButton2image,
  setGetButton2image,
  setFooterBottomContact,
  footerBottomContact,
  setCategoriesMenuLink,
  categoriesMenuLink,
  setAboutUsMenuLink,
  aboutUsMenuLink,
  setContactUsMenuLink,
  contactUsMenuLink,
  setOffersMenuLink,
  offersMenuLink,
  setFaqMenuLink,
  faqMenuLink,
  setPrivacyPolicyMenuLink,
  privacyPolicyMenuLink,
  setTermsConditionsMenuLink,
  termsConditionsMenuLink,
  couponList,
  setCouponList,
  trustBadges,
  setTrustBadges,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [activeSection, setActiveSection] = useState("section-header");

  const navItems = [
    { id: "section-header", label: t("Header") },
    { id: "section-menu-editor", label: t("MenuEditor") },
    { id: "section-main-slider", label: t("MainSlider") },
    { id: "section-discount-coupon", label: t("DiscountCouponTitle1") },
    { id: "section-promotion-banner", label: t("PromotionBanner") },
    { id: "section-featured-categories", label: t("FeaturedCategories") },
    { id: "section-popular-products", label: t("PopularProductsTitle") },
    { id: "section-quick-delivery", label: t("QuickDeliverySectionTitle") },
    {
      id: "section-latest-discounted",
      label: t("LatestDiscountedProductsTitle"),
    },
    { id: "section-daily-needs", label: t("GetYourDailyNeedsTitle") },
    { id: "section-trust-badges", label: "Trust Badges" },
    { id: "section-customer-reviews", label: "Customer Reviews" },
    { id: "section-feature-promo", label: t("FeaturePromoSectionTitle") },
    { id: "section-footer", label: t("FooterTitle") },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div className="font-sans lg:pr-4 space-y-0">
        <div className="flex flex-col lg:flex-row gap-0 relative">
          {/* ======= Vertical Section Navbar ======= */}
          <nav className="w-full lg:w-xs shrink-0 lg:sticky top-0 self-start overflow-y-auto bg-card rounded-lg border border-border pt-6 mb-6 lg:mb-0 lg:mr-6">
            <ul className="flex flex-col mb-4 lg:mb-6">
              {navItems.map((item) => (
                <li key={item.id} className="px-3 mb-1">
                  <button
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-150 rounded-md ${
                      activeSection === item.id
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ======= All Sections ======= */}
          <div className="flex-1 min-w-0">
            {/*  ====================================================== Header ====================================================== */}
            <div
              id="section-header"
              className={
                activeSection === "section-header" ? "block w-full" : "hidden"
              }
            >
              <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border mb-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground">
                    {t("Header")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("HeaderContacts")}
                  </p>
                </div>
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("HeaderText")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label={t("HeaderText")}
                      name="help_text"
                      type="text"
                      placeholder={t("weAreAvailable")}
                    />
                    <Error errorName={errors.help_text} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("PhoneNumber")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label={t("PhoneNumber")}
                      name="phone_number"
                      type="text"
                      placeholder="+01234560352"
                    />
                    <Error errorName={errors.phone_number} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("HeaderLogo")}
                  </label>
                  <div className="sm:col-span-4">
                    <Uploader
                      imageUrl={headerLogo}
                      setImageUrl={setHeaderLogo}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/*  ================= Menu Editor ======================== */}
            <div
              id="section-menu-editor"
              className={
                activeSection === "section-menu-editor"
                  ? "block w-full"
                  : "hidden"
              }
            >
              <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border  mb-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground">
                    {t("MenuEditor")}
                  </h3>
                </div>
                <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <div className="col-span-4">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                      {t("Categories")}
                    </label>
                    <InputAreaTwo
                      register={register}
                      label={t("Categories")}
                      name="categories"
                      type="text"
                      placeholder={t("Categories")}
                    />
                    <Error errorName={errors.categories} />
                  </div>
                  <div className="col-span-4">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                      {t("AboutUs")}
                    </label>
                    <InputAreaTwo
                      register={register}
                      label={t("AboutUs")}
                      name="about_us"
                      type="text"
                      placeholder={t("AboutUs")}
                    />
                    <Error errorName={errors.about_us} />
                  </div>
                  <div className="col-span-4">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                      {t("ContactUs")}
                    </label>
                    <InputAreaTwo
                      register={register}
                      label={t("ContactUs")}
                      name="contact_us"
                      type="text"
                      placeholder={t("ContactUs")}
                    />
                    <Error errorName={errors.contact_us} />
                  </div>
                  <div className="col-span-4">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                      {t("Offers")}
                    </label>
                    <InputAreaTwo
                      register={register}
                      label={t("Offers")}
                      name="offers"
                      type="text"
                      placeholder={t("Offers")}
                    />
                    <Error errorName={errors.offers} />
                  </div>
                  <div className="col-span-4">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                      {t("FAQ")}
                    </label>
                    <InputAreaTwo
                      register={register}
                      label={t("FAQ")}
                      name="faq"
                      type="text"
                      placeholder={t("FAQ")}
                    />
                    <Error errorName={errors.faq} />
                  </div>
                  <div className="col-span-4">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                      {t("PrivacyPolicy")}
                    </label>
                    <InputAreaTwo
                      register={register}
                      label={t("PrivacyPolicy")}
                      name="privacy_policy"
                      type="text"
                      placeholder={t("PrivacyPolicy")}
                    />
                    <Error errorName={errors.privacy_policy} />
                  </div>
                  <div className="col-span-4">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                      {t("TermsConditions")}
                    </label>
                    <InputAreaTwo
                      register={register}
                      label={t("TermsConditions")}
                      name="term_and_condition"
                      type="text"
                      placeholder={t("TermsConditions")}
                    />
                    <Error errorName={errors.term_and_condition} />
                  </div>
                  <div className="col-span-4">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                      {t("Pages")}
                    </label>
                    <InputAreaTwo
                      register={register}
                      label={t("Pages")}
                      name="pages"
                      type="text"
                      placeholder={t("Pages")}
                    />
                    <Error errorName={errors.pages} />
                  </div>
                  <div className="col-span-4">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                      {t("MyAccount")}
                    </label>
                    <InputAreaTwo
                      register={register}
                      label={t("MyAccount")}
                      name="my_account"
                      type="text"
                      placeholder={t("MyAccount")}
                    />
                    <Error errorName={errors.my_account} />
                  </div>
                  <div className="col-span-4">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                      {t("Login")}
                    </label>
                    <InputAreaTwo
                      register={register}
                      label={t("Login")}
                      name="login"
                      type="text"
                      placeholder={t("Login")}
                    />
                    <Error errorName={errors.login} />
                  </div>
                  <div className="col-span-4">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                      {t("Logout")}
                    </label>
                    <InputAreaTwo
                      register={register}
                      label={t("Logout")}
                      name="logout"
                      type="text"
                      placeholder={t("Logout")}
                    />
                    <Error errorName={errors.logout} />
                  </div>
                  <div className="col-span-4">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                      {t("CheckOut")}
                    </label>
                    <InputAreaTwo
                      register={register}
                      label={t("CheckOut")}
                      name="checkout"
                      type="text"
                      placeholder={t("CheckOut")}
                    />
                    <Error errorName={errors.checkout} />
                  </div>
                </div>

                <div className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <div>
                    <h4 className="font-medium font-serif md:text-base text-sm mb-2 ">
                      {t("Categories")}
                    </h4>

                    <SwitchToggle
                      title={""}
                      handleProcess={setCategoriesMenuLink}
                      processOption={categoriesMenuLink}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium font-serif md:text-base text-sm mb-2 ">
                      {t("AboutUs")}
                    </h4>

                    <SwitchToggle
                      title={""}
                      handleProcess={setAboutUsMenuLink}
                      processOption={aboutUsMenuLink}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium font-serif md:text-base text-sm mb-2 ">
                      {t("ContactUs")}
                    </h4>

                    <SwitchToggle
                      title={""}
                      handleProcess={setContactUsMenuLink}
                      processOption={contactUsMenuLink}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium font-serif md:text-base text-sm mb-2 ">
                      {t("Offers")}
                    </h4>

                    <SwitchToggle
                      title={""}
                      handleProcess={setOffersMenuLink}
                      processOption={offersMenuLink}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium font-serif md:text-base text-sm mb-2 ">
                      {t("FAQ")}
                    </h4>

                    <SwitchToggle
                      title={""}
                      handleProcess={setFaqMenuLink}
                      processOption={faqMenuLink}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium font-serif md:text-base text-sm mb-2 ">
                      {t("PrivacyPolicy")}
                    </h4>

                    <SwitchToggle
                      title={""}
                      handleProcess={setPrivacyPolicyMenuLink}
                      processOption={privacyPolicyMenuLink}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium font-serif md:text-base text-sm mb-2 ">
                      {t("TermsConditions")}
                    </h4>

                    <SwitchToggle
                      title={""}
                      handleProcess={setTermsConditionsMenuLink}
                      processOption={termsConditionsMenuLink}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*  ====================================================== Main Slider ====================================================== */}
          <div
            id="section-main-slider"
            className={
              activeSection === "section-main-slider"
                ? "block w-full"
                : "hidden"
            }
          >
            <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border  mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {t("MainSlider")}
                </h3>
              </div>
              <TabsComponent>
                <Tabs>
                  <TabList>
                    <Tab>{t("Slider")} 1</Tab>
                    <Tab>{t("Slider")} 2</Tab>
                    <Tab>{t("Slider")} 3</Tab>
                    <Tab>{t("Slider")} 4</Tab>
                    <Tab>{t("Slider")} 5</Tab>
                    <Tab>{t("Options")}</Tab>
                  </TabList>

                  <TabPanel className="md:mt-10 mt-3">
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                      <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderImages")}
                      </label>
                      <div className="sm:col-span-4">
                        <Uploader
                          imageUrl={sliderImage}
                          setImageUrl={setSliderImage}
                          targetWidth={950}
                          targetHeight={400}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                      <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1 ">
                        {t("SliderTitle")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          required={true}
                          register={register}
                          label={t("SliderTitle")}
                          name="slider_title"
                          type="text"
                          placeholder={t("SliderTitle")}
                        />
                        <Error errorName={errors.slider_title} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                      <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderDescription")}
                      </label>
                      <div className="sm:col-span-4">
                        <TextAreaCom
                          required={true}
                          register={register}
                          label="Slider Description"
                          name="slider_description"
                          type="text"
                          placeholder="Slider Description"
                        />
                        <Error errorName={errors.slider_description} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                      <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderButtonName")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          required={true}
                          register={register}
                          label={t("SliderButtonName")}
                          name="slider_button_name"
                          type="text"
                          placeholder={t("SliderButtonName")}
                        />
                        <Error errorName={errors.slider_button_name} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                      <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderButtonLink")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          required={true}
                          register={register}
                          label="Slider Button Link"
                          name="slider_button_link"
                          type="text"
                          placeholder="Slider Button Link"
                        />
                        <Error errorName={errors.slider_button_link} />
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderImages")}
                      </label>
                      <div className="sm:col-span-4">
                        <Uploader
                          imageUrl={sliderImageTwo}
                          setImageUrl={setSliderImageTwo}
                          targetWidth={950}
                          targetHeight={400}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderTitle")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Slider Title"
                          name="slider_title_two"
                          type="text"
                          placeholder={t("SliderTitle")}
                        />
                        <Error errorName={errors.slider_title_two} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderDescription")}
                      </label>
                      <div className="sm:col-span-4">
                        <TextAreaCom
                          register={register}
                          label="Slider Description Two"
                          name="slider_description_two"
                          type="text"
                          placeholder={t("SliderDescription")}
                        />
                        <Error errorName={errors.slider_description_two} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderButtonName")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Slider Button Name"
                          name="slider_button_name_two"
                          type="text"
                          placeholder={t("SliderButtonName")}
                        />
                        <Error errorName={errors.slider_button_name_two} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderButtonLink")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Slider Button Link"
                          name="slider_button_link_two"
                          type="text"
                          placeholder={t("SliderButtonLink")}
                        />
                        <Error errorName={errors.slider_button_link_two} />
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderImages")}
                      </label>
                      <div className="sm:col-span-4">
                        <Uploader
                          imageUrl={sliderImageThree}
                          setImageUrl={setSliderImageThree}
                          targetWidth={950}
                          targetHeight={400}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderTitle")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label=" Slider Title"
                          name="slider_title_three"
                          type="text"
                          placeholder={t("SliderTitle")}
                        />
                        <Error errorName={errors.slider_title_three} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderDescription")}
                      </label>
                      <div className="sm:col-span-4">
                        <TextAreaCom
                          register={register}
                          label="Slider Description"
                          name="slider_description_three"
                          type="text"
                          placeholder={t("SliderDescription")}
                        />

                        <Error errorName={errors.slider_description_three} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderButtonName")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Slider Button Name"
                          name="slider_button_name_three"
                          type="text"
                          placeholder={t("SliderButtonName")}
                        />
                        <Error errorName={errors.slider_button_name_three} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderButtonLink")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Slider Button Link"
                          name="slider_button_link_three"
                          type="text"
                          placeholder={t("SliderButtonLink")}
                        />
                        <Error errorName={errors.slider_button_link_three} />
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderImages")}
                      </label>
                      <div className="sm:col-span-4">
                        <Uploader
                          imageUrl={sliderImageFour}
                          setImageUrl={setSliderImageFour}
                          targetWidth={950}
                          targetHeight={400}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderTitle")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label=" Slider Title"
                          name="slider_title_four"
                          type="text"
                          placeholder={t("SliderTitle")}
                        />
                        <Error errorName={errors.slider_title_four} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderDescription")}
                      </label>
                      <div className="sm:col-span-4">
                        <TextAreaCom
                          register={register}
                          label="Slider Description"
                          name="slider_description_four"
                          type="text"
                          placeholder={t("SliderDescription")}
                        />
                        <Error errorName={errors.slider_description_four} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderButtonName")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Slider Button Name"
                          name="slider_button_name_four"
                          type="text"
                          placeholder={t("SliderButtonName")}
                        />
                        <Error errorName={errors.slider_button_name_four} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderButtonLink")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Slider Button Link"
                          name="slider_button_link_four"
                          type="text"
                          placeholder={t("SliderButtonLink")}
                        />
                        <Error errorName={errors.slider_button_link_four} />
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderImages")}
                      </label>
                      <div className="sm:col-span-4">
                        <Uploader
                          imageUrl={sliderImageFive}
                          setImageUrl={setSliderImageFive}
                          targetWidth={950}
                          targetHeight={400}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderTitle")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label=" Slider Title"
                          name="slider_title_five"
                          type="text"
                          placeholder={t("SliderTitle")}
                        />
                        <Error errorName={errors.slider_title_five} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderDescription")}
                      </label>
                      <div className="sm:col-span-4">
                        <TextAreaCom
                          register={register}
                          label="Slider Description"
                          name="slider_description_five"
                          type="text"
                          placeholder={t("SliderDescription")}
                        />
                        <Error errorName={errors.slider_description_five} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderButtonName")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Slider Button Name"
                          name="slider_button_name_five"
                          type="text"
                          placeholder={t("SliderButtonName")}
                        />
                        <Error errorName={errors.slider_button_name_five} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("SliderButtonLink")}
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Slider Button Link"
                          name="slider_button_link_five"
                          type="text"
                          placeholder={t("SliderButtonLink")}
                        />
                        <Error errorName={errors.slider_button_link_five} />
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="grid md:grid-cols-3 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <div>
                        <div className="relative">
                          <h4 className="font-medium md:text-base text-sm mb-2 ">
                            {" "}
                            {t("LeftRighArrows")}
                          </h4>
                        </div>
                        <SwitchToggle
                          title={""}
                          handleProcess={setLeftRightArrow}
                          processOption={leftRightArrow}
                        />
                      </div>
                      <div>
                        <div className="relative">
                          <h4 className="font-medium md:text-base text-sm mb-2 ">
                            {t("BottomDots")}
                          </h4>
                        </div>
                        <SwitchToggle
                          title={""}
                          handleProcess={setBottomDots}
                          processOption={bottomDots}
                        />
                      </div>
                      <div>
                        <div className="relative">
                          <h4 className="font-medium md:text-base text-sm mb-2 ">
                            {t("Both")}
                          </h4>
                        </div>
                        <SwitchToggle
                          title={""}
                          handleProcess={setBothSliderOption}
                          processOption={bothSliderOption}
                        />
                      </div>
                    </div>
                  </TabPanel>
                </Tabs>
              </TabsComponent>
            </div>
          </div>

          {/*  ======================================================Discount Coupon Code Box ====================================================== */}
          <div
            id="section-discount-coupon"
            className={
              activeSection === "section-discount-coupon"
                ? "block w-full"
                : "hidden"
            }
          >
            <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border  mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {t("DiscountCouponTitle1")}
                </h3>
              </div>
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("ShowHide")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setIsCoupon}
                    processOption={isCoupon}
                    name="isCoupon"
                  />
                </div>
              </div>

              <div
                className={`grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 relative transition-2`}
                style={{
                  height: isCoupon ? "auto" : 0,
                  transition: "ease-out 0.4s",

                  visibility: !isCoupon ? "hidden" : "visible",
                  opacity: !isCoupon ? "0" : "1",
                }}
              >
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("HomePageDiscountTitle")}
                </label>
                <div className="sm:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label={t("HomePageDiscountTitle")}
                    name="discount_title"
                    type="text"
                    placeholder={t("HomePageDiscountTitle")}
                  />
                  <Error errorName={errors.phone_number} />
                </div>
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("SuperDiscountActiveCouponCode")}
                </label>
                <div className="sm:col-span-4">
                  <ReactSelect
                    isMulti
                    options={coupons}
                    value={couponList}
                    onChange={(v) => setCouponList(v)}
                    placeholder="Select Coupon"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    theme={(selectTheme) => ({
                      ...selectTheme,
                      colors: {
                        ...selectTheme.colors,
                        primary: theme === "dark" ? "#374151" : "#3b82f6",
                        primary25: theme === "dark" ? "#1f2937" : "#dbeafe",
                        neutral0: theme === "dark" ? "#1f2937" : "#ffffff",
                        neutral80: theme === "dark" ? "#e5e7eb" : "#1f2937",
                      },
                    })}
                  />
                </div>
              </div>

              <div
                style={{
                  height: isCoupon
                    ? "auto"
                    : isSliderFullWidth
                      ? "auto"
                      : isSliderFullWidth
                        ? "auto"
                        : "auto",
                  transition: "all 0.5s",
                  visibility: isCoupon ? "hidden" : "visible",
                  opacity: isCoupon ? "0" : "1",
                }}
              >
                <div>
                  <div className="inline-flex md:text-base text-sm mb-3 text-muted-foreground">
                    <div className="relative">
                      <strong>{t("SliderFullWidth")}</strong>
                    </div>
                  </div>

                  <hr className="mb-4 mt-2" />

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 ">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                      {t("SliderFullWidth")}
                    </label>
                    <div className="sm:col-span-4 ">
                      <SwitchToggle
                        title=""
                        handleProcess={setIsSliderFullWidth}
                        processOption={isSliderFullWidth}
                        name={isSliderFullWidth}
                      />
                    </div>
                  </div>
                </div>

                {!isSliderFullWidth && !isCoupon && (
                  <div>
                    <div className="inline-flex md:text-base text-sm mb-3 text-muted-foreground mt-5 ">
                      <div className="relative">
                        <strong> {t("PlaceHolderImage")} </strong>
                      </div>
                    </div>
                    <hr className="mb-4 mt-2" />

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mt-4 md:mb-6 mb-3 pb-2">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("PlaceHolderImage")}
                      </label>
                      <div className="sm:col-span-4">
                        <Uploader
                          imageUrl={placeholderImage}
                          setImageUrl={setPlaceHolderImage}
                        />
                        <div className="text-xs text-center text-muted-foreground">
                          <em>( {t("ImagesResolution")} )</em>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/*  ====================================================== Promotion Banner ===================================================== */}
          <div
            id="section-promotion-banner"
            className={
              activeSection === "section-promotion-banner"
                ? "block w-full"
                : "hidden"
            }
          >
            <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border  mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {t("PromotionBanner")}
                </h3>
              </div>
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setAllowPromotionBanner}
                    processOption={allowPromotionBanner}
                    name={allowPromotionBanner}
                  />
                </div>
              </div>

              <div
                style={{
                  height: allowPromotionBanner ? "auto" : 0,
                  transition: "all 0.4s",
                  visibility: !allowPromotionBanner ? "hidden" : "visible",
                  opacity: !allowPromotionBanner ? "0" : "1",
                }}
              >
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Title")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="promotion_title"
                      type="text"
                      placeholder={t("Title")}
                    />
                    <Error errorName={errors.promotion_title} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Description")}
                  </label>
                  <div className="sm:col-span-4">
                    <TextAreaCom
                      register={register}
                      label="Promotion Description"
                      name="promotion_description"
                      type="text"
                      placeholder={t("PromotionDescription")}
                    />

                    <Error errorName={errors.promotion_description} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("ButtonName")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Button Name"
                      name="promotion_button_name"
                      type="text"
                      placeholder={t("ButtonName")}
                    />
                    <Error errorName={errors.promotion_button_name} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("ButtonLink")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Button Link "
                      name="promotion_button_link"
                      type="text"
                      placeholder="https://hautecouturejewellery-store.vercel.app/search?category=fruits-vegetable&_id=632aca2b4d87ff2494210be8"
                    />
                    <Error errorName={errors.promotion_button_link} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*  ====================================================== Featured Categories ====================================================== */}
          <div
            id="section-featured-categories"
            className={
              activeSection === "section-featured-categories"
                ? "block w-full"
                : "hidden"
            }
          >
            <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border  mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {t("FeaturedCategories")}
                </h3>
              </div>
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setFeaturedCategories}
                    processOption={featuredCategories}
                    name={featuredCategories}
                  />
                </div>
              </div>

              <div
                style={{
                  height: featuredCategories ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !featuredCategories ? "hidden" : "visible",
                  opacity: !featuredCategories ? "0" : "1",
                }}
              >
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Title")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="feature_title"
                      type="text"
                      placeholder={t("Title")}
                    />
                    <Error errorName={errors.feature_title} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("FeaturedCategories")}
                  </label>
                  <div className="sm:col-span-4">
                    <TextAreaCom
                      register={register}
                      label="Feature Description"
                      name="feature_description"
                      type="text"
                      placeholder={t("FeaturedCategories")}
                    />

                    <Error errorName={errors.feature_description} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("ProductsLimit")}
                  </label>
                  <div className="sm:col-span-4">
                    <SelectProductLimit
                      register={register}
                      required={true}
                      label="Feature Products Limit"
                      name="feature_product_limit"
                    />
                    <Error errorName={errors.feature_product_limit} />
                  </div>
                </div>
              </div>

              {/* <div className="flex flex-row-reverse pb-6">
                  <Button type="submit" className="h-10 px-6">
                    Save
                  </Button>
                </div> */}
            </div>
          </div>

          {/*  ====================================================== Popular Products ====================================================== */}
          <div
            id="section-popular-products"
            className={
              activeSection === "section-popular-products"
                ? "block w-full"
                : "hidden"
            }
          >
            <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border  mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {t("PopularProductsTitle")}
                </h3>
              </div>
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setPopularProducts}
                    processOption={popularProducts}
                    name={popularProducts}
                  />
                </div>
              </div>

              <div
                style={{
                  height: popularProducts ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !popularProducts ? "hidden" : "visible",
                  opacity: !popularProducts ? "0" : "1",
                }}
              >
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Title")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="popular_title"
                      type="text"
                      placeholder={t("Title")}
                    />
                    <Error errorName={errors.popular_title} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Description")}
                  </label>
                  <div className="sm:col-span-4">
                    <TextAreaCom
                      register={register}
                      label="Popular Description"
                      name="popular_description"
                      type="text"
                      placeholder={t("PopularDescription")}
                    />
                    <Error errorName={errors.popular_description} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("ProductsLimit")}
                  </label>
                  <div className="sm:col-span-4">
                    <SelectProductLimit
                      register={register}
                      required={true}
                      label="Popular Products Limit"
                      name="popular_product_limit"
                    />
                    <Error errorName={errors.popular_product_limit} />
                  </div>
                </div>
              </div>

              {/* <div className="flex flex-row-reverse pb-6">
                  <Button type="submit" className="h-10 px-6">
                    Save
                  </Button>
                </div> */}
            </div>
          </div>

          {/*  ====================================================== Quick Delivery Section ====================================================== */}
          <div
            id="section-quick-delivery"
            className={
              activeSection === "section-quick-delivery"
                ? "block w-full"
                : "hidden"
            }
          >
            <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border  mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {t("QuickDeliverySectionTitle")}
                </h3>
              </div>
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title={""}
                    handleProcess={setQuickDelivery}
                    processOption={quickDelivery}
                    name={quickDelivery}
                  />
                </div>
              </div>

              <div
                style={{
                  height: quickDelivery ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !quickDelivery ? "hidden" : "visible",
                  opacity: !quickDelivery ? "0" : "1",
                }}
              >
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("SubTitle")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="quick_delivery_subtitle"
                      type="text"
                      placeholder={t("SubTitle")}
                    />
                    <Error errorName={errors.quick_delivery_subtitle} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Title")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="quick_delivery_title"
                      type="text"
                      placeholder={t("Title")}
                    />
                    <Error errorName={errors.quick_delivery_title} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Description")}
                  </label>
                  <div className="sm:col-span-4">
                    <TextAreaCom
                      register={register}
                      label="Quick Delivery Description"
                      name="quick_delivery_description"
                      type="text"
                      placeholder={t("QuickDeliverySectionTitle")}
                    />
                    <Error errorName={errors.quick_delivery_description} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("ButtonName")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Button Name "
                      name="quick_delivery_button"
                      type="text"
                      placeholder={t("ButtonName")}
                    />
                    <Error errorName={errors.quick_delivery_button} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("ButtonLink")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Button Link"
                      name="quick_delivery_link"
                      type="text"
                      placeholder="https://hautecouturejewellery-store.vercel.app/search?category=fruits-vegetable&_id=632aca2b4d87ff2494210be8"
                    />
                    <Error errorName={errors.quick_delivery_link} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Image")}
                  </label>
                  <div className="sm:col-span-4">
                    <Uploader
                      imageUrl={quickSectionImage}
                      setImageUrl={setQuickSectionImage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*  ====================================================== Latest Discounted Products ====================================================== */}
          <div
            id="section-latest-discounted"
            className={
              activeSection === "section-latest-discounted"
                ? "block w-full"
                : "hidden"
            }
          >
            <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border  mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {t("LatestDiscountedProductsTitle")}
                </h3>
              </div>
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setLatestDiscounted}
                    processOption={latestDiscounted}
                    name={latestDiscounted}
                  />
                </div>
              </div>

              <div
                style={{
                  height: latestDiscounted ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !latestDiscounted ? "hidden" : "visible",
                  opacity: !latestDiscounted ? "0" : "1",
                }}
              >
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Title")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="latest_discount_title"
                      type="text"
                      placeholder={t("Title")}
                    />
                    <Error errorName={errors.latest_discount_title} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Description")}
                  </label>
                  <div className="sm:col-span-4">
                    <TextAreaCom
                      register={register}
                      label="Latest Discount Description"
                      name="latest_discount_description"
                      type="text"
                      placeholder={t("LatestDiscountDescription")}
                    />
                    <Error errorName={errors.latest_discount_description} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("ProductsLimit")}
                  </label>
                  <div className="sm:col-span-4">
                    <SelectProductLimit
                      register={register}
                      required={true}
                      label="Latest Discount Products Limit"
                      name="latest_discount_product_limit"
                    />
                    <Error errorName={errors.latest_discount_product_limit} />
                  </div>
                </div>
              </div>

              {/* <div className="flex flex-row-reverse pb-6">
                  <Button type="submit" className="h-10 px-6">
                    Save
                  </Button>
                </div> */}
            </div>
          </div>

          {/*  ====================================================== Get Your Daily Needs Banner Section ====================================================== */}
          <div
            id="section-daily-needs"
            className={
              activeSection === "section-daily-needs"
                ? "block w-full"
                : "hidden"
            }
          >
            <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border  mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {t("GetYourDailyNeedsTitle")}
                </h3>
              </div>
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title={""}
                    handleProcess={setDailyNeeds}
                    processOption={dailyNeeds}
                    name={dailyNeeds}
                  />
                </div>
              </div>

              <div
                style={{
                  height: dailyNeeds ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !dailyNeeds ? "hidden" : "visible",
                  opacity: !dailyNeeds ? "0" : "1",
                }}
              >
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Title")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="daily_need_title"
                      type="text"
                      placeholder={t("Title")}
                    />
                    <Error errorName={errors.daily_need_title} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Description")}
                  </label>
                  <div className="sm:col-span-4">
                    <TextAreaCom
                      register={register}
                      label="Daily Need Description"
                      name="daily_need_description"
                      type="text"
                      placeholder={t("DailyNeedDescription")}
                    />
                    <Error errorName={errors.daily_need_description} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("ImageLeft")}
                  </label>
                  <div className="sm:col-span-4">
                    <Uploader
                      imageUrl={getYourDailyNeedImageLeft}
                      setImageUrl={setGetYourDailyNeedImageLeft}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("ImageRight")}
                  </label>
                  <div className="sm:col-span-4">
                    <Uploader
                      imageUrl={getYourDailyNeedImageRight}
                      setImageUrl={setGetYourDailyNeedImageRight}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Button1image")}
                  </label>
                  <div className="sm:col-span-4">
                    <Uploader
                      imageUrl={getButton1image}
                      setImageUrl={setGetButton1image}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Button1Link")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Button Link "
                      name="daily_need_app_link"
                      type="text"
                      placeholder="https://hautecouturejewellery-store.vercel.app/search?category=fruits-vegetable&_id=632aca2b4d87ff2494210be8"
                    />
                    <Error errorName={errors.daily_need_app_link} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Button2image")}
                  </label>
                  <div className="sm:col-span-4">
                    <Uploader
                      imageUrl={getButton2image}
                      setImageUrl={setGetButton2image}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Button2Link")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Button Link "
                      name="daily_need_google_link"
                      type="text"
                      placeholder="https://hautecouturejewellery-store.vercel.app/search?category=fruits-vegetable&_id=632aca2b4d87ff2494210be8"
                    />
                    <Error errorName={errors.daily_need_google_link} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*  ====================================================== Trust Badges ====================================================== */}
          <div
            id="section-trust-badges"
            className={
              activeSection === "section-trust-badges"
                ? "block w-full"
                : "hidden"
            }
          >
            <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  Trust Badges
                </h3>
              </div>
              <div className="space-y-6">
                {trustBadges?.map((badge, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-4 relative">
                    <button
                      type="button"
                      onClick={() => setTrustBadges(trustBadges.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-4 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("Title")} {idx + 1}
                      </label>
                      <div className="sm:col-span-4">
                        <input
                          data-slot="input"
                          className="flex h-11 w-full rounded-lg border bg-muted px-4 py-3 text-sm text-foreground transition-all duration-200 outline-none placeholder:text-muted-foreground placeholder:text-sm focus:bg-background focus:border-primary focus:ring-0.5 focus:ring-primary/20 hover:border-border border-border"
                          type="text"
                          value={badge.title}
                          onChange={(e) => {
                            const next = [...trustBadges];
                            next[idx] = { ...next[idx], title: e.target.value };
                            setTrustBadges(next);
                          }}
                          placeholder={t("Title")}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-4 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                        {t("Description")} {idx + 1}
                      </label>
                      <div className="sm:col-span-4">
                        <textarea
                          data-slot="textarea"
                          className="flex h-20 w-full rounded-lg border bg-muted px-4 py-3 text-sm text-foreground transition-all duration-200 outline-none placeholder:text-muted-foreground placeholder:text-sm focus:bg-background focus:border-primary focus:ring-0.5 focus:ring-primary/20 hover:border-border border-border resize-none"
                          value={badge.description}
                          onChange={(e) => {
                            const next = [...trustBadges];
                            next[idx] = { ...next[idx], description: e.target.value };
                            setTrustBadges(next);
                          }}
                          placeholder={t("Description")}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setTrustBadges([...trustBadges, { title: "", description: "" }])
                  }
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  + Add Trust Badge
                </button>
              </div>
            </div>
          </div>

          {/*  ====================================================== Customer Reviews Section ====================================================== */}
          <div
            id="section-customer-reviews"
            className={
              activeSection === "section-customer-reviews"
                ? "block w-full"
                : "hidden"
            }
          >
            <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  Customer Reviews
                </h3>
              </div>
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setCustomerReviewsEnabled}
                    processOption={customerReviewsEnabled}
                    name={customerReviewsEnabled}
                  />
                </div>
              </div>

              <div
                style={{
                  height: customerReviewsEnabled ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !customerReviewsEnabled ? "hidden" : "visible",
                  opacity: !customerReviewsEnabled ? "0" : "1",
                }}
              >
                <p className="text-sm text-muted-foreground mb-6">
                  Upload up to 10 customer review images (screenshots of reviews, testimonials, etc.)
                </p>
                <TabsComponent>
                  <Tabs>
                    <TabList>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <Tab key={n}>Review {n}</Tab>
                      ))}
                    </TabList>

                    {[
                      { image: reviewImage1, setter: setReviewImage1 },
                      { image: reviewImage2, setter: setReviewImage2 },
                      { image: reviewImage3, setter: setReviewImage3 },
                      { image: reviewImage4, setter: setReviewImage4 },
                      { image: reviewImage5, setter: setReviewImage5 },
                      { image: reviewImage6, setter: setReviewImage6 },
                      { image: reviewImage7, setter: setReviewImage7 },
                      { image: reviewImage8, setter: setReviewImage8 },
                      { image: reviewImage9, setter: setReviewImage9 },
                      { image: reviewImage10, setter: setReviewImage10 },
                    ].map((slide, i) => (
                      <TabPanel key={i} className="md:mt-10 mt-3">
                        <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                          <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                            Review Image {i + 1}
                          </label>
                          <div className="sm:col-span-4">
                            <Uploader
                              imageUrl={slide.image}
                              setImageUrl={slide.setter}
                              targetWidth={600}
                              targetHeight={800}
                            />
                          </div>
                        </div>
                      </TabPanel>
                    ))}
                  </Tabs>
                </TabsComponent>
              </div>
            </div>
          </div>

          {/*  ====================================================== Feature Promo Section ====================================================== */}
          <div
            id="section-feature-promo"
            className={
              activeSection === "section-feature-promo"
                ? "block w-full"
                : "hidden"
            }
          >
            <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border  mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {t("FeaturePromoSectionTitle")}
                </h3>
              </div>
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setFeaturePromo}
                    processOption={featurePromo}
                    name={featurePromo}
                  />
                </div>
              </div>

              <div
                style={{
                  height: featurePromo ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !featurePromo ? "hidden" : "visible",
                  opacity: !featurePromo ? "0" : "1",
                }}
              >
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("FreeShipping")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="promo_free_shipping"
                      type="text"
                      placeholder="From $500.00"
                    />
                    <Error errorName={errors.promo_free_shipping} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Support")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="promo_support"
                      type="text"
                      placeholder="24/7 At Anytime"
                    />
                    <Error errorName={errors.promo_support} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("SecurePayment")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="promo_payment"
                      type="text"
                      placeholder={t("SecurePayment")}
                    />
                    <Error errorName={errors.promo_payment} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("LatestOffer")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="promo_offer"
                      type="text"
                      placeholder="Upto 20% Off"
                    />
                    <Error errorName={errors.promo_offer} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end flex-1 min-w-0 */}
          {/*  ====================================================== Footer Section ====================================================== */}
          <div
            id="section-footer"
            className={
              activeSection === "section-footer" ? "block w-full" : "hidden"
            }
          >
            <div className="flex-1 py-6 px-8 bg-card rounded-lg border border-border  mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {t("FooterTitle")}
                </h3>
              </div>
              <div className="inline-flex md:text-base text-sm mb-3 text-muted-foreground relative">
                <strong>{t("Block")} 1</strong>
              </div>
              <hr className="md:mb-12 mb-3" />
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setFooterBlock1}
                    processOption={footerBlock1}
                    name={footerBlock1}
                  />
                </div>
              </div>

              <div
                style={{
                  height: footerBlock1 ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !footerBlock1 ? "hidden" : "visible",
                  opacity: !footerBlock1 ? "0" : "1",
                }}
              >
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Title")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_one_title"
                      type="text"
                      placeholder="Company"
                    />
                    <Error errorName={errors.footer_block_one_title} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Link")} 1
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_one_link_one_title"
                      type="text"
                      placeholder={t("AboutUs")}
                    />
                    <Error errorName={errors.footer_block_one_link_one_title} />
                  </div>
                  <label className="md:col-span-1 sm:col-span-2"></label>
                  <div className="sm:col-span-4 mb-5">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_one_link_one"
                      type="text"
                      placeholder={t("Link")}
                    />
                    <Error errorName={errors.footer_block_one_link_one} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Link")} 2
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_one_link_two_title"
                      type="text"
                      placeholder={t("ContactUs")}
                    />
                    <Error errorName={errors.footer_block_one_link_two_title} />
                  </div>
                  <label className="md:col-span-1 sm:col-span-2"></label>
                  <div className="sm:col-span-4  mb-5">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_one_link_two"
                      type="text"
                      placeholder={t("Link")}
                    />
                    <Error errorName={errors.footer_block_one_link_two} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Link")} 3
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_one_link_three_title"
                      type="text"
                      placeholder={t("Careers")}
                    />
                    <Error
                      errorName={errors.footer_block_one_link_three_title}
                    />
                  </div>
                  <label className="md:col-span-1 sm:col-span-2"></label>
                  <div className="sm:col-span-4  mb-5">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_one_link_three"
                      type="text"
                      placeholder={t("Link")}
                    />
                    <Error errorName={errors.footer_block_one_link_three} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Link")} 4
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_one_link_four_title"
                      type="text"
                      placeholder={t("LatestNews")}
                    />
                    <Error
                      errorName={errors.footer_block_one_link_four_title}
                    />
                  </div>
                  <label className="md:col-span-1 sm:col-span-2"></label>
                  <div className="sm:col-span-4 mb-5">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_one_link_four"
                      type="text"
                      placeholder={t("Link")}
                    />
                    <Error errorName={errors.footer_block_one_link_four} />
                  </div>
                </div>
              </div>

              <div className="inline-flex md:text-base text-sm mb-3 text-muted-foreground relative md:mt-0 mt-24">
                <strong>{t("Block")} 2</strong>
              </div>
              <hr className="md:mb-12 mb-3" />
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setFooterBlock2}
                    processOption={footerBlock2}
                    name={footerBlock2}
                  />
                </div>
              </div>

              <div
                style={{
                  height: footerBlock2 ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !footerBlock2 ? "hidden" : "visible",
                  opacity: !footerBlock2 ? "0" : "1",
                }}
              >
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Title")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_two_title"
                      type="text"
                      placeholder={t("TopCategory")}
                    />
                    <Error errorName={errors.footer_block_two_title} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Link")} 1
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_two_link_one_title"
                      type="text"
                      placeholder={t("FishAndMeat")}
                    />
                    <Error errorName={errors.footer_block_two_link_one_title} />
                  </div>
                  <label className="md:col-span-1 sm:col-span-2"></label>
                  <div className="sm:col-span-4  mb-5">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_two_link_one"
                      type="text"
                      placeholder={t("Link")}
                    />
                    <Error errorName={errors.footer_block_two_link_one} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Link")} 2
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_two_link_two_title"
                      type="text"
                      placeholder={t("SoftDrinks")}
                    />
                    <Error errorName={errors.footer_block_two_link_two_title} />
                  </div>
                  <label className="md:col-span-1 sm:col-span-2"></label>
                  <div className="sm:col-span-4  mb-5">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_two_link_two"
                      type="text"
                      placeholder={t("Link")}
                    />
                    <Error errorName={errors.footer_block_two_link_two} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Link")} 3
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_two_link_three_title"
                      type="text"
                      placeholder={t("BabyCare")}
                    />
                    <Error
                      errorName={errors.footer_block_two_link_three_title}
                    />
                  </div>
                  <label className="md:col-span-1 sm:col-span-2"></label>
                  <div className="sm:col-span-4  mb-5">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_two_link_three"
                      type="text"
                      placeholder={t("Link")}
                    />
                    <Error errorName={errors.footer_block_two_link_three} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Link")} 4
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_two_link_four_title"
                      type="text"
                      placeholder={t("BeautyAndHealth")}
                    />
                    <Error
                      errorName={errors.footer_block_two_link_four_title}
                    />
                  </div>
                  <label className="md:col-span-1 sm:col-span-2"></label>
                  <div className="sm:col-span-4  mb-5">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_two_link_four"
                      type="text"
                      placeholder={t("Link")}
                    />
                    <Error errorName={errors.footer_block_two_link_four} />
                  </div>
                </div>
              </div>

              <div className="inline-flex md:text-base text-sm mb-3 text-muted-foreground relative md:mt-0 mt-24">
                <strong>{t("Block")} 3</strong>
              </div>
              <hr className="md:mb-12 mb-3" />
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setFooterBlock3}
                    processOption={footerBlock3}
                    name={footerBlock3}
                  />
                </div>
              </div>

              <div
                style={{
                  height: footerBlock3 ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !footerBlock3 ? "hidden" : "visible",
                  opacity: !footerBlock3 ? "0" : "1",
                }}
              >
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Title")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_three_title"
                      type="text"
                      placeholder="My Account"
                    />
                    <Error errorName={errors.footer_block_three_title} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Link")} 1
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_three_link_one_title"
                      type="text"
                      placeholder={t("Dashboard")}
                    />
                    <Error
                      errorName={errors.footer_block_three_link_one_title}
                    />
                  </div>
                  <label className="md:col-span-1 sm:col-span-2"></label>
                  <div className="sm:col-span-4  mb-5">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_three_link_one"
                      type="text"
                      placeholder={t("Link")}
                    />
                    <Error errorName={errors.footer_block_three_link_one} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Link")} 2
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_three_link_two_title"
                      type="text"
                      placeholder={t("MyOrders")}
                    />
                    <Error
                      errorName={errors.footer_block_three_link_two_title}
                    />
                  </div>
                  <label className="md:col-span-1 sm:col-span-2"></label>
                  <div className="sm:col-span-4  mb-5">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_three_link_two"
                      type="text"
                      placeholder={t("Link")}
                    />
                    <Error errorName={errors.footer_block_three_link_two} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Link")} 3
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_three_link_three_title"
                      type="text"
                      placeholder="Recent Orders"
                    />
                    <Error
                      errorName={errors.footer_block_three_link_three_title}
                    />
                  </div>
                  <label className="md:col-span-1 sm:col-span-2"></label>
                  <div className="sm:col-span-4  mb-5">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_three_link_three"
                      type="text"
                      placeholder={t("Link")}
                    />
                    <Error errorName={errors.footer_block_three_link_three} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("Link")} 4
                  </label>

                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_three_link_four_title"
                      type="text"
                      placeholder="Updated Profile"
                    />
                    <Error
                      errorName={errors.footer_block_three_link_four_title}
                    />
                  </div>
                  <label className="md:col-span-1 sm:col-span-2"></label>
                  <div className="sm:col-span-4  mb-5">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_three_link_four"
                      type="text"
                      placeholder={t("Link")}
                    />
                    <Error errorName={errors.footer_block_three_link_four} />
                  </div>
                </div>
              </div>

              <div className="inline-flex md:text-base text-sm mb-3 text-muted-foreground relative md:mt-0 mt-24">
                <strong>{t("Block")} 4</strong>
              </div>

              <hr className="md:mb-12 mb-3" />

              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setFooterBlock4}
                    processOption={footerBlock4}
                    name={footerBlock4}
                  />
                </div>
              </div>

              <div
                style={{
                  height: footerBlock4 ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !footerBlock4 ? "hidden" : "visible",
                  opacity: !footerBlock4 ? "0" : "1",
                }}
              >
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("FooterLogo")}
                  </label>
                  <div className="sm:col-span-4">
                    <Uploader
                      imageUrl={footerLogo}
                      setImageUrl={setFooterLogo}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("FooterAddress")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_four_address"
                      type="text"
                      placeholder="Address"
                    />
                    <Error errorName={errors.footer_block_four_address} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("FooterPhone")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_four_phone"
                      type="text"
                      placeholder={t("Phone")}
                    />
                    <Error errorName={errors.footer_block_four_phone} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("FooterEmail")}
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="footer_block_four_email"
                      type="text"
                      placeholder="Email"
                    />
                    <Error errorName={errors.footer_block_four_email} />
                  </div>
                </div>
              </div>

              <div className="inline-flex md:text-base text-sm mb-3 text-muted-foreground relative mt-24 md:mt-0">
                <strong>{t("SocialLinks")}</strong>
              </div>
              <hr className="md:mb-12 mb-3" />
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setFooterSocialLinks}
                    processOption={footerSocialLinks}
                    name={footerSocialLinks}
                  />
                </div>
              </div>

              <div
                style={{
                  height: footerSocialLinks ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !footerSocialLinks ? "hidden" : "visible",
                  opacity: !footerSocialLinks ? "0" : "1",
                }}
              >
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    Facebook
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="social_facebook"
                      type="text"
                      placeholder="Facebook link"
                    />
                    <Error errorName={errors.social_facebook} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    Twitter
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="social_twitter"
                      type="text"
                      placeholder="Twitter Link"
                    />
                    <Error errorName={errors.social_twitter} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    Pinterest
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="social_pinterest"
                      type="text"
                      placeholder="Pinterest Link"
                    />
                    <Error errorName={errors.social_pinterest} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    Linkedin
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="social_linkedin"
                      type="text"
                      placeholder="Linkedin Link"
                    />
                    <Error errorName={errors.social_linkedin} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    WhatsApp
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="social_whatsapp"
                      type="text"
                      placeholder="whatsApp Link"
                    />
                    <Error errorName={errors.social_whatsapp} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    Instagram
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="social_instagram"
                      type="text"
                      placeholder="Instagram Link"
                    />
                    <Error errorName={errors.social_instagram} />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    YouTube
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Title"
                      name="social_youtube"
                      type="text"
                      placeholder="YouTube Link"
                    />
                    <Error errorName={errors.social_youtube} />
                  </div>
                </div>
              </div>

              <div className="inline-flex md:text-base text-sm mb-3 text-muted-foreground relative mt-24 md:mt-0">
                <strong>{t("PaymentMethod")}</strong>
              </div>
              <hr className="md:mb-12 mb-3" />
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setFooterPaymentMethod}
                    processOption={footerPaymentMethod}
                    name={footerPaymentMethod}
                  />
                </div>
              </div>

              <div
                style={{
                  height: footerPaymentMethod ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !footerPaymentMethod ? "hidden" : "visible",
                  opacity: !footerPaymentMethod ? "0" : "1",
                }}
              >
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    {t("PaymentMethod")}
                  </label>
                  <div className="sm:col-span-4">
                    <Uploader
                      imageUrl={paymentImage}
                      setImageUrl={setPaymentImage}
                    />
                  </div>
                </div>
              </div>

              {/* <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                    Visibility
                  </label>
                  <div className="sm:col-span-4">
                    <SwitchToggle
                      title={""}
                      // handleProcess={setSliderFullWidth}
                      // processOption={}
                    />
                  </div>
                </div> */}

              <div className="inline-flex md:text-base text-sm mb-3 text-muted-foreground relative mt-16 md:mt-0">
                <strong>{t("FooterBottomContact")}</strong>
              </div>

              <hr className="md:mb-12 mb-3" />

              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("EnableThisBlock")}
                </label>
                <div className="sm:col-span-4">
                  <SwitchToggle
                    title=""
                    handleProcess={setFooterBottomContact}
                    processOption={footerBottomContact}
                    name={footerBottomContact}
                  />
                </div>
              </div>

              <div
                style={{
                  height: footerBottomContact ? "auto" : 0,
                  transition: "all 0.5s",
                  visibility: !footerBottomContact ? "hidden" : "visible",
                  opacity: !footerBottomContact ? "0" : "1",
                }}
                className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3"
              >
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                  {t("FooterBottomContact")}
                </label>
                <div className="sm:col-span-4 mb-20 md:mb-0">
                  <InputAreaTwo
                    register={register}
                    label="Title"
                    name="footer_Bottom_Contact"
                    type="text"
                    placeholder={t("FooterBottomContact")}
                  />
                  <Error errorName={errors.footer_Bottom_Contact} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end flex gap-0 nav wrapper */}
      </div>
    </>
  );
};

export default HomePage;
