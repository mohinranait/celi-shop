"use client";
import ProductCard from "@/components/products/ProductCard";

import { useGetProductsQuery } from "@/redux/service/products";


const HomeProducts = () => {
 
  const {data, isLoading} = useGetProductsQuery(`page=1&limit=8`);
  const products = data?.data;

  return (
    <section className=" py-16 px-4">
      <h3 className="text-3xl font-bold text-foreground mb-12 text-center">
        Featured Products
      </h3>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-foreground">Loading products...</p>
        </div>
      ) : products && products?.length > 0 ? (
        <div className=" container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6">
          {products?.map((product, i) => <ProductCard key={i} product={product} /> )}
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
