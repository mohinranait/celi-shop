"use client";

import WhatsAppIcon from "../svg/WhatsApp";
import Link from "next/link";
import { useGetAppSettingQuery } from "@/redux/service/setting";
export const formatWhatsappNumber = (phone: string) => {
  if (!phone) return "";

  // Remove all non-numeric characters
  let number = phone.replace(/\D/g, "");

  // Remove country code if exists
  if (number.startsWith("880")) {
    number = number.slice(3);
  } else if (number.startsWith("88")) {
    number = number.slice(2);
  }

  // Remove leading 0 if needed (e.g. 017..., 019...)
  if (number.startsWith("0")) {
    number = number.slice(1);
  }

  return `880${number}`;
};

const WhatsAppButton = () => {
  const {data:appSetting} = useGetAppSettingQuery()


  

  return (
    appSetting?.contactPhone ? <Link
      href={`https://wa.me/${formatWhatsappNumber(appSetting?.contactPhone || "")}`}
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
    </Link>: null
  );
};

export default WhatsAppButton;