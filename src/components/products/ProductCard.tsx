'use client';
import { IProduct } from "@/redux/service/products/type";
import { HandCoins, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { CURRENCY } from "@/lib/envSecret";
import { cn } from "@/lib/utils";
import { ICartItem } from "@/redux/service/orders/type";
import { useAppDispatch } from "@/hooks/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import findProductImage from "@/hooks/useFindProductImage";
import { getPriceRange, getSingleProductPrice } from "@/hooks/useGerPrice";
import { showTwoDecimals } from "@/lib/helpers";

type Props = {
  product: IProduct;
};

const ProductCard = ({ product }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    name,
    slug,
    productType,
    gallery,
    variations,
  } = product || {};


  // Find product image
  const productImage = findProductImage({ product });
  // Calculate price
  const singleProductPrice = getSingleProductPrice(product);
  const productPrice = getPriceRange(product);


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
      price: (singleProductPrice?.price || 0),
      salePrice: (singleProductPrice?.finalPrice || 0),
      productImage: productImage,
      freeShipping: product?.shipping?.isFreeShipping
    }


    dispatch(addToCart({ cart: cartItem }))

    if (action === 'buy') {
      router.push(`/checkout`)
      return;
    }

    toast.success("Added shopping cart")

  }


  const getOfferCar = (): number => {
    let discount = 0;
    if (productType === "single") {
      const price = singleProductPrice?.price
      const finalPrice = singleProductPrice?.finalPrice
      discount = (price || 0) - (finalPrice || 0)
    }
    else if (productType === 'variant') {
      if (variations?.length) {
        const offerVariant = variations.find(
          (variant) => variant?.offerPriceFixed > 0
        );

        if (offerVariant) {
          discount = offerVariant?.offerPriceFixed
        }
      }
    }
    return discount
  }


  const getHoverImage = () => {
    // Gallery second image
    if (gallery?.length > 1 && gallery[1]) {
      return gallery[1];
    }

    // Variant second image
    if (variations?.length) {
      for (const variant of variations) {
        if (variant?.images?.length > 1 && variant.images[1]) {
          return variant.images[1];
        }

        // fallback first variant image if multiple not available
        if (variant?.images?.length && variant.images[0]) {
          return variant.images[0];
        }
      }
    }

    // fallback primary image
    return findProductImage({ product });
  };

  const hoverImage = getHoverImage();


  const isStockOut = () => {
    let isNotAvailable = false;

    if (product.stock === 0) isNotAvailable = true;

    return isNotAvailable
  }


  return (
    <Card className=" p-1 md:p-2 gap-2 transition-all overflow-visible duration-300 hover:shadow-sm group cursor-pointer h-full  relative ">

      {/* Stock Out  */}
      {
        isStockOut() &&
        <div className="hidden xl:block w-37.5 h-37.5 absolute overflow-hidden -top-2.5 -right-2.5  z-30">
          <span className="h-2.5 w-3 bg-red-700 absolute top-0 left-0"></span>
          <span className="h-3 w-2.5 bg-red-700 absolute bottom-0 right-0"></span>
          <span className="w-56.25 py-2.5 rotate-45 top-7.5 -left-6.25  absolute  border-l-0 text-center text-lg uppercase bg-[#ff115e] text-white before:w-0 before:h-0 before:border-l-4 before:border-red-600 before:rotate-45 before:absolute before:left-6.5 before:-bottom-1 before:bg-[#e9034c] font-semibold">Stock Out</span>
        </div>
      }

      {/* Discount  */}
      {
        getOfferCar() > 0 &&
        <span className="w-12 h-12 rounded-full  text-[8px]  flex items-center justify-center text-center absolute top-4 right-4 bg-white text-black z-10 p-1 before:w-12 before:h-12 before:rounded-full before:bg-transparent before:left-0 before:top-0 before:right-0 before:bottom-0 before:absolute before:border-dashed before:border-2 before:border-primary before:animate-spin  before:animation-duration-[7s]  ">
          {getOfferCar()}  টাকা  ছাড়
        </span>
      }
      {/* Product Image */}
      <div className={cn(" aspect-square overflow-hidden relative rounded-md", !productImage && 'bg-secondary')}>

        {
          isStockOut() &&
          <div className="w-full h-full absolute top-0 left-0 bg-black/40 z-20 flex items-center justify-center">
            <span className="bg-white inline-flex py-2 px-4 rounded uppercase text-black">Stock Out</span>
          </div>
        }
        {
          productImage &&
          <Link href={`/${slug}`} className="block w-full h-full relative">
            <Image
              width={600}
              height={400}
              src={productImage}
              alt={name}
              className="
        absolute inset-0
        w-full h-full object-contain rounded-md
        transition-all duration-500
        opacity-100 group-hover:opacity-0
        scale-100 group-hover:scale-105
      "
            />

            {/* Hover image */}
            <Image
              width={600}
              height={400}
              src={hoverImage}
              alt={name}
              className="
        absolute inset-0
        w-full h-full object-contain rounded-md
        transition-all duration-500
        opacity-0 group-hover:opacity-100
        scale-105 group-hover:scale-100
      "
            />
          </Link>
        }
      </div>

      {/* Content */}
      <div className=" flex flex-col flex-1">
        <Link href={`/${slug}`}>
          <h4 className="text-xs md:text-sm xl:text-lg  font-semibold text-foreground mb-1 md:mb-2 line-clamp-2 lg:line-clamp-1 hover:text-primary transition">
            {name}
          </h4>
        </Link>

        <div className="flex items-center gap-2 mb-1 md:mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 md:w-4 h-3 md:h-4 ${i < Math.floor(product.ratings.average)
                ? 'text-yellow-400'
                : 'text-muted-foreground'
                }`} />
            ))}
          </div>
          <span className="text-sm text-accent-foreground">
            ({product.ratings.totalReviews})
          </span>
        </div>

        {/* Price + Variant */}
        <div className="flex items-center justify-between flex-wrap mb-1 lg:mb-3">
          {
            productType === 'single' ? <div className="flex gap-2 items-center">
              <span className="text-sm md:text-base lg:text-lg  font-bold text-primary">
                {CURRENCY}{showTwoDecimals(singleProductPrice?.finalPrice || 0)}
              </span>
              {
                (singleProductPrice?.price || 0) - (singleProductPrice?.finalPrice || 0) > 0 &&
                <del className="text-sm md:text-base lg:text-lg text-muted-foreground">{CURRENCY}{showTwoDecimals((singleProductPrice?.price || 0) - (singleProductPrice?.finalPrice || 0))}</del>
              }
            </div> :
              <span className="text-sm md:text-base lg:text-lg font-bold text-primary">
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
        <div className="flex flex-col items-center gap-1 mg:gap-2 mt-auto">
          <Button disabled={isStockOut()} className="w-full" variant={"outline"} onClick={() => handleAddToCart()}>
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>

          <Button disabled={isStockOut()} className="w-full" onClick={() => handleAddToCart('buy')}>
            <HandCoins className="w-4 h-4" />
            Order Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;