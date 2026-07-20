"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LogOut,
  LucideLayoutDashboard,
  User2,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/redux/service/auth";
import { userLogout } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import handleErrors, { ErrorResponse } from "@/lib/handle-error";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(userLogout());
    } catch (error) {
      console.log({ error });
        handleErrors( error as ErrorResponse)
    }
  };

  // Navigation items
  const navLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LucideLayoutDashboard,
    },
    {
      label: "My Orders",
      href: "/dashboard/orders",
      icon: WalletCards,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: User2,
    },


  ];

  return (
    <div>
      <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_auto] py-10">
        {/* Sidebar */}
        <div className="p-4 mb-4 lg:mb-0 bg-white rounded-md">
          {/* User info */}
          <div className="flex pb-4 gap-3">
            <div className="w-10">
              <Avatar className="w-10 h-10 ring-1 ring-main ring-offset-1">
                {/* <AvatarImage src={user?.} alt="Profile" /> */}
                <AvatarFallback className="text-lg uppercase">
                  {user?.name[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="text-gray-800 font-semibold leading-4.5">
                {user?.name} 
              </p>
              <p className="text-gray-400 text-sm leading-4">
                {user?.phone}
              </p>
            </div>
          </div>

          {/* Nav links */}
          <ul>
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${
                    path === href && "bg-gray-100 text-gray-700"
                  } inline-flex px-3 gap-2 text-gray-500 hover:text-gray-700 items-center hover:bg-gray-100 rounded w-full py-2`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              </li>
            ))}

            {/* Logout button */}
            <li>
              <Button
                type="button"
                variant={"destructive"}
                onClick={handleLogout}
                className="inline-flex px-3 gap-2  items-center  rounded w-full py-2"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </li>
          </ul>
        </div>

        {/* Main content */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default ProfileLayout;
