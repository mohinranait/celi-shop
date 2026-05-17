"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/hooks/hooks";
import WhatsAppIcon from "../svg/WhatsApp";
import { useGetAppSettingQuery } from "@/redux/service/setting";



export default function BottomNav() {
  const {totalItems} = useAppSelector(state => state.cart)
  const {data:appSetting} = useGetAppSettingQuery()
  const pathname = usePathname();

  const navItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/shop",
    label: "Shop",
    icon: ShoppingBag,
  },
   {
    href: `https://wa.me/+88${appSetting?.contactPhone}`,
    label: "WhatsApp",
    icon: WhatsAppIcon,
  },
  {
    href: "/cart",
    label: "Cart",
    icon: ShoppingCart,
    badge: true,
  },
 
];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white backdrop-blur-lg md:hidden">
      <nav className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all active:scale-95",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all"
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}