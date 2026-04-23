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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation()
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
      dispatch(userLogout())
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

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
        <div className="flex items-center justify-between gap-4 ">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
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
                className="rounded-r-none border-r-0"
              />
              <Button type="submit" size="sm" className="rounded-l-none h-8">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Right side icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* User Account */}

            {user ? (
              <span onClick={handleLogout} className="inline-flex gap-2 items-center"> <User className="h-5 w-5" />{user?.name}</span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-2"
                type="button"
                onClick={() => {
                  dispatch(setLoginModalOpen({ isOpen: true }));
                }}
              >
                <User className="h-5 w-5" />
                <span>{"Login"}</span>
              </Button>
            )}

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />

                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mb-4">
          <div className="flex">
            <Input
              type="text"
              placeholder="Search..."
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
      <div className="bg-primary  py-2">
        <div className="container mx-auto">
          <nav className="hidden  md:flex items-center justify-center gap-8">
            <Link href="/shop" className="text-secondary ">
              Shop
            </Link>
            <Link href="/shop?category=mens" className="text-secondary ">
              Men
            </Link>
            <Link
              href="/shop?category=womens"
              className="text-secondary  transition"
            >
              Women
            </Link>
            <Link
              href="/shop?category=accessories"
              className="text-secondary  transition"
            >
              Accessories
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col gap-2 p-4">
            <Link
              href="/shop"
              className="block py-2 px-4 hover:bg-secondary rounded"
            >
              Shop
            </Link>
            <Link
              href="/shop?category=mens"
              className="block py-2 px-4 hover:bg-secondary rounded"
            >
              Men
            </Link>
            <Link
              href="/shop?category=womens"
              className="block py-2 px-4 hover:bg-secondary rounded"
            >
              Women
            </Link>
            <Link
              href="/shop?category=accessories"
              className="block py-2 px-4 hover:bg-secondary rounded"
            >
              Accessories
            </Link>

            <>
              <Link
                href="/login"
                className="block py-2 px-4 hover:bg-secondary rounded"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block py-2 px-4 hover:bg-secondary rounded"
              >
                Sign Up
              </Link>
            </>
          </nav>
        </div>
      )}


      <LoginModal />
    </header>
  );
}
