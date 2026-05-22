import { CURRENCY } from "@/lib/envSecret";
import { IProduct } from "@/redux/service/products/type";

// calculate price for single product
export const getSingleProductPrice = (product: IProduct) => {
  const { productType, price, discountPrice } = product;

  if (productType === "single") {
    const originalPrice = price || 0;
    const discount = discountPrice || 0;

    const finalPrice =
      originalPrice - discount;

    return { finalPrice, price: originalPrice };
  }
}



// calculate price range for variant product
export const getPriceRange = (product: IProduct) => {
  const { productType, variations } = product;

  // VARIANT PRODUCT
  if (
    productType === "variant" &&
    variations?.length
  ) {
    const prices = variations.map((variant) => {
      const originalPrice =
        variant.price || 0;

      const discount =
        variant.offerPriceFixed || 0;

      const finalPrice =
        originalPrice - discount;

      return finalPrice > 0
        ? finalPrice
        : 0;
    });

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // same price
    if (minPrice === maxPrice) {
      return `${CURRENCY}${minPrice}`;
    }

    return `${CURRENCY}${minPrice} - ${CURRENCY}${maxPrice}`;
  }

  return `${CURRENCY}0`;
};