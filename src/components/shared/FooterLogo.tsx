'use client';
import { useGetAppSettingQuery } from '@/redux/service/setting'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const FooterLogo = () => {
  const {data:appSetting} = useGetAppSettingQuery()
  const logo = appSetting?.footerLogo;
  const siteName = appSetting?.siteName;
  return (
    <Link href={'/'}>
    {
      logo ? <Image src={logo} width={100} height={60} alt={"Logo"} className='h-16 w-24' /> :  <span className="text-2xl font-bold text-foreground">{siteName || "Logo"}</span> 
    }
    </Link>
  )
}

export default FooterLogo