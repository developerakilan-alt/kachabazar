import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import Uploader from "@/components/image-uploader/Uploader";
import TextAreaCom from "@/components/form/others/TextAreaCom";

const fieldRow =
  "grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3";
const labelClass =
  "block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground md:mb-1";

const SeoSetting = ({
  errors,
  register,
  isSave,
  favicon,
  setFavicon,
  metaImg,
  setMetaImg,
  ogImg,
  setOgImg,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("section-seo-settings");

  const navItems = [{ id: "section-seo-settings", label: t("SeoSetting") }];

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
          {/* SEO Settings */}
          <div
            className={
              activeSection === "section-seo-settings"
                ? "block w-full"
                : "hidden"
            }
          >
            <div className="bg-card rounded-lg border border-border py-6 px-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {t("SeoSetting")}
                </h3>
              </div>

              <div className={`${fieldRow} items-center relative`}>
                <label className={labelClass}>{t("Favicon")}</label>
                <div className="sm:col-span-4">
                  <Uploader imageUrl={favicon} setImageUrl={setFavicon} />
                </div>
              </div>

              <div className={`${fieldRow} items-center relative`}>
                <label className={labelClass}>{t("MetaTitle")}</label>
                <div className="sm:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label={t("MetaTitle")}
                    name="meta_title"
                    type="text"
                    placeholder={t("MetaTitle")}
                  />
                  <Error errorName={errors.meta_title} />
                </div>
              </div>

              <div className={`${fieldRow} items-center relative`}>
                <label className={labelClass}>{t("MetaDescription")}</label>
                <div className="sm:col-span-4">
                  <TextAreaCom
                    required={true}
                    register={register}
                    label={t("MetaDescription")}
                    name="meta_description"
                    type="text"
                    placeholder={t("MetaDescription")}
                  />
                  <Error errorName={errors.meta_description} />
                </div>
              </div>

              <div className={`${fieldRow} items-center relative`}>
                <label className={labelClass}>{t("MetaUrl")}</label>
                <div className="sm:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label={t("MetaUrl")}
                    name="meta_url"
                    type="text"
                    placeholder={t("MetaUrl")}
                  />
                  <Error errorName={errors.meta_url} />
                </div>
              </div>

              <div className={`${fieldRow} items-center relative`}>
                <label className={labelClass}>{t("MetaKeyword")}</label>
                <div className="sm:col-span-4">
                  <TextAreaCom
                    register={register}
                    label={t("MetaKeyword")}
                    name="meta_keywords"
                    type="text"
                    placeholder={t("MetaKeyword")}
                  />
                  <Error errorName={errors.meta_keywords} />
                </div>
              </div>

              <div className={`${fieldRow} items-center relative`}>
                <label className={labelClass}>{t("MetaImage")}</label>
                <div className="sm:col-span-4">
                  <Uploader imageUrl={metaImg} setImageUrl={setMetaImg} />
                </div>
              </div>

              <div className={`${fieldRow} items-center relative`}>
                <label className={labelClass}>OG Image</label>
                <div className="sm:col-span-4">
                  <Uploader imageUrl={ogImg} setImageUrl={setOgImg} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Social sharing image (recommended 1200×630). Used when your
                    site is shared on Facebook, Twitter, etc.
                  </p>
                </div>
              </div>

              <div className={`${fieldRow} items-center relative`}>
                <label className={labelClass}>Twitter Handle</label>
                <div className="sm:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Twitter Handle"
                    name="twitter_handle"
                    type="text"
                    placeholder="@yourstore"
                  />
                </div>
              </div>

              <div className={`${fieldRow} items-center relative`}>
                <label className={labelClass}>Google Verification</label>
                <div className="sm:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Google Site Verification"
                    name="google_verification"
                    type="text"
                    placeholder="Google site verification code"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    From Google Search Console verification meta tag content
                    value
                  </p>
                </div>
              </div>

              <div className={`${fieldRow} items-center relative`}>
                <label className={labelClass}>Robots</label>
                <div className="sm:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Robots"
                    name="robots"
                    type="text"
                    placeholder="index, follow"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Controls search engine crawling. Default: "index, follow"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Update button */}
          <div className="flex justify-center pb-8">
            {isSubmitting ? (
              <Button
                disabled={true}
                type="button"
                className="h-12 px-10 rounded-lg text-base w-64"
              >
                <img
                  src={spinnerLoadingImage}
                  alt="Loading"
                  width={20}
                  height={10}
                />{" "}
                <span className="font-serif ml-2 font-light">
                  {t("Processing")}
                </span>
              </Button>
            ) : (
              <Button
                type="submit"
                className="h-12 px-10 rounded-lg text-base w-64"
              >
                {isSave ? t("SaveBtn") : t("UpdateBtn")}
              </Button>
            )}
          </div>
        </div>
        {/* end flex-1 */}
      </div>
    </div>
  );
};

export default SeoSetting;
