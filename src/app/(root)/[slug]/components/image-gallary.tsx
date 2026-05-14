import { IProduct } from '@/redux/service/products/type'
import Image from 'next/image'
import React, { useState } from 'react'

type Props = {
  product: IProduct;
  images: string[];
  stock: number;
}
const ImageGallary = ({ product, images, stock }: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative bg-white rounded-2xl  border border-slate-200">
        {
          stock === 0 &&
          <div className="w-37.5 h-37.5 absolute overflow-hidden -top-2.5 -right-2.5  z-30">
            <span className="h-2.5 w-3 bg-red-700 absolute top-0 left-0"></span>
            <span className="h-3 w-2.5 bg-red-700 absolute bottom-0 right-0"></span>
            <span className="w-56.25 py-2.5 rotate-45 top-7.5 -left-6.25  absolute  border-l-0 text-center text-lg uppercase bg-[#ff115e] text-white before:w-0 before:h-0 before:border-l-4 before:border-red-600 before:rotate-45 before:absolute before:left-6.5 before:-bottom-1 before:bg-[#e9034c] font-semibold">Stock Out</span>
          </div>
        }
       <div className='relative  rounded-2xl w-full h-full overflow-hidden  aspect-square'>
         <Image
          src={images[currentImageIndex]}
          alt={product.name}
          fill
          className="object-cover "
          priority
        />
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white px-6 py-3 rounded-lg font-semibold">Out of Stock</div>
          </div>
        )}
       </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${currentImageIndex === idx
                ? 'border-slate-900'
                : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
            >
              <Image
                src={img}
                alt={`${product.name} ${idx + 1}`}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallary