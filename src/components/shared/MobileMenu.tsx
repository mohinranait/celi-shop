"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Search, LayoutGrid, Shirt,  Watch, Tag, Heart, Package, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  badge?: string;
}

interface MobileMenuProps {
  user?: { name: string } | null;
  cartCount?: number;
}

// ─── Nav data ─────────────────────────────────────────────────────────────────

const shopItems: NavItem[] = [
  {
    href: "/shop",
    label: "Shop All",
    icon: <LayoutGrid size={17} />,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    href: "/shop?category=mens",
    label: "Men",
    icon: <Shirt size={17} />,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    href: "/shop?category=womens",
    label: "Women",
    icon: <Shirt size={17} />,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    href: "/shop?category=accessories",
    label: "Accessories",
    icon: <Watch size={17} />,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    href: "/shop?sale=true",
    label: "Sale",
    icon: <Tag size={17} />,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    badge: "Up to 50%",
  },
];

const accountItems: NavItem[] = [
  {
    href: "/wishlist",
    label: "Wishlist",
    icon: <Heart size={17} />,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
  {
    href: "/orders",
    label: "My Orders",
    icon: <Package size={17} />,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavRow({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 px-3 py-3 rounded-xl transition-colors",
        active ? "bg-muted" : "hover:bg-muted"
      )}
    >
      {/* Icon */}
      <span
        className={cn(
          "w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0",
          item.iconBg,
          item.iconColor
        )}
      >
        {item.icon}
      </span>

      {/* Label */}
      <span
        className={cn(
          "flex-1 text-sm text-foreground",
          active && "font-medium"
        )}
      >
        {item.label}
      </span>

      {/* Optional badge */}
      {item.badge ? (
        <span className="text-[10px] font-medium bg-red-50 text-red-500 rounded px-1.5 py-0.5">
          {item.badge}
        </span>
      ) : (
        <svg
          className="w-4 h-4 text-muted-foreground/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 18l6-6-6-6"
          />
        </svg>
      )}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground/60 px-3 pt-3 pb-1.5">
      {children}
    </p>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MobileMenu({ user, cartCount = 0 }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="flex items-center gap-2 md:hidden">
     

      {/* Hamburger / Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className=" border border-border/50">
            <Menu className="h-4.5 w-4.5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-75 p-0 flex flex-col gap-0"
        >
          {/* Header */}
          <SheetHeader className="flex-row items-center justify-between px-5 py-4 border-b">
            <SheetTitle className="text-xl font-semibold tracking-tight">
              CeliShop
            </SheetTitle>
           
          </SheetHeader>

          {/* Scrollable nav */}
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <SectionLabel>Browse</SectionLabel>
            <nav className="flex flex-col gap-0.5">
              {shopItems.map((item) => (
                <NavRow key={item.href} item={item} onClick={close} />
              ))}
            </nav>

            <div className="my-3 h-px bg-border/50 mx-1" />

            <SectionLabel>Account</SectionLabel>
            <nav className="flex flex-col gap-0.5">
              {accountItems.map((item) => (
                <NavRow key={item.href} item={item} onClick={close} />
              ))}
            </nav>
          </div>

          {/* Footer — auth buttons (guest only) */}
          {!user && (
            <div className="border-t px-4 py-4 flex flex-col gap-2.5">
              <Link href="/login" onClick={close}>
                <Button variant="outline" className="w-full gap-2 rounded-xl h-10">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={close}>
                <Button className="w-full gap-2 rounded-xl h-10">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}