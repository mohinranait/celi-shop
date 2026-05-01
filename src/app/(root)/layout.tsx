
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
      {children}
      <Footer />
    </main>
  )
}

export default MyRootLayout