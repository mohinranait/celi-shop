"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setLoginModalOpen } from "@/redux/features/uiSlice";
import LoginModal from "./login-modal";
import NavigationMenus from "./NavigationMenus";
import { toggleCartDroware } from "@/redux/features/cartSlice";


import { MobileMenu } from "./MobileMenu";
import HeaderLogo from "./HeaderLogo";
import { cn } from "@/lib/utils";
import MarqueText from "./MarqueText";

export default function Header() {
  const [isMobileSearch, setIsMobileSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const { totalItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };


  return (
    <header className=" z-50 w-full bg-white border-b border-border">
      {/* Top bar */}
      <MarqueText />
     

      {/* Main header */}
      <div className={cn(
        "  px-4 py-2 lg:py-4 transition-all duration-300",
        isSticky &&
        "fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b"
      )}>
        <div className={cn(
          "container mx-auto  "
        )}>
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
                  className="rounded-r-none bg-background border-r-0 h-10"
                />
                <Button type="submit" size="sm" className="rounded-l-none h-10">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Right side icons */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* User Account */}

              {
                user?._id ? <Button
                  variant="default"
                  className="hidden md:flex items-center h-10 px-5 gap-2"
                  type="button"
                  onClick={() => router.push(user?.role === 'Admin' ? '/admin' : '/dashboard')}
                >
                  <User className="h-5 w-5" />
                  <span>{user?.role === 'Admin' ? "Admin Dashboard" : "Profile"}</span>
                </Button> :
                  <Button
                    variant="default"
                    className="hidden md:flex items-center h-10 px-5 gap-2"
                    type="button"
                    onClick={() => dispatch(setLoginModalOpen({ isOpen: true }))}
                  >
                    <User className="h-5 w-5" />
                    <span>Login</span> /
                    <span>Register</span>
                  </Button>
              }


              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative md:hidden"
                onClick={() => setIsMobileSearch(prev => !prev)}
              >
                <Search className="h-55 w-5" />

              </Button>

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
          <form onSubmit={handleSearch} className={cn("md:hidden h-0 overflow-hidden transition-all ", isMobileSearch && 'h-10 mt-2')}>
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
      </div>

      {/* Bottom Header OR Desktop Navigation */}
      <NavigationMenus />

      <LoginModal />
    </header>
  );
}