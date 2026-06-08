"use client";

import Link from "next/link";
import { useGetAppSettingQuery } from "@/redux/service/setting";
import Image from "next/image";

const MessengerButton = () => {
  const {data:appSetting} = useGetAppSettingQuery()

  

  return (
    appSetting?.socialLinks?.facebook ? <Link
    target="_blank"
      href= {appSetting?.socialLinks?.facebook || '/'}
      className={` hidden 
        cursor-pointer
        fixed bottom-33 right-5 z-50
        w-12 h-12 rounded-full
        md:flex items-center justify-center
        transition-all duration-300
        hover:scale-110
        
      `}
      aria-label="Messenger"
    >
      <Image src={'/messenger.webp'} width={40} height={40} alt="Messenger" />
    </Link>
  : null);
};

export default MessengerButton;