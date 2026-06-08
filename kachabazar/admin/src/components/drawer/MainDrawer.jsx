import React from "react";
import { X } from "lucide-react";
import { useAction } from "@/context/ActionContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const MainDrawer = ({
  children,
  product,
  open,
  title,
  btn,
  variant,
  isLoading,
  onOpenChange,
  description,
  formId = "entity-form",
}) => {
  const { setCurrentRow, openDrawer, setOpenDrawer } = useAction();

  // Support both old (openDrawer boolean) and new (open prop) patterns
  const isOpen = open !== undefined ? open : openDrawer;
  const handleOpenChange =
    onOpenChange ||
    ((v) => {
      setOpenDrawer(v);
      if (!v) setCurrentRow(null);
    });

  // "Wrapper mode" — when no title is passed, the child drawer
  // (ProductDrawer, CategoryDrawer, etc.) owns the full layout
  // including its own Title, Scrollbars, form, and DrawerButton.
  if (!title) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent className="flex flex-col overflow-hidden p-0">
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  // "Full mode" — MainDrawer provides header, scroll area, and footer
  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="flex flex-col" showClose={false}>
        <SheetHeader>
          <div className="flex w-full items-center  justify-between">
            <div className="flex flex-1 flex-col text-left">
              <SheetTitle className="text-xl">{title}</SheetTitle>
              {description && (
                <SheetDescription>{description}</SheetDescription>
              )}
            </div>
            <div className="ml-4 flex items-center gap-3">
              <SheetClose asChild>
                <button
                  aria-label="Close"
                  className="rounded-sm p-1.5 top-0 bg-red-100 text-red-600 opacity-80 transition-opacity hover:opacity-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-ring dark:bg-red-900/50  dark:hover:bg-red-900/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </SheetClose>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-auto px-4">{children}</div>

        {btn && (
          <div className="mt-4 mb-10 flex justify-between gap-2 px-4">
            <SheetClose asChild>
              <Button variant="delete" className="h-12 w-1/3">
                Cancel
              </Button>
            </SheetClose>
            <Button
              form={formId}
              type="submit"
              className="h-12 w-1/3"
              variant={variant}
              disabled={isLoading}
              isLoading={isLoading}
            >
              {btn}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default React.memo(MainDrawer);
