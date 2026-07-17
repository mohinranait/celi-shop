'use client'
import { PRODUCT_IMG } from '@/lib/default-import';
import { useGetCategoriesQuery } from '@/redux/service/categories';
import { ICategory } from '@/redux/service/categories/type';
import Image from 'next/image';
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SectionHeader from '@/components/shared/SectionHeader';



const CategoryCard = ({ category }: { category: ICategory }) => {
  return (
    <div className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-background  transition-all duration-200 cursor-pointer">
      <div className="  rounded-lg h-40 bg-transparent  w-full border-border mb-4 flex items-center justify-center overflow-hidden shrink-0">
        <Link href={`/shop?category=${category?._id}`}>
          <div className="">
            <Image
              src={category?.thumbnail || `/${PRODUCT_IMG}`}
              width={106}
              height={106}
              alt={category.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </Link>

      </div>
      <div className="text-center">
        <Link href={`/shop?category=${category?._id}`}>
          <p className="text-base font-semibold text-foreground line-clamp-2">
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

const Categories = () => {
  const { data, isLoading } = useGetCategoriesQuery('page=1&limit=20&isDelete=false&status=true');
  const categories = data?.data || [];

  const finalCategories = categories?.filter(cat => cat.thumbnail)
  return (
    <section>
      <div className="container mx-auto py-10 px-4">
      <SectionHeader title='Popular category'description="Explore your popular category, you can visit this." seeAllLink='/categories' seeAllText='All Categories' className='pb-4' />
      
        {
          isLoading ? <div className="container mx-auto grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
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
                      className="pl-2 md:pl-3 basis-1/2 sm:basis-1/3  lg:basis-1/4 xl:basis-1/5 "
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
  )
}

export default Categories