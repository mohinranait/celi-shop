'use client';

import { Card, CardContent } from "@/components/ui/card";

import { useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { useGetClientProductsQuery } from "@/redux/client/products";



export default function OffersPage() {
  const [sort, setSort] = useState("discount-desc");

  // Fetch only products that have offers
  const { data, isLoading } = useGetClientProductsQuery(
    `page=1&limit=100&type=offer&status=true&isDeleted=false`
  );

  const products = data?.data || [];

 



  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      

      <div className="container mx-auto px-4 pt-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              {products.length} Products on Offer
            </h2>
            <p className="text-gray-600 text-center">Best prices of the season</p>
          </div>

          {/* <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="discount-desc">Highest Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div> */}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className=" lg:container mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5   gap-2 xl:gap-3 2xl:gap-4">
            {Array(10).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-56 bg-gray-200 rounded-t-xl" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
         <div className=" lg:container mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5   gap-2 xl:gap-3 2xl:gap-4">
            {products.map((product) => {
            

              return (
               <ProductCard product={product} key={product?._id} />
              );
            })}
          </div>
        )}

        {products.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No active offers right now</p>
            <p className="text-gray-500 mt-2">Please check back later</p>
          </div>
        )}
      </div>
    </div>
  );
}