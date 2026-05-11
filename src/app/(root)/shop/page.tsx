import React, { Suspense } from 'react'
import { ShopContent } from './components/ShopContent'

const ShopPage = () => {
  return (
     <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}

export default ShopPage