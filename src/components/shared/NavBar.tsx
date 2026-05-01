"use client";
import React, { ReactNode, useEffect, useState } from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ProfileDropdown } from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";

interface HeaderProps {
  fixed?: boolean;
  children?: ReactNode;
  titleIcon?: ReactNode;
  className?: string;
}

export const Navbar = ({
  className,
  fixed,
  children,
  titleIcon,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "w-full bg-background",
        fixed && "header-fixed peer/header fixed z-50 w-[inherit]"
      )}
    >
      <header
        className={cn(
          "flex w-full justify-between bg-white h-16 items-center gap-3 p-4 sm:gap-4",
          fixed && "header-fixed peer/header fixed z-50 w-[inherit]",
          offset > 10 && fixed ? "shadow-sm" : "shadow-none",
          className
        )}
        {...props}
      >
        <SidebarTrigger
          variant="outline"
          className="scale-125 text-black sm:scale-100"
        />

        <div className=" justify-between items-center space-x-4">
          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        </div>
      </header>
    </div>
  );
};

Navbar.displayName = "Navbar";