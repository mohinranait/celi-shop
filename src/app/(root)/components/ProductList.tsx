import ProductCard from '@/components/products/ProductCard';
import { IProduct } from '@/redux/service/products/type';
import React from 'react'

type Props = {
  products: IProduct[] | undefined
}
const ProductList = ({ products }: Props) => {


  return (
    <React.Fragment>
      {
        products && products?.length > 0 ? (
          <div className=" lg:container mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5   gap-2 xl:gap-3 2xl:gap-4">
            {products?.map((product, i) => <ProductCard key={i} product={product} />)}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground">No products available</p>
          </div>
        )
      }
    </React.Fragment>
  )
}

export default ProductList