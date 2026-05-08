"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Heart,
  Truck,
  Star,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IProduct } from "@/redux/service/products/type";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Variation {
  name: string;
  price: number;
  offerPriceFixed?: number;
  offerPriceParcent?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stock: number;
  lowStockAlert: number;
  images: string[];
  isDefault: boolean;
}

interface SelectedAttribute {
  attributeId?: string;
  name: string;
  selectedValues: string[];
}

interface Product {
  _id: string;
  name: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  thumbnail?: string;
  gallery: string[];
  price?: number;
  discountPrice?: number;
  discountParcent?: number;
  productType: "single" | "variant";
  selectedAttributes: SelectedAttribute[];
  variations: Variation[];
  stock: number;
  trackStock: boolean;
  tags: string[];
  ratings: { average: number; totalReviews: number };
  shipping: { isFreeShipping: boolean };
  sku?: string;
  status?: boolean;
}

// ─── Color map for color swatches ────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  Red: "#ef4444",
  Blue: "#3b82f6",
  Green: "#22c55e",
  Black: "#1a1a1a",
  White: "#f5f5f5",
  Yellow: "#eab308",
  Pink: "#ec4899",
  Purple: "#a855f7",
  Orange: "#f97316",
  Gray: "#6b7280",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ average, total }: { average: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < Math.round(average)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {total > 0 ? `(${total} reviews)` : "(No reviews yet)"}
      </span>
    </div>
  );
}

function StockBadge({ stock, lowAlert }: { stock: number; lowAlert: number }) {
  if (stock <= 0) {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
        <span className="text-red-600 font-medium">Out of stock</span>
      </div>
    );
  }
  if (stock <= lowAlert) {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
        <span className="text-amber-700 font-medium">
          Low stock — only {stock} left
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
      <span className="text-green-700 font-medium">
        In stock ({stock} available)
      </span>
    </div>
  );
}

function PriceDisplay({
  price,
  discountPrice,
  discountPct,
}: {
  price?: number;
  discountPrice?: number | null;
  discountPct?: number | null;
}) {
  if (!price) return null;
  const hasDiscount =
    discountPrice !== null &&
    discountPrice !== undefined &&
    discountPrice < price;
  const finalPrice = hasDiscount ? discountPrice! : price;

  return (
    <div className="flex items-baseline gap-2.5">
      <span className="text-3xl font-semibold tracking-tight">
        ৳{finalPrice.toLocaleString()}
      </span>
      {hasDiscount && (
        <>
          <span className="text-lg text-muted-foreground line-through">
            ৳{price.toLocaleString()}
          </span>
          {discountPct && (
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 hover:bg-amber-100"
            >
              {Math.round(discountPct)}% off
            </Badge>
          )}
        </>
      )}
    </div>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

function Gallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  // useEffect(() => {
  //   setActive(0);
  // }, [images]);

  const placeholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='64' text-anchor='middle' dy='.3em' fill='%23d1d5db'%3E📷%3C/text%3E%3C/svg%3E";

  // const src = images.length ? images[active] : placeholder;

  return (
    <div className="space-y-3">
      <div className="aspect-square rounded-xl overflow-hidden bg-muted border">
        {/* <img
          src={src}
          alt="Product"
          className="w-full h-full object-cover transition-opacity duration-200"
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholder;
          }}
        /> */}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.slice(0, 6).map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all",
                active === i
                  ? "border-foreground"
                  : "border-transparent hover:border-muted-foreground"
              )}
            >
              <img
                src={img}
                alt={`thumb-${i}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display =
                    "none";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Variant Selector ─────────────────────────────────────────────────────────

function VariantSelector({
  product,
  onVariationChange,
}: {
  product: Product;
  onVariationChange: (variation: Variation | null) => void;
}) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  useEffect(() => {
    // setSelected({}); 
    onVariationChange(null);
  }, [product._id]);

  function isValueAvailable(attrName: string, val: string): boolean {
    return product.variations.some((v) => {
      const parts = v.name.split(" / ").map((s) => s.trim());
      const idx = product.selectedAttributes.findIndex(
        (a) => a.name === attrName
      );
      return parts[idx] === val;
    });
  }

  function handleSelect(attrName: string, val: string) {
    const next = { ...selected, [attrName]: val };
    setSelected(next);

    const allSelected = product.selectedAttributes.every((a) => next[a.name]);
    if (!allSelected) {
      onVariationChange(null);
      return;
    }

    const varName = product.selectedAttributes
      .map((a) => next[a.name])
      .join(" / ");
    const match = product.variations.find((v) => v.name === varName) || null;
    onVariationChange(match);
  }

  return (
    <div className="space-y-4">
      {product.selectedAttributes.map((attr) => {
        const isColor = attr.name.toLowerCase() === "color";
        const attrLabel =
          attr.name.charAt(0).toUpperCase() + attr.name.slice(1);

        return (
          <div key={attr.name} className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {attrLabel}:{" "}
              {selected[attr.name] && (
                <span className="font-medium text-foreground">
                  {selected[attr.name]}
                </span>
              )}
            </p>
            <div className="flex gap-2 flex-wrap">
              {attr.selectedValues.map((val) => {
                const avail = isValueAvailable(attr.name, val);
                const isSelected = selected[attr.name] === val;

                if (isColor && COLOR_MAP[val]) {
                  return (
                    <button
                      key={val}
                      disabled={!avail}
                      onClick={() => avail && handleSelect(attr.name, val)}
                      title={val}
                      aria-label={val}
                      className={cn(
                        "relative w-8 h-8 rounded-full transition-all",
                        isSelected && "ring-2 ring-offset-2 ring-foreground",
                        !avail && "opacity-30 cursor-not-allowed",
                        avail && !isSelected && "hover:scale-110"
                      )}
                      style={{ backgroundColor: COLOR_MAP[val] }}
                    />
                  );
                }

                return (
                  <button
                    key={val}
                    disabled={!avail}
                    onClick={() => avail && handleSelect(attr.name, val)}
                    className={cn(
                      "px-4 py-1.5 text-sm rounded-md border transition-all",
                      isSelected
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-foreground border-border hover:border-foreground",
                      !avail &&
                        "opacity-35 cursor-not-allowed line-through border-border"
                    )}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ProductDetails Component ───────────────────────────────────────────

export default function ProductDetails1({ product }: { product: IProduct | undefined }) {
  if(!product) return;
  const [variation, setVariation] = useState<IProduct['variations'] | null>(null);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Resolve current gallery images
  const galleryImages =
    variation?.images?.length
      ? variation.images
      : product.gallery?.length
      ? product.gallery
      : [];

  // Resolve stock
  const currentStock =
    product.productType === "single" ? product.stock : variation?.stock ?? -1;

  const lowAlert =
    product.productType === "single" ? 5 : variation?.lowStockAlert ?? 5;

  const canAddToCart =
    product.productType === "single"
      ? product.stock > 0
      : variation !== null && variation.stock > 0;

  // Resolve price
  const displayPrice =
    product.productType === "single"
      ? product.price
      : variation?.price ?? undefined;

  const displayDiscount =
    product.productType === "single"
      ? product.discountPrice ?? null
      : variation
      ? variation.offerPriceFixed
        ? variation.price - variation.offerPriceFixed
        : null
      : null;

  const displayDiscountPct =
    product.productType === "single"
      ? product.discountParcent ?? null
      : variation?.offerPriceParcent ?? null;

  const displaySku =
    product.productType === "single"
      ? product.sku
      : variation?.sku ?? undefined;

  function handleAddToCart() {
    if (!canAddToCart) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <span className="hover:text-foreground cursor-pointer">Home</span>
        <ChevronRight size={14} />
        <span className="hover:text-foreground cursor-pointer">Products</span>
        <ChevronRight size={14} />
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Gallery */}
        <Gallery images={galleryImages} />

        {/* Info panel */}
        <div className="flex flex-col gap-4">
          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Name */}
          <h1 className="text-2xl font-semibold leading-snug">{product.name}</h1>

          {/* Rating */}
          <StarRating
            average={product.ratings.average}
            total={product.ratings.totalReviews}
          />

          {/* Price */}
          {product.productType === "single" ? (
            <PriceDisplay
              price={displayPrice}
              discountPrice={displayDiscount}
              discountPct={displayDiscountPct}
            />
          ) : variation ? (
            <PriceDisplay
              price={displayPrice}
              discountPrice={displayDiscount}
              discountPct={displayDiscountPct}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Select options to see price
            </p>
          )}

          <Separator />

          {/* Variant selector */}
          {product.productType === "variant" && (
            <>
              <VariantSelector
                product={product}
                onVariationChange={setVariation}
              />
              {variation && (
                <div className="text-sm px-3 py-2 rounded-md bg-muted text-muted-foreground">
                  Selected:{" "}
                  <span className="font-medium text-foreground">
                    {variation?.name}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Stock */}
          {currentStock >= 0 && (
            <StockBadge stock={currentStock} lowAlert={lowAlert} />
          )}

          {/* Quantity + Actions */}
          <div className="flex items-center gap-3">
            {/* Qty */}
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-10 flex items-center justify-center bg-muted hover:bg-muted/80 text-lg transition-colors"
              >
                −
              </button>
              <span className="w-11 h-10 flex items-center justify-center text-sm font-medium border-x">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-10 flex items-center justify-center bg-muted hover:bg-muted/80 text-lg transition-colors"
              >
                +
              </button>
            </div>

            {/* Add to cart */}
            <Button
              disabled={!canAddToCart}
              onClick={handleAddToCart}
              className={cn(
                "flex-1 h-10 gap-2 transition-all",
                addedToCart && "bg-green-600 hover:bg-green-600"
              )}
            >
              {addedToCart ? (
                <>
                  <Check size={16} />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  {canAddToCart ? "Add to cart" : "Unavailable"}
                </>
              )}
            </Button>

            {/* Wishlist */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWishlisted((w) => !w)}
              className={cn(
                "h-10 w-10 transition-colors",
                wishlisted &&
                  "border-red-400 text-red-500 bg-red-50 hover:bg-red-50 hover:text-red-500"
              )}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={16} className={wishlisted ? "fill-red-500" : ""} />
            </Button>
          </div>

          {/* SKU */}
          {displaySku && (
            <p className="text-xs text-muted-foreground">
              SKU:{" "}
              <span className="font-mono text-foreground">{displaySku}</span>
            </p>
          )}

          {/* Free shipping */}
          {product.shipping.isFreeShipping && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-md bg-muted border">
              <Truck size={16} />
              <span>Free shipping on this item</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.ratings.totalReviews})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description ||
                "No description available for this product."}
            </p>
          </TabsContent>

          <TabsContent value="shipping" className="mt-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Standard delivery: 3–5 business days.
              <br />
              Express delivery available at checkout.
              <br />
              Free returns within 30 days.
            </p>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            {product.ratings.totalReviews === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reviews yet. Be the first to review this product.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Average rating: {product.ratings.average}/5 from{" "}
                {product.ratings.totalReviews} reviews.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}