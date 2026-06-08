import { t } from "i18next";
import React, { useState, useMemo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

//internal import
import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import DrawerButton from "@/components/form/button/DrawerButton";
import useCurrencySubmit from "@/hooks/useCurrencySubmit";
import { currencyList } from "@/utils/currencyData";
import { Input } from "@/components/ui/input";

const CurrencyDrawer = ({ id }) => {
  const {
    errors,
    onSubmit,
    register,
    setValue,
    status,
    setStatus,
    isSubmitting,
    handleSubmit,
  } = useCurrencySubmit(id);

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredCurrencies = useMemo(() => {
    if (!searchQuery) return currencyList;
    const q = searchQuery.toLowerCase();
    return currencyList.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.includes(q),
    );
  }, [searchQuery]);

  const handleCurrencySelect = (currency) => {
    setValue("name", currency.name);
    setValue("symbol", currency.symbol);
    setSearchQuery(`${currency.code} (${currency.symbol}) - ${currency.name}`);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="w-full relative px-6 py-4 border-b bg-muted">
        {id ? (
          <Title
            title={t("UpdateCurrency")}
            description={t("UpdateCurrencyText")}
          />
        ) : (
          <Title title={t("AddCurrency")} description={t("AddCurrencyText")} />
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <Scrollbars className="flex-1 mb-8">
          <div className="px-6 pt-8 pb-6 flex-grow scrollbar-hide w-full max-h-full">
            {/* Currency Code Search Dropdown */}
            {!id && (
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Currency Code" />
                <div className="col-span-8 sm:col-span-4 relative">
                  <Input
                    type="text"
                    placeholder="Search currency code..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                  {isDropdownOpen && filteredCurrencies.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                      {filteredCurrencies.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={() => handleCurrencySelect(c)}
                        >
                          <span className="font-medium">{c.code}</span>
                          <span className="text-muted-foreground ml-2">
                            ({c.symbol})
                          </span>
                          <span className="text-muted-foreground ml-1">
                            — {c.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {isDropdownOpen && (
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("CurrenciesName")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Name"
                  name="name"
                  type="text"
                  placeholder="Name"
                />
                <Error errorName={errors.name} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("CurrenciesSymbol")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Symbol"
                  name="symbol"
                  type="text"
                  placeholder="Symbol"
                />
                <Error errorName={errors.symbol} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("CurrenciesEnabled")} />
              <div className="col-span-8 sm:col-span-1 text-align-left">
                <SwitchToggle
                  processOption={status}
                  handleProcess={setStatus}
                />
              </div>
            </div>
          </div>
        </Scrollbars>

        <DrawerButton id={id} title="Currency" isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default CurrencyDrawer;
