'use client';
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

import {
  Star,
  Quote,
} from "lucide-react";
import { useGetCommentsQuery } from "@/redux/service/comments";





export default function CustomerReviews() {

  const { data } = useGetCommentsQuery(`page=1&limit=10&isFeature=true&isApproved=true`);

  const comments = data?.data || [];



  return (
    <section className="py-20">

      <div className="container mx-auto">

        <div className="text-center mb-14">

          <p className="text-primary font-semibold">
            Customer Reviews
          </p>


          <h2 className="text-4xl font-bold mt-3">
            What Our Clients Say About Us
          </h2>

        </div>


        <div className="relative">
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}

            className="w-full"
          >
            <CarouselContent className="-ml-2 py-1 md:-ml-3">
              {comments.map((review, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-2   md:basis-1/2  xl:basis-1/3 "
                >
                  <div className="relative min-h-62 bg-white border border-border mx-1 rounded-md">

                    <div className="p-6">

                      <Quote className="  text-primary/30  mb-4  "   />

                      <p className="text-muted-foreground mb-5">
                        {review.comment}
                      </p>


                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 md:w-4 h-3 md:h-4 ${i < Math.floor(review.rating)
                            ? 'text-yellow-400 fill-yellow-200'
                            : 'text-muted-foreground'
                            }`} />
                        ))}

                      </div>


                      <div>
                        <h4 className="font-bold">
                          {review?.userId?.name}
                        </h4>

                        <p className="text-sm text-muted-foreground">
                          Customer
                        </p>
                      </div>


                    </div>


                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className=" bg-primary w-8 h-8 text-white lg:w-10 lg:h-10  flex left-2  lg:left-2" />
            <CarouselNext className=" bg-primary w-8 h-8 text-white lg:w-10 lg:h-10  flex right-2  lg:right-2" />
          </Carousel>
        </div>




      </div>

    </section>
  );
}