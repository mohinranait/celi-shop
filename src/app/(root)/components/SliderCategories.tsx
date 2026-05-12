'use client';
import { useGetCategoriesQuery } from '@/redux/service/categories';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { PRODUCT_IMG } from "@/lib/default-import";
import { ICategory } from '@/redux/service/categories/type';
import Link from 'next/link';



const CategoryCard = ({ category }: { category: ICategory }) => {
  return (
    <div className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-border bg-background hover:bg-muted hover:border-foreground/20 transition-all duration-200 cursor-pointer">
      <div className="w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
        <Image
          src={category?.thumbnail || `/${PRODUCT_IMG}`}
          width={56}
          height={56}
          alt={category.name}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <div className="text-center">
        <Link href={`/shop?category=${category?._id}`}>
          <p className="text-sm font-medium text-foreground leading-tight line-clamp-2">
            {category.name}
          </p>
        </Link>

        <p className="text-xs text-muted-foreground mt-0.5">
          12 items
        </p>

      </div>
    </div>
  );
};

const SliderCategories = () => {
  const { data, isLoading } = useGetCategoriesQuery('page=1&limit=20&isDelete=false&status=true');
  const categories = data?.data || [];

  const finalCategories = categories?.filter( cat => cat.thumbnail)

  return (
    <section className=" mx-auto py-16 px-4">
      <div className='container mx-auto'>
        <h3 className="text-3xl font-bold text-foreground mb-12 text-center">
          Shop by Category
        </h3>


        {
          isLoading ? <div className="container mx-auto grid grid-cols-2 md:grid-cols-3  lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
            ))}
          </div> : finalCategories?.length === 0 ? <div className='h-20 flex items-center justify-center'>Category not found</div> : 
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-3">
                  {finalCategories.map((category) => (
                    <CarouselItem
                      key={category._id}
                      className="pl-2 md:pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                    >
                      <CategoryCard category={category} />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="hidden sm:flex left-2 lg:left-2" />
                <CarouselNext className="hidden sm:flex right-2 lg:right-2" />
              </Carousel>
            </div>
        }

      </div>
    </section>
  );
};

export default SliderCategories;