
import CommentModal from '@/components/modals/CommentModal'
import CallButton from '@/components/shared/CallButton'

import EcommerceCartDrawer from '@/components/shared/CartDroware'
import Footer from '@/components/shared/Footer'
import Header from '@/components/shared/Header'
import MessengerButton from '@/components/shared/MessengerButton'
import BottomNav from '@/components/shared/MobileNavigation'
import FloatingCartButton from '@/components/shared/PriceCartButton'
import ScrollToTop from '@/components/shared/ScrollToTop'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import { BASE_URL } from '@/lib/envSecret'
import { getAppSetting } from '@/lib/get-app-setting'
import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAppSetting();
  
  // আপনার ডোমেইন বা BASE_URL ভ্যালিড তা নিশ্চিত করুন
  const siteUrl = BASE_URL || "https://banglababa.com"; 

   const imageUrl = settings?.ogImage || settings?.logo || '';

  // ইউআরএল এর শেষ অংশ থেকে এক্সটেনশন (যেমন: jpg, png, webp) বের করার লজিক
  const extension = imageUrl ? imageUrl.split('.').pop()?.split(/[?#]/)[0]?.toLowerCase() : '';

  // এক্সটেনশন অনুযায়ী সঠিক MIME Type সেট করা
  let imageType = "image/jpeg"; // ডিফল্ট টাইপ
  if (extension === "png") {
    imageType = "image/png";
  } else if (extension === "webp") {
    imageType = "image/webp";
  } else if (extension === "gif") {
    imageType = "image/gif";
  }


  return {
    // ১. এটি অবশ্যই যোগ করতে হবে
    metadataBase: new URL(siteUrl), 

    title: settings?.metaTitle || settings?.siteName || "My ecommerce Website",
    description: settings?.metaDescription || settings?.siteDescription || "description",
    keywords: settings?.metaKeyword || '',
    icons: {
      icon: settings?.favicon || "/favicon.ico",
      shortcut: settings?.favicon || "/favicon.ico",
      apple: settings?.favicon || "/favicon.ico",
    },
    openGraph: {
      type: "website",
      url: siteUrl, // BASE_URL এর জায়গায় ভেরিয়েবলটি ব্যবহার করুন
      siteName: settings?.siteName,
      title: settings?.metaTitle,
      description: settings?.metaDescription,
      images: [
         {
          url: imageUrl || '',
          secureUrl: imageUrl || '', // HTTPS লিংকের জন্য এটি সাহায্য করে
          type: imageType,
          width: 1200,
          height: 630,
          alt: settings?.siteName || "Poultry Equipment",
        },
      ],
    },
  };
}


type Props = {
  children: React.ReactNode
}
const MyRootLayout = ({ children }: Props) => {
  return (
    <main className='min-h-screen bg-background'>
      <Header />
      {/* <EcommerceHeader /> */}
      {children}
      <Footer />
      <BottomNav />
      <EcommerceCartDrawer />
      <ScrollToTop />
      <WhatsAppButton />
      <MessengerButton />
      <FloatingCartButton />
      <CommentModal />
      <CallButton />
    </main>
  )
}

export default MyRootLayout