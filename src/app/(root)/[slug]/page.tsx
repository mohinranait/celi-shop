
'use client';

import React from 'react'
// import ProductDetails1 from './components/ProductDetails1'
import { useParams } from 'next/navigation';
import { useGetProductByIdQuery } from '@/redux/service/products';
import { ProductDetailss } from './components/product-details2';

const ProductDetails =  () => {
  const params = useParams();
  const slug = params.slug;
  console.log(slug);
   const {data} = useGetProductByIdQuery(String(slug), {
      skip: !slug,
    })
    // console.log(data.data);

    if(!data?.data) return;
  return (
    <div>
      <ProductDetailss product={data?.data} />
      {/* <ProductDetails1 product={data?.data} /> */}
    </div>
  )
}

export default ProductDetails