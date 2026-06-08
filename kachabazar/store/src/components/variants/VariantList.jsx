"use client";

import { Button } from "@components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@components/ui/select";
import useUtilsFunction from "@hooks/useUtilsFunction";

const VariantList = ({
  att,
  option,
  variants,
  setValue,
  varTitle,
  selectVariant,
  setSelectVariant,
  setSelectVa,
}) => {
  const { showingTranslateValue } = useUtilsFunction();

  const handleChangeVariant = (v) => {
    setValue(v);
    setSelectVariant({
      ...selectVariant,
      [att]: v,
    });
    setSelectVa({ [att]: v });
  };

  // Unique variant values
  const uniqueVariants = [
    ...new Map(variants?.map((v) => [v[att], v]).filter(Boolean)).values(),
  ].filter(Boolean);

  return (
    <>
      {option === "Dropdown" ? (
        <Select
          onValueChange={handleChangeVariant}
          value={selectVariant[att] || ""}
        >
          <SelectTrigger className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-background py-1.5 pr-8 pl-3 text-base text-muted-foreground outline-1 -outline-offset-1 outline-border focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6">
            <SelectValue placeholder="Select Variant" />
          </SelectTrigger>
          <SelectContent>
            {uniqueVariants.map((vl) =>
              varTitle.map((vr) =>
                vr?.variants?.map(
                  (el) =>
                    vr?._id === att &&
                    el?._id === vl[att] && (
                      <SelectItem key={el._id} value={vl[att]}>
                        {showingTranslateValue(el.name)}
                      </SelectItem>
                    )
                )
              )
            )}
          </SelectContent>
        </Select>
      ) : (
        <div className="w-full flex flex-wrap gap-2">
          {uniqueVariants.map((vl) =>
            varTitle.map((vr) =>
              vr?.variants?.map(
                (el) =>
                  vr?._id === att &&
                  el?._id === vl[att] && (
                    <Button
                      size="sm"
                      key={el._id}
                      onClick={() => handleChangeVariant(vl[att])}
                      variant={
                        Object?.values(selectVariant).includes(vl[att])
                          ? "active"
                          : "outline"
                      }
                      className={`h-7 text-xs ${
                        Object?.values(selectVariant).includes(vl[att])
                          ? "cursor-pointer inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary"
                          : "cursor-pointer inline-flex items-center rounded-full bg-background hover:bg-accent hover:shadow-md px-3 py-1 text-xs font-medium text-muted-foreground hover:text-[#dd8e25]"
                      }`}
                    >
                      {showingTranslateValue(el.name)}
                    </Button>
                  )
              )
            )
          )}
        </div>
      )}
    </>
  );
};

export default VariantList;
