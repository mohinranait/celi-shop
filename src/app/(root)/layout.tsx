
import EcommerceCartDrawer from '@/components/shared/CartDroware'
import Footer from '@/components/shared/Footer'
import Header from '@/components/shared/Header'
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
      <EcommerceCartDrawer />
    </main>
  )
}

export default MyRootLayout