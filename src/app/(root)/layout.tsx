
import EcommerceCartDrawer from '@/components/shared/CartDroware'
import Footer from '@/components/shared/Footer'
import Header from '@/components/shared/Header'
import BottomNav from '@/components/shared/MobileNavigation'
import FloatingCartButton from '@/components/shared/PriceCartButton'
import ScrollToTop from '@/components/shared/ScrollToTop'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import React from 'react'

type Props = {
  children: React.ReactNode
}
const MyRootLayout = ({children}:Props) => {
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
      <FloatingCartButton />
    </main>
  )
}

export default MyRootLayout