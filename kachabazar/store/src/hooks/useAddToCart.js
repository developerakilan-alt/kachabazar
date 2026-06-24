import { useState } from "react";
import { useCart } from "react-use-cart";

import { notifyError, notifySuccess } from "@utils/toast";

const useAddToCart = () => {
  const [item, setItem] = useState(1);
  const { addItem, items, updateItemQuantity, totalItems } = useCart();
  // console.log('products',products)
  // console.log("items", items);

  const handleAddItem = (product, quantity) => {
    const qty = Number(quantity || item);
    const result = items.find((i) => i.id === product.id);
    const { variants, categories, description, ...updatedProduct } = product;

    const maxStock = Number(
      product?.variant?.quantity ?? product?.stock ?? product?.quantity ?? 0,
    );

    if (result !== undefined) {
      if (result?.quantity + qty <= maxStock) {
        addItem(updatedProduct, qty);
        notifySuccess(`${qty} ${product.title} added to cart!`);
      } else {
        notifyError("Insufficient stock!");
      }
    } else {
      if (qty <= maxStock) {
        addItem(updatedProduct, qty);
        notifySuccess(`${qty} ${product.title} added to cart!`);
      } else {
        notifyError("Insufficient stock!");
      }
    }
  };

  const handleIncreaseQuantity = (product) => {
    const result = items?.find((p) => p.id === product.id);
    const maxStock = Number(
      product?.variant?.quantity ?? product?.stock ?? product?.quantity ?? 0,
    );
    if (result) {
      if (result?.quantity + item <= maxStock) {
        updateItemQuantity(product.id, product.quantity + 1);
      } else {
        notifyError("Insufficient stock!");
      }
    }
  };

  return {
    item,
    setItem,
    totalItems,
    handleAddItem,
    handleIncreaseQuantity,
  };
};

export default useAddToCart;
