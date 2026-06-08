const Price = ({ product, price, currency }) => {
  return (
    <div className="font-serif product-price font-bold ">
      {currency ? currency : '$'}
      {price
        ? Number(price).toFixed(2)
        : Number(product?.prices?.originalPriceWithTax).toFixed(2)}
    </div>
  );
};

export default Price;
