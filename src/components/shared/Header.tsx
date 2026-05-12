"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
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
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <h1 className="text-2xl font-bold text-foreground">CeliShop</h1>
          </Link>

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
                className="inline-flex gap-2 items-center cursor-pointer hover:text-primary transition-colors"
              >
                <User className="h-5 w-5" />
                {user?.name}
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-2"
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
              size="sm"
              className="relative"
              onClick={() => dispatch(toggleCartDroware())}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            </Button>

            {/* Mobile Menu Button - 3 Dot / Hamburger stays here */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left text-2xl font-bold">
                    CeliShop
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-8 flex flex-col gap-6">
                  <nav className="flex flex-col gap-1">
                    <Link
                      href="/shop"
                      className="block px-4 py-3 text-lg font-medium hover:bg-secondary rounded-lg transition-colors"
                    >
                      🛍️ Shop All
                    </Link>
                    <Link
                      href="/shop?category=mens"
                      className="block px-4 py-3 text-lg font-medium hover:bg-secondary rounded-lg transition-colors"
                    >
                      👕 Men
                    </Link>
                    <Link
                      href="/shop?category=womens"
                      className="block px-4 py-3 text-lg font-medium hover:bg-secondary rounded-lg transition-colors"
                    >
                      👗 Women
                    </Link>
                    <Link
                      href="/shop?category=accessories"
                      className="block px-4 py-3 text-lg font-medium hover:bg-secondary rounded-lg transition-colors"
                    >
                      ⌚ Accessories
                    </Link>
                  </nav>

                  <div className="border-t pt-6">
                    {!user && (
                      <div className="flex flex-col gap-3 px-4">
                        <Link href="/login">
                          <Button variant="outline" className="w-full">
                            Login
                          </Button>
                        </Link>
                        <Link href="/register">
                          <Button className="w-full">Sign Up</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
              className="rounded-r-none border-r-0"
            />
            <Button type="submit" size="sm" className="rounded-l-none">
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