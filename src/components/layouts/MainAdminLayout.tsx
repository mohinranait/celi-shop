"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import React, { ReactNode, useEffect, useState } from "react";
import AppSidebar from "../shared/AppSidebar";

const AdminMainLayout = ({ children }: { children: ReactNode }) => {
 
  const { state, setOpen } = useSidebar();


  return (
    <>
      <AppSidebar setOpen={setOpen} state={state} />

      <div
        id="content"
        className={cn(
          " w-full max-w-full ",
          "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
          "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
          "sm:transition-[width] sm:duration-200 sm:ease-linear",
          "flex h-svh flex-col",
          "group-data-[scroll-locked=1]/body:h-full",
          "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh",
        )}
      >
        {children}
      </div>
    </>
  );
};

export default AdminMainLayout;
