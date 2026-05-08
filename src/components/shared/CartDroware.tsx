"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

import {
  removeToCart,
  toggleCartDroware,
  updateCartQuantity,
} from "@/redux/features/cartSlice";

import { CURRENCY } from "@/lib/envSecret";
import Link from "next/link";

const EcommerceCartDrawer = () => {
  const { open, carts, subtotal, totalItems } = useAppSelector(
    (state) => state.cart
  );

  const dispatch = useAppDispatch();

  const handleToggleCart = () => {
    dispatch(toggleCartDroware());
  };

  return (
    <Drawer
      open={open}
      onOpenChange={handleToggleCart}
      direction="right"
    >
      <DrawerContent className="ml-auto flex h-full w-full max-w-md flex-col rounded-none border-l bg-background">
        {/* Header */}
        <DrawerHeader className="border-b px-5 py-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2 text-xl font-semibold">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart ({totalItems})
            </DrawerTitle>

            <Button
              size="icon"
              variant="ghost"
              onClick={handleToggleCart}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DrawerHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {carts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              {/* Icon */}
              <div className="flex h-28 w-28 items-center justify-center rounded-full border bg-muted/40 shadow-sm">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>

              {/* Title */}
              <h2 className="mt-6 text-2xl font-bold">
                Your cart is empty
              </h2>

              {/* Description */}
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                Looks like you haven&apos;t added anything to your cart yet.
                Start shopping to find amazing products.
              </p>

              {/* Button */}
              <Button
                className="mt-8 h-11 w-full max-w-xs"
                onClick={handleToggleCart}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="divide-y px-5 py-3">
              {carts.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 py-4"
                >
                  {/* Product Image */}
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl border bg-muted">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col">
                    {/* Top */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="line-clamp-1 text-sm font-semibold">
                          {item.productName}
                        </h3>

                        {item?.selectedVariants && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {Object.keys(
                              item?.selectedVariants || {}
                            ).map((key, index, array) => (
                              <span
                                key={key}
                                className="capitalize"
                              >
                                {key}:{" "}
                                {
                                  item.selectedVariants &&
                                  item.selectedVariants[key]
                                }

                                {index !== array.length - 1 &&
                                  " • "}
                              </span>
                            ))}
                          </p>
                        )}
                      </div>

                      {/* Remove */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0 text-red-500 hover:text-red-600"
                        onClick={() =>
                          dispatch(
                            removeToCart({
                              productId: item.productId,
                              sku: item.sku,
                            })
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Bottom */}
                    <div className="mt-auto flex items-center justify-between pt-4">
                      {/* Price */}
                      <div>
                        <p className="text-sm font-semibold">
                          {CURRENCY} {item.salePrice}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Total: {CURRENCY}{" "}
                          {item.salePrice * item.quantity}
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center overflow-hidden rounded-md border">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-9  rounded-md  rounded-r-none"
                          onClick={() =>
                            dispatch(
                              updateCartQuantity({
                                productId: item.productId,
                                sku: item.sku,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span className="flex h-8 min-w-9 items-center justify-center border-x text-sm font-medium">
                          {item.quantity}
                        </span>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-9 rounded-md  rounded-l-none"
                          onClick={() =>
                            dispatch(
                              updateCartQuantity({
                                productId: item.productId,
                                sku: item.sku,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {carts.length > 0 && (
          <div className="border-t bg-background px-5 py-4">
            <div className="space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal
                </span>

                <span className="font-medium">
                  {CURRENCY} {subtotal}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Shipping
                </span>

                <span className="font-medium text-green-600">
                  Free
                </span>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">
                  Total
                </span>

                <span className="text-xl font-bold">
                  {CURRENCY} {subtotal}
                </span>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <Button className="h-11 w-full text-base font-medium">
                  Proceed to Checkout
                </Button>

                <Link href={'/cart'}>
                <Button
                  variant="outline"
                  className="h-11 w-full"
                  onClick={() => {
                    handleToggleCart();
                  }}
                >
                   Shopping Cart
                </Button></Link>
              </div>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default EcommerceCartDrawer;