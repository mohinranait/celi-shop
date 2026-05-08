import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { CartItem } from './product-details2';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type Props = {
  cart: CartItem[];
}
const Cartui = ({ cart }: Props) => {
  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
      <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-slate-900" />
        <span className="font-semibold text-slate-900">
          {cart.reduce((sum, item) => sum + item.quantity, 0)} items
        </span>
        <span className="text-slate-600">
          ৳{cart.reduce((sum, item) => sum + item.offerPrice * item.quantity, 0)}
        </span>
        <details className="relative">
          <summary className="cursor-pointer text-slate-600 hover:text-slate-900 list-none">
            <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </summary>
          <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-slate-200 rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto">
            <h3 className="font-bold text-slate-900 mb-3">Shopping Cart ({cart.length})</h3>
            <div className="space-y-3">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 pb-3 border-b border-slate-200 last:border-b-0">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">{item.productName}</p>
                    {item.selectedVariants && Object.keys(item.selectedVariants).map((vl,i) => 
                    <p key={i} className='text-muted-foreground capitalize text-xs'>{vl}: {item?.selectedVariants && item?.selectedVariants[vl] }</p>
                    ) }
                    <p className="text-xs text-slate-600 mt-1">SKU: {item.sku}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-slate-900">
                        ৳{item.offerPrice} x {item.quantity}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        ৳{item.offerPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="flex justify-between mb-3">
                <span className="font-semibold text-slate-900">Total:</span>
                <span className="font-bold text-lg text-slate-900">
                  ৳{cart.reduce((sum, item) => sum + item.offerPrice * item.quantity, 0)}
                </span>
              </div>
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </details>
      </div>
    </div>
  )
}

export default Cartui