"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CURRENCY } from "@/lib/envSecret";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { toggleCartDroware } from "@/redux/features/cartSlice";

type Props = {
  totalItems?: number;
  totalPrice?: number;
  onClick?: () => void;
  className?: string;
};

const FloatingCartButton = ({
  className,
}: Props) => {
  const dispatch = useAppDispatch()
  const { subtotal, totalItems } = useAppSelector(
    (state) => state.cart
  );

  const handleClick = () => {
    dispatch(toggleCartDroware())
  }

  return (
    <Button
      onClick={handleClick}
      className={cn(
        `
        fixed right-0 top-1/2 -translate-y-1/2
        z-50 h-auto p-0 overflow-hidden
        rounded-l-lg rounded-r-none
        shadow border border-border
        bg-white hover:bg-white
        group
        `,
        className
      )}
    >
      <div className="flex flex-col min-w-22">

        {/* Top */}
        <div
          className="
          bg-slate-100
          px-4 py-3
          flex flex-col items-center justify-center
          border-b
          "
        >
          <div
            className="
            relative mb-1
            transition-transform duration-300
            group-hover:scale-110
            "
          >
            <ShoppingBag className="w-6 h-6 text-slate-700" />

           
          </div>

          <span className="text-sm font-bold text-black leading-none">
            {totalItems} Items
          </span>
        </div>

        {/* Bottom */}
        <div
          className="
          bg-primary
          text-primary-foreground
          py-2 px-4
          text-center
          font-bold text-sm
          "
        >
          {CURRENCY} {subtotal}
        </div>
      </div>
    </Button>
  );
};

export default FloatingCartButton;