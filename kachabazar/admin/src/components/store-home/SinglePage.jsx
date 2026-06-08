import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import TextAreaCom from "@/components/form/others/TextAreaCom";

const SinglePageSetting = ({
  isSave,
  register,
  errors,
  isSubmitting,
  singleProductPageRightBox,
  setSingleProductPageRightBox,
}) => {
  const { t } = useTranslation();

  return (
    <div className="font-sans pr-4">
      {/* Card */}
      <div className="bg-card rounded-lg border border-border py-6 px-8 mb-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground">{t("RightBox")}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t("SingleSetting")}
          </p>
        </div>

        {/* Enable toggle */}
        <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-4">
          <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
            {t("EnableThisBlock")}
          </label>
          <div className="sm:col-span-4">
            <SwitchToggle
              title=""
              handleProcess={setSingleProductPageRightBox}
              processOption={singleProductPageRightBox}
              name={singleProductPageRightBox}
            />
          </div>
        </div>

        {/* Collapsible content */}
        <div
          style={{
            height: singleProductPageRightBox ? "auto" : 0,
            overflow: "hidden",
            transition: "all 0.5s",
            visibility: !singleProductPageRightBox ? "hidden" : "visible",
            opacity: !singleProductPageRightBox ? "0" : "1",
          }}
        >
          {[
            { name: "slug_page_card_description_one",   label: `${t("Description")} One` },
            { name: "slug_page_card_description_two",   label: `${t("Description")} Two` },
            { name: "slug_page_card_description_three", label: `${t("Description")} Three` },
            { name: "slug_page_card_description_four",  label: `${t("Description")} Four` },
            { name: "slug_page_card_description_five",  label: `${t("Description")} Five` },
            { name: "slug_page_card_description_six",   label: `${t("Description")} Six` },
            { name: "slug_page_card_description_seven", label: `${t("Description")} Seven` },
          ].map(({ name, label }) => (
            <div
              key={name}
              className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-4"
            >
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-muted-foreground mb-1">
                {label}
              </label>
              <div className="sm:col-span-4">
                <TextAreaCom
                  register={register}
                  label={label}
                  name={name}
                  type="text"
                  placeholder={t("Description")}
                />
                <Error errorName={errors[name]} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update button — bottom center */}
      <div className="flex justify-center pb-8">
        {isSubmitting ? (
          <Button
            disabled={true}
            type="button"
            className="h-12 px-10 rounded-lg text-base w-64"
          >
            <img src={spinnerLoadingImage} alt="Loading" width={20} height={10} />{" "}
            <span className="font-serif ml-2 font-light">{t("Processing")}</span>
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
  );
};

export default SinglePageSetting;
