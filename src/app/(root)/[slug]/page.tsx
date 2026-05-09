
'use client';

import React from 'react'
import { useParams } from 'next/navigation';
import { useGetProductBySlugQuery } from '@/redux/service/products';
import { ProductDetailss } from './components/product-details2';

const ProductDetails = () => {
  const params = useParams();
  const slug = params.slug;

  const { data } = useGetProductBySlugQuery(String(slug), {
    skip: !slug,
  })

  if (!data?.data) return;
  return (
    <div>
      <ProductDetailss product={data?.data} />
      {/* <ProductDetails1 product={data?.data} /> */}
    </div>
  )
}

export default ProductDetails