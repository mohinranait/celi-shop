
import { IProduct } from '@/redux/service/products/type'
import Breadcrumb from './Breadcrumb'
import SectionHeader from '@/components/shared/SectionHeader'
import ReviewTabs from './ReviewTabs'
import ProductView from './ProductView'
import RelatedProducts from './RelatedProducts'
import { Suspense } from 'react'
import ProductsSkeleton from '@/app/(root)/components/ProductsSkeleton'


export async function ProductDetailss({ product }: { product: IProduct }) {

// console.log({product});


  return (
    <div className="min-h-screen ">

      <Breadcrumb name={product?.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProductView product={product} />
      </div>

      <ReviewTabs product={product} />

      <div className=" py-4 lg:py-10 px-2">
        <SectionHeader title='Related Products' description="Explore your related products, you can buy here." className='pb-4' />
        <Suspense fallback={<ProductsSkeleton />}>
          <RelatedProducts catId={product?.category} />
        </Suspense>
      </div>
    </div>
  )
}