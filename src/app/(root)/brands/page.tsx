'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {  Building2 } from "lucide-react";
import { useGetBrandsQuery } from "@/redux/service/brand";


interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  totalProducts?: number;
}

export default function BrandsPage() {

  const { data, isLoading } = useGetBrandsQuery("page=1&limit=500&status=true&isDelete=false");

  const brands = data?.data || [];



  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-primary/10 to-primary/15 text-priamry py-7">
        <div className="container mx-auto px-4 text-center">
          <Building2 className="w-10 h-10 mx-auto mb-2 opacity-90" />
          <h1 className="text-xl md:text-3xl text-primary font-bold mb-2">Shop by Brands</h1>
          <p className="text-sm md:text-base text-primary/70 max-w-2xl mx-auto">
            Discover premium products from trusted brands
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">




        {/* Brands Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array(12).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-t-xl" />
                <CardContent className="p-4 text-center">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {brands.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                {brands.map((brand: Brand) => (
                  <Link
                    key={brand._id}
                    href={`/shop?brand=${brand._id}`}
                    className="group"
                  >
                    <Card className="h-full transition-all py-4 duration-300 border border-gray-200 hover:border-primary ">
                      <CardContent className=" flex flex-col items-center justify-center text-center h-full">
                        <div className="relative w-28 h-28 mb-5 bg-white rounded-2xl flex items-center justify-center  overflow-hidden">
                          {brand.logo ? (
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              fill
                              className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                              <Building2 className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <h3 className="font-semibold  text-gray-900 group-hover:text-primary transition-colors">
                          {brand.name}
                        </h3>

                        {brand.totalProducts && (
                          <p className="text-sm text-gray-500 mt-1">
                            {brand.totalProducts} products
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-400">No brands found</p>
                <p className="text-gray-500 mt-2">Try changing your search or filter</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}