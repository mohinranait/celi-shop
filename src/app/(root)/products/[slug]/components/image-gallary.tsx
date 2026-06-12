"use client";

import { IProduct } from "@/redux/service/products/type";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PRODUCT_IMG } from "@/lib/default-import";

type Props = {
  product: IProduct;
  images: string[];
  stock: number;
};

const ImageGallery = ({ product, images, stock }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [lightboxApi, setLightboxApi] = useState<CarouselApi>();

  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // zoom
  const [zoomed, setZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50,
  });

  const imageRef = useRef<HTMLDivElement | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                               MAIN CAROUSEL                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    onSelect();

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // variant switch / images change
  useEffect(() => {
    if (!api) return;

    api.scrollTo(0, true);
  }, [images, api]);

  /* -------------------------------------------------------------------------- */
  /*                             LIGHTBOX CAROUSEL                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!lightboxApi) return;

    lightboxApi.scrollTo(current, true);
  }, [current, lightboxApi]);

  useEffect(() => {
    if (!lightboxApi) return;

    const onSelect = () => {
      const index = lightboxApi.selectedScrollSnap();

      setCurrent(index);
      api?.scrollTo(index);
    };

    lightboxApi.on("select", onSelect);

    return () => {
      lightboxApi.off("select", onSelect);
    };
  }, [lightboxApi, api]);

  /* -------------------------------------------------------------------------- */
  /*                                  KEYBOARD                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      }

      if (e.key === "ArrowRight") {
        lightboxApi?.scrollNext();
      }

      if (e.key === "ArrowLeft") {
        lightboxApi?.scrollPrev();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxApi, lightboxOpen]);

  /* -------------------------------------------------------------------------- */
  /*                                    ZOOM                                    */
  /* -------------------------------------------------------------------------- */

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();

      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setZoomPosition({ x, y });
    },
    []
  );

  return (
    <>
      <div className="flex flex-col gap-3">

        <div className="sticky top-48">
          {/* ------------------------------------------------------------------- */}
          {/*                            MAIN IMAGE                               */}
          {/* ------------------------------------------------------------------- */}


          <div className=" relative  ">

            {
              stock === 0 &&
              <div className="w-37.5 h-37.5 absolute overflow-hidden -top-2.5 -right-2.5  z-30">
                <span className="h-2.75 w-3 bg-red-700 absolute top-0 left-0"></span>
                <span className="h-3 w-2.75 bg-red-700 absolute bottom-0 right-0"></span>
                <span className="w-56.25 py-2.5 rotate-45 top-7.5 -left-6.25  absolute  border-l-0 text-center text-lg uppercase bg-[#ff115e] text-white before:w-0 before:h-0 before:border-l-4 before:border-red-600 before:rotate-45 before:absolute before:left-6.5 before:-bottom-1 before:bg-[#e9034c] font-semibold">Stock Out</span>
              </div>
            }
            <div className="relative overflow-hidden rounded-2xl border bg-muted group">

              {/* STOCK OVERLAY */}

              {stock === 0 && (
                <>
                  <div className="absolute inset-0 z-20 bg-black/40" />

                  <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <span className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black shadow-xl">
                      Out Of Stock
                    </span>
                  </div>

                </>
              )}

              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="ml-0">
                  {images?.length === 0 ? <CarouselItem
                    
                      className="pl-0"
                    >
                      <div
                       
                    
                       
                        className={`relative rounded-2xl aspect-square overflow-hidden cursor-zoom-in`}
                        style={
                          { transform: "scale(1)",
                              transition: "transform .3s ease",}
                        }
                      >
                        <Image
                          src={`/${PRODUCT_IMG}`}
                          alt={`${product?.name}`}
                          fill
                          className="object-cover"
                          sizes="(max-width:768px) 100vw, 50vw"
                        />
                      </div>
                    </CarouselItem>  : images.map((img, index) => (
                    <CarouselItem
                      key={`${img}-${index}`}
                      className="pl-0"
                    >
                      <div
                        ref={index === current ? imageRef : undefined}
                        onClick={() => setLightboxOpen(true)}
                        onMouseEnter={() => setZoomed(true)}
                        onMouseLeave={() => setZoomed(false)}
                        onMouseMove={
                          index === current ? handleMouseMove : undefined
                        }
                        className={`relative rounded-2xl aspect-square overflow-hidden ${zoomed
                          ? "cursor-zoom-out"
                          : "cursor-zoom-in"
                          }`}
                        style={
                          zoomed && index === current
                            ? {
                              transform: "scale(1.7)",
                              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                              transition: "transform .12s ease",
                            }
                            : {
                              transform: "scale(1)",
                              transition: "transform .3s ease",
                            }
                        }
                      >
                        <Image
                          src={img || `/${PRODUCT_IMG}`}
                          alt={`${product?.name}-${index}`}
                          fill
                          priority={index === 0}
                          className="object-cover"
                          sizes="(max-width:768px) 100vw, 50vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* ARROWS */}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => api?.scrollPrev()}
                    className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 text-black shadow-lg opacity-0 transition-all group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => api?.scrollNext()}
                    className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 text-black shadow-lg opacity-0 transition-all group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* ZOOM ICON */}

              <div className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur transition-all group-hover:opacity-100">
                <ZoomIn className="h-4 w-4" />
              </div>

              {/* IMAGE COUNT */}

              {images.length > 1 && (
                <div className="absolute left-3 top-3 z-20 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  {current + 1} / {images.length}
                </div>
              )}

              {/* DOTS */}

              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={`transition-all duration-200 rounded-full ${current === index
                        ? "w-5 h-2 bg-white"
                        : "w-2 h-2 bg-white/50 hover:bg-white"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/*                              THUMBNAILS                             */}
          {/* ------------------------------------------------------------------- */}

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">

              {images.map((img, index) => (
                <button
                  key={`thumb-${index}`}
                  onClick={() => api?.scrollTo(index)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${current === index
                    ? "scale-105 border-black shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`thumb-${index}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />

                  {current === index && (
                    <span className="absolute inset-0 ring-2 ring-black rounded-xl" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/*                               LIGHTBOX                                */}
      {/* --------------------------------------------------------------------- */}

      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
        >

          {/* CLOSE */}

          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {/* COUNT */}

          <div className="absolute left-4 top-4 z-50 text-sm text-white/80">
            {current + 1} / {images.length}
          </div>

          {/* CONTENT */}

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mx-14 w-full max-w-5xl"
          >
            <Carousel
              setApi={setLightboxApi}
              opts={{
                loop: true,
                startIndex: current,
              }}
              className="w-full"
            >
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[80vh] w-full">
                      <Image
                        src={img}
                        alt={`${product?.name}-${index}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* LIGHTBOX ARROWS */}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => lightboxApi?.scrollPrev()}
                  className="absolute -left-12 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={() => lightboxApi?.scrollNext()}
                  className="absolute -right-12 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* LIGHTBOX THUMBNAILS */}

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex max-w-[90vw] -translate-x-1/2 gap-2 overflow-x-auto px-2">
              {images.map((img, index) => (
                <button
                  key={`light-thumb-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    lightboxApi?.scrollTo(index);
                  }}
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${current === index
                    ? "scale-110 border-white"
                    : "border-white/30 opacity-50 hover:opacity-90"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`light-thumb-${index}`}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageGallery;