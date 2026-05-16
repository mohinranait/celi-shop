'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetSlidersQuery } from '@/redux/service/sliders';
import { useGetAppSettingQuery } from '@/redux/service/setting';

const HeroSection = () => {
  const { data } = useGetSlidersQuery(`page=1&limit=10&isDelete=false&status=true`);
  const {data:appSetting} = useGetAppSettingQuery();
  const isBanner = appSetting?.features?.bannerSlider;

  //  Filter valid sliders only ===
  const validSliders = React.useMemo(() => {
    return data?.data?.filter((slide) => {
      if (!slide || !slide.sliderType) return false;

      // if directImage -> Image must have
      if (slide.sliderType === 'directImage') {
        return slide.image;
      }

      // withImage OR withoutImage -> Title must have
      return !!slide.title?.trim();
    }) || [];
  }, [data?.data]);

  if (validSliders.length === 0) {
    return null;
  }



  return isBanner &&  (
    <section>
      <div className="container px-4 md:px-0 pt-4 mx-auto">
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {validSliders.map((slide) => {
                const hasLink = !!slide.link?.trim();

                // ==================== DIRECT IMAGE ====================
                if (slide.sliderType === 'directImage') {
                  return (
                    <CarouselItem key={slide._id}>
                      <div className="relative h-64 lg:h-72 xl:h-125 overflow-hidden rounded-xl">
                        {slide.image && (
                          <Image
                            src={slide.image}
                            alt={slide.title || "Slider Image"}
                            width={1200}
                            height={700}
                            className="object-cover w-full h-full"
                            priority
                          />
                        )}

                        {hasLink && (
                          <Link
                            href={slide.link || '/'}
                            className="absolute inset-0 z-10"
                            aria-label={slide.title}
                          />
                        )}
                      </div>
                    </CarouselItem>
                  );
                }

                // ==================== WITH IMAGE & WITHOUT IMAGE ====================
                const isWithImage = slide.sliderType === 'withImage';

                return (
                  <CarouselItem key={slide._id}>
                    <div
                      className={`relative h-64 lg:h-72 xl:h-125 flex items-center rounded-xl overflow-hidden
                        ${isWithImage 
                          ? 'bg-cover bg-center' 
                          : 'bg-linear-to-r from-foreground/87 to-primary/90'}`}
                      style={
                        isWithImage && slide.image
                          ? { backgroundImage: `url(${slide.image})` }
                          : undefined
                      }
                    >
                      {/* Overlay */}
                      {isWithImage && <div className="absolute inset-0 bg-black/40" />}

                      <div className=" mx-auto px-6 relative z-10">
                        <div className="max-w-3xl text-center mx-auto">
                          <h2 className="text-3xl lg:text-4xl xl:text-6xl 2xl:text-7xl font-bold mb-2 xl:mb-6 text-white drop-shadow-lg">
                            {slide.title}
                          </h2>

                          {slide.description && (
                            <p className="text-base lg:text-lg xl:text-xl mb-4 xl:mb-8 text-white/90 max-w-2xl mx-auto">
                              {slide.description}
                            </p>
                          )}

                          {slide.buttonName && hasLink && (
                            <Link href={slide.link || '/'}>
                              <Button
                                size="lg"
                                className="bg-white text-black hover:bg-white/90 text-base font-semibold px-8 py-2 2xl:py-6"
                              >
                                {slide.buttonName}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Navigation Buttons */}
            {validSliders.length > 1 && (
              <>
                <CarouselPrevious className="left-4 md:left-8 bg-white/90 hover:bg-white text-black border-0" />
                <CarouselNext className="right-4 md:right-8 bg-white/90 hover:bg-white text-black border-0" />
              </>
            )}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;