"use client";

import useUtilsFunction from "@hooks/useUtilsFunction";

const Price = ({ product, price, card, originalPrice, currency }) => {
  const { formatPrice } = useUtilsFunction();

  // From "second design" logic
  const isCombo = product?.isCombination;
  const finalPrice = isCombo ? price : product?.prices?.price;
  const discountAmount = originalPrice > price ? originalPrice - price : 0;

  return (
    <>
      <div className="product-price font-bold">
        <span
          className={`${
            card
              ? "inline-block text-base text-foreground"
              : "inline-block text-xl"
          }`}
        >
          {formatPrice(finalPrice, currency)}
        </span>
        {discountAmount > 0 && (
          <span
            className={
              card
                ? "sm:text-sm font-normal text-base text-muted-foreground ml-1"
                : "text-sm font-normal text-muted-foreground ml-1"
            }
          >
            <del> {formatPrice(originalPrice, currency)}</del>
          </span>
        )}
      </div>

      {/* {discountAmount > 0 && !card && (
        <p className="text-xs text-primary">
          Save {formatPrice(discountAmount, currency)} ({discountPercent}% off)
        </p>
      )} */}
    </>
  );
};

export default Price;
