'use client';
import { IProduct } from "@/redux/service/products/type";
import { HandCoins, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { PRODUCT_IMG } from "@/lib/default-import";
import { CURRENCY } from "@/lib/envSecret";
import { cn } from "@/lib/utils";
import { ICartItem } from "@/redux/service/orders/type";
import { useAppDispatch } from "@/hooks/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  product: IProduct;
};

const ProductCard = ({ product }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    _id,
    name,
    slug,
    productType,
    gallery,
    variations,
    price,
    discountPrice,
  } = product || {};

  /**
   * =================================
   * Product Image
   * =================================
   */

  const getProductImage = () => {
    // 1. Gallery image first
    if (gallery?.length && gallery[0]) {
      return gallery[0];
    }

    // 2. Variant image
    if (variations?.length) {
      const variantWithImage = variations.find(
        (variant) => variant?.images?.length && variant.images[0]
      );

      if (variantWithImage?.images?.[0]) {
        return variantWithImage.images[0];
      }
    }

    // 3. Default image
    return `/${PRODUCT_IMG}`;
  };

  const productImage = getProductImage();

  /**
   * =================================
   * Price Logic
   * =================================
   */

  const getPriceRange = () => {
    // SINGLE PRODUCT


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


  const getSinglePrice = () => {
    if (productType === "single") {
      const originalPrice = price || 0;
      const discount = discountPrice || 0;

      const finalPrice =
        originalPrice - discount;

      return { finalPrice, price: originalPrice };
    }
  }

  const productPrice = getPriceRange();


  const handleAddToCart = (action: 'cart' | 'buy' = 'cart') => {
    if (product.productType !== 'single' && product.selectedAttributes && product.selectedAttributes.length > 0) {
      router.push(`/${product?.slug}`)
      return;
    }

    const sku = 'N/A'

    const cartItem: ICartItem = {
      productId: product._id,
      productName: product.name,
      productSlug: product?.slug,
      sku: sku || 'N/A',
      quantity: 1,
      productType: 'single',
      price: (getSinglePrice()?.price || 0),
      salePrice: (getSinglePrice()?.finalPrice || 0),
      productImage: productImage,
    }


    dispatch(addToCart({ cart: cartItem }))

    if (action === 'buy') {
      router.push(`/checkout`)
      return;
    }

    toast.success("Added shopping cart")

  }


  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-sm group cursor-pointer h-full py-2 px-2">
      {/* Product Image */}
      <div className={cn(" h-56 overflow-hidden rounded-md", !productImage && 'bg-secondary')}>
        {
          productImage &&
          <Link href={`/${slug}`} className="rounded-md bg-red-800">
            <Image
              width={600}
              height={400}
              src={productImage}
              alt={name}
              className="w-full h-full object-contain rounded-md transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        }
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/${slug}`}>
          <h4 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 hover:text-primary transition">
            {name}
          </h4>
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.ratings.average)
                  ? 'text-yellow-400'
                  : 'text-muted-foreground'
                }`} />
            ))}
          </div>
          <span className="text-sm text-accent-foreground">
            ({product.ratings.totalReviews} reviews)
          </span>
        </div>

        {/* Price + Variant */}
        <div className="flex items-center justify-between flex-wrap mb-4">
          {
            productType === 'single' ? <div className="flex gap-2 items-center">
              <span className="text-2xl font-bold text-primary">
                {CURRENCY}{getSinglePrice()?.finalPrice}
              </span>
              <del className="text-xl text-muted-foreground">{CURRENCY}{(getSinglePrice()?.price || 0) - (getSinglePrice()?.finalPrice || 0)}</del>
            </div> :
              <span className="text-2xl font-bold text-primary">
                {productPrice}
              </span>
          }

          {productType === "variant" &&
            variations &&
            variations.length > 0 && (
              <span className="text-xs bg-secondary text-foreground px-3 py-1 rounded-full">
                {variations.length} Variants
              </span>
            )}
        </div>

        {/* Buttons */}
        <div className="grid sm:grid-cols-2 items-center gap-3 mt-auto">
          <Button className="w-full" variant={"outline"} onClick={() => handleAddToCart()}>
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>

          <Button className="w-full" onClick={() => handleAddToCart('buy')}>
            <HandCoins className="w-4 h-4" />
            Order Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;