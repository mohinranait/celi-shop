"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Search, ShoppingCart, User, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setLoginModalOpen } from "@/redux/features/uiSlice";
import { useLogoutMutation } from "@/redux/service/auth";
import { userLogout } from "@/redux/features/authSlice";
import LoginModal from "./login-modal";
import NavigationMenus from "./NavigationMenus";
import { toggleCartDroware } from "@/redux/features/cartSlice";

// Shadcn Sheet (Drawer)
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MobileMenu } from "./MobileMenu";
import HeaderLogo from "./HeaderLogo";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const { totalItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(userLogout());
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      {/* Top bar */}
      <div className="bg-foreground text-background py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto text-center">
          Free shipping on orders over $100
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">

            {/* Mobile Menu Button - 3 Dot / Hamburger stays here */}
            <MobileMenu />

          {/* Logo */}
         <HeaderLogo />

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md"
          >
            <div className="flex w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none border-r-0 h-9"
              />
              <Button type="submit" size="sm" className="rounded-l-none h-9">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Right side icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* User Account */}
            {user ? (
              <span
                onClick={handleLogout}
                className=" hidden md:inline-flex gap-2 items-center cursor-pointer hover:text-primary transition-colors"
              >
                <User className="h-5 w-5" />
                {user?.name}
              </span>
            ) : (
              <Button
                variant="default"
                className="hidden md:flex items-center gap-2"
                type="button"
                onClick={() => dispatch(setLoginModalOpen({ isOpen: true }))}
              >
                <User className="h-5 w-5" />
                <span>Login</span>
              </Button>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => dispatch(toggleCartDroware())}
            >
              <ShoppingBag className="h-55 w-5" />
              {/* <ShoppingCart className="h-5 w-5" /> */}
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            </Button>

          
          
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="flex">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none border-r-0 h-9"
            />
            <Button type="submit" size="sm" className="rounded-l-none h-9">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Desktop Navigation */}
      <NavigationMenus />

      <LoginModal />
    </header>
  );
}