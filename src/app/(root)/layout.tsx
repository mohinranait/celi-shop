
import EcommerceCartDrawer from '@/components/shared/CartDroware'
import Footer from '@/components/shared/Footer'
import Header from '@/components/shared/Header'
import MessengerButton from '@/components/shared/MessengerButton'
import BottomNav from '@/components/shared/MobileNavigation'
import FloatingCartButton from '@/components/shared/PriceCartButton'
import ScrollToTop from '@/components/shared/ScrollToTop'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import { BASE_URL } from '@/lib/envSecret'
import { fetchData } from '@/lib/fetch-data'
import { IAppSettings } from '@/models/app-setting'
import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchData<IAppSettings>({
    api: "admin/setting",
    revalidate: 3600,
  });

  return {
    title: settings?.metaTitle || settings?.siteName || "My ecommerce Website",
    description: settings?.metaDescription || settings?.siteDescription || "description",
    keywords: settings?.metaKeyword || '',
    openGraph: {
      url: `${BASE_URL}`,
      images: [
        { url: settings?.ogImage || settings?.logo || '' }
      ]
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
    </main>
  )
}

export default MyRootLayout