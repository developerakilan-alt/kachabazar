import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

//internal import

import { useAction } from "@/context/ActionContext";

const DrawerButton = ({ id, title, isSubmitting, zIndex = "z-10", onClick }) => {
  const { t } = useTranslation();

  const { toggleDrawer } = useAction();
  return (
    <div
      className={`${zIndex} w-full shrink-0 border-t border-border bg-card shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]`}
    >
      <div className="flex gap-4 px-6 py-4">
        {/* Cancel Button */}
        <div className="flex-1">
          <Button
            onClick={toggleDrawer}
            type="button"
            variant="delete"
            className="w-full h-11"
          >
            {t("CancelBtn")}
          </Button>
        </div>

        {/* Submit/Update Button */}
        <div className="flex-1">
          <Button
            type="submit"
            onClick={onClick}
            className="w-full h-11"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {id ? `${t("UpdateBtn")} ${title}` : `Add ${title}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DrawerButton;
