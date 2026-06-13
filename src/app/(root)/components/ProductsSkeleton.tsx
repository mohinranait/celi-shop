import React from 'react'

const ProductsSkeleton = () => {
  return (
    <div className=" lg:container mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5   gap-2 xl:gap-3 2xl:gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
      ))}
    </div>
  )
}

export default ProductsSkeleton