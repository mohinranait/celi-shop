"use client";

import WhatsAppIcon from "../svg/WhatsApp";
import Link from "next/link";
import { useGetAppSettingQuery } from "@/redux/service/setting";

const WhatsAppButton = () => {
  const {data:appSetting} = useGetAppSettingQuery()

  

  return (
    <Link
      href= {`https://wa.me/+88${appSetting?.contactPhone}`}
      className={` hidden 
        cursor-pointer
        fixed bottom-20 right-5 z-50
        w-11 h-11 rounded-full
        bg-white ring-1 ring-primary text-primary
        shadow-lg border
        md:flex items-center justify-center
        transition-all duration-300
        hover:scale-110
        
      `}
      aria-label="WhatsApp"
    >
      <WhatsAppIcon className="text-primary"  />
    </Link>
  );
};

export default WhatsAppButton;