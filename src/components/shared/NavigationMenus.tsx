"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Card } from "../ui/card";
import { useGetCategoriesQuery } from "@/redux/service/categories";
import { ICategory } from "@/redux/service/categories/type";

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    children: [
      "Mobiles",
      "Laptops",
      "Smart Watch",
      "Headphones",
      "Camera",
    ],
  },
  {
    name: "Fashion",
    slug: "fashion",
    children: [
      "Men Clothing",
      "Women Clothing",
      "Shoes",
      "Bags",
      "Watches",
    ],
  },
  {
    name: "Home & Living",
    slug: "home-living",
    children: [
      "Furniture",
      "Kitchen",
      "Lighting",
      "Decor",
      "Storage",
    ],
  },
  {
    name: "Beauty",
    slug: "beauty",
    children: [
      "Skin Care",
      "Hair Care",
      "Makeup",
      "Perfume",
      "Tools",
    ],
  },
];

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
    <div className="bg-primary py-2">
      <div className="container mx-auto">
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
              <Card className="w-225 border-t-4 border-foreground  p-5 shadow-md">
                <div className="grid grid-cols-4 gap-8">
                  {categoriesTree.map((category) => (
                    <div key={category.slug}>
                      {/* Parent */}
                      <Link
                        href={`/category/${category.slug}`}
                        className="text-base font-semibold text-gray-900 hover:text-primary transition"
                      >
                        {category.name}
                      </Link>

                      {/* Child */}
                      <div className="mt-4 space-y-2">
                        {category.children.map((child) => (
                          <Link
                            key={child?._id}
                            href={`/shop?category=${child.slug}`}
                            className="block text-sm text-muted-foreground hover:text-primary transition"
                          >
                            {child?.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Banner */}
                <div className="mt-8 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-6 flex items-center justify-between">
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
            href="/shop?category=accessories"
            className="text-secondary text-sm font-medium hover:opacity-80 transition"
          >
            Accessories
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default NavigationMenus;