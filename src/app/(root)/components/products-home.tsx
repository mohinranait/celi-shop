"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PRODUCT_IMG } from "@/lib/default-import";
import { HandCoins, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const HomeProducts = () => {
  const [loading, setLoading] = useState(false);
  return (
    <section className=" py-16 px-4">
      <h3 className="text-3xl font-bold text-foreground mb-12 text-center">
        Featured Products
      </h3>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-foreground">Loading products...</p>
        </div>
      ) : 1 > 0 ? (
        <div className=" container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6">
          {[1, 2, 3, 4, 5, , 6, 7].map((product, i) => (
            <Link key={i} href={`/product/${i}`}>
              <Card className="overflow-hidden transition cursor-pointer h-full py-2 px-2">
                <div className="bg-secondary h-48 flex items-center justify-center">
                  <Image
                    width={600}
                    height={300}
                    src={`/${PRODUCT_IMG}`}
                    alt={"product.name"}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    Product name here
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    Short description
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      $100
                    </span>
                    <span className="text-xs bg-secondary text-foreground px-3 py-1 rounded-full">
                      3 variants
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2  items-center gap-3 ">
                  <Button className={"w-full"} variant={"outline"}><ShoppingCart /> Add to cart</Button>
                  <Button className={"w-full"}><HandCoins /> Order Now</Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-foreground">No products available</p>
        </div>
      )}
    </section>
  );
};

export default HomeProducts;
