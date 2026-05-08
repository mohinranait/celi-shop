import { IProduct } from '@/redux/service/products/type'
import Image from 'next/image'
import React, { useState } from 'react'

type Props = {
  product: IProduct;
  images: string[];
   stock: number;
}
const ImageGallary = ({ product, images,stock }: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200 aspect-square">
        <Image
          src={images[currentImageIndex]}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white px-6 py-3 rounded-lg font-semibold">Out of Stock</div>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${currentImageIndex === idx
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