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
import SectionHeader from '@/components/shared/SectionHeader';



const CategoryCard = ({ category }: { category: ICategory }) => {
  return (
    <div className="group  flex flex-col items-center gap-3 rounded-2xl bg-background transition-all duration-200 cursor-pointer">
      <div className="inset-0 w-full max-w-32 max-h-32  aspect-square rounded-full  bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
        <Link href={`/shop?category=${category?._id}`} className='w-full h-full'>
          <Image
            src={category?.thumbnail || `/${PRODUCT_IMG}`}
            width={180}
            height={180}
            alt={category.name}
            className="w-full h-full rounded-full object-cover   border-8 border-white overflow-hidden"
          />
        </Link>
      </div>
      <div className="text-center">
        <Link href={`/shop?category=${category?._id}`}>
          <p className="text-sm font-medium text-foreground leading-tight line-clamp-2">
            {category.name}
          </p>
        </Link>

        <p className="text-xs text-muted-foreground mt-0.5">
          {category?.totalProducts || 0} items
        </p>

      </div>
    </div>
  );
};

const SliderCategories = () => {
  const { data, isLoading } = useGetCategoriesQuery('page=1&limit=20&isDelete=false&status=true');
  const categories = data?.data || [];

  const finalCategories = categories?.filter(cat => cat.thumbnail)

  return (
    <section className=" mx-auto py-3 md:py-6 lg:pt-10 px-4">

      <div className='container mx-auto'>
        <SectionHeader title='Popular category' description="Explore your popular category, you can visit this." seeAllLink='/categories' seeAllText='All Categories' className='pb-2 md:pb-4' />

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
                      className="pl-2 md:pl-3 basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/7"
                    >
                      <CategoryCard category={category} />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className=" bg-primary w-8 h-8 text-white lg:w-10 lg:h-10  flex left-2 top-16 lg:left-2" />
                <CarouselNext className=" bg-primary w-8 h-8 text-white lg:w-10 lg:h-10  flex right-2 top-16 lg:right-2" />
              </Carousel>
            </div>
        }

      </div>
    </section>
  );
};

export default SliderCategories;