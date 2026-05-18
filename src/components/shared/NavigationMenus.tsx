"use client";

import Link from "next/link";
import { ChevronDown, HandHeart } from "lucide-react";
import { useState } from "react";
import { Card } from "../ui/card";
import { useGetCategoriesQuery } from "@/redux/service/categories";
import { ICategory } from "@/redux/service/categories/type";
import Image from "next/image";
import { PRODUCT_IMG } from "@/lib/default-import";



export interface ICategoryTree extends ICategory {
  children: ICategoryTree[];
}

function buildTree(categories:ICategory[], parentId: null | string = null): ICategoryTree [] {
  return categories
    .filter(item => String(item.parentId) === String(parentId))
    .map(item => ({
      ...item,
      children: buildTree(categories, item._id)
    }));
}

const NavigationMenus = () => {
  const [openMega, setOpenMega] = useState(false);
  const {data:getData} = useGetCategoriesQuery(``);
  const categoriess = getData?.data;
  const categoriesTree:ICategoryTree[] =  buildTree(categoriess || [])
  console.log(categoriesTree);

  return (
    <div className="hidden md:block bg-primary py-2">
      <div className="container py-2 mx-auto">
        <nav className="hidden md:flex items-center justify-center gap-8 relative">
          <Link
            href="/"
            className="text-secondary text-sm font-medium hover:opacity-80 transition"
          >
            Home
          </Link>

          <Link
            href="/shop"
            className="text-secondary text-sm font-medium hover:opacity-80 transition"
          >
            Shop
          </Link>

          {/* Categories */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMega(true)}
            onMouseLeave={() => setOpenMega(false)}
          >
            <Link
              href="/categories"
              className="text-secondary text-sm font-medium inline-flex items-center gap-1 hover:opacity-80 transition"
            >
              Categories
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  openMega ? "rotate-180" : ""
                }`}
              />
            </Link>

            {/* Mega Menu */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50 transition-all duration-300 ${
                openMega
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-3"
              }`}
            >
              <Card className="w-225 border-t-4 border-primary  p-5 shadow-md">
                <div className="grid grid-cols-4 gap-8">
                  {categoriesTree.map((category) => (
                    <div key={category.slug}>
                      {/* Parent */}
                      <Link
                        href={`/shop?category=${category._id}`}
                        className="text-base font-semibold text-gray-900 hover:text-primary transition flex gap-1 items-center"
                      >
                        <Image src={category?.thumbnail || `/${PRODUCT_IMG}`} width={20} height={20} alt={category?.name} className="w-5 h-5 rounded-md" />
                        {category.name}
                      </Link>

                      {/* Child */}
                      <div className="mt-3 space-y-2">
                        {category.children.map((child) => (
                          <Link
                            key={child?._id}
                            href={`/shop?category=${child._id}`}
                            className=" text-sm text-muted-foreground hover:text-primary flex gap-1 items-center transition "
                          >
                            <HandHeart size={14} />
                            {child?.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Banner */}
                <div className="mt-8 rounded-xl bg-linear-to-r from-primary/10 to-primary/5 p-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold">
                      New Summer Collection
                    </h4>

                    <p className="text-sm text-muted-foreground mt-1">
                      Discover trending products with special offers.
                    </p>
                  </div>

                  <Link
                    href="/shop"
                    className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                  >
                    Shop Now
                  </Link>
                </div>
              </Card>
            </div>
          </div>

          <Link
            href="/offers"
            className="text-secondary text-sm font-medium hover:opacity-80 transition"
          >
            Offers
          </Link>

          <Link
            href="/free-shipping"
            className="text-secondary text-sm font-medium hover:opacity-80 transition"
          >
            Free Shipping
          </Link>
          
        
           <Link
            href="/brands"
            className="text-secondary text-sm font-medium hover:opacity-80 transition"
          >
            All Brands
          </Link>
        
           <Link
            href="/contact-us"
            className="text-secondary text-sm font-medium hover:opacity-80 transition"
          >
            Contact Us
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default NavigationMenus;