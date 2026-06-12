"use client";
import Link from "next/link";
import { useGetAppSettingQuery } from "@/redux/service/setting";
import { Phone } from "lucide-react";

const CallButton = () => {
  const {data:appSetting} = useGetAppSettingQuery()

  

  return (
    appSetting?.contactPhone ? <Link
      href= {`tel:${appSetting?.contactPhone}`}
      className={`flex md:hidden 
        cursor-pointer
        fixed bottom-20 right-5 z-50
        w-11 h-11 rounded-full
        bg-white ring-1 ring-primary text-primary
        shadow-lg border
         items-center justify-center
        transition-all duration-300
        hover:scale-110
        
      `}
      aria-label="Phone call"
    >
      <Phone />
    </Link>: null
  );
};

export default CallButton;