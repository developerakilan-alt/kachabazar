import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const SettingContainer = ({ isSave, title, children, isSubmitting }) => {
  const { t } = useTranslation();
  return (
    <div className="font-sans relative">
      <div className="w-full relative">
        {children}
        <div className="sticky bottom-6 flex justify-center mt-6 z-50 pointer-events-none">
          <Button
            type="submit"
            variant="create"
            className="h-12 px-8 shadow-lg rounded-full text-base pointer-events-auto"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting
              ? "Progressing"
              : isSave
                ? t("SaveBtn")
                : t("UpdateBtn")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingContainer;
