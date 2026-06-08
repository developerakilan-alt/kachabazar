"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const CarouselCard = ({ storeCustomizationSetting, sliderData }) => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      loop={true}
      pagination={
        (storeCustomizationSetting?.slider?.bottom_dots ||
          storeCustomizationSetting?.slider?.both_slider) && {
          clickable: true,
        }
      }
      navigation={
        (storeCustomizationSetting?.slider?.left_right_arrow ||
          storeCustomizationSetting?.slider?.both_slider) && {
          clickable: true,
        }
      }
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {sliderData?.map((item, i) => (
        <SwiperSlide
          className="h-full relative rounded-lg overflow-hidden dark:bg-background"
          key={i + 1}
        >
          <div className="text-sm text-muted-foreground hover:text-primary dark:bg-background">
            <Image
              width={950}
              height={400}
              src={item.image}
              alt={item.title}
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute top-0 left-0 z-10 p-r-16 flex-col flex w-full h-full place-items-start justify-center">
            <div className="pl-4 pr-12 sm:pl-10 sm:pr-16 w-10/12 lg:w-8/12 xl:w-7/12">
              <h1 className="mb-2  text-xl sm:text-lg md:text-2xl line-clamp-1 md:line-clamp-none  lg:line-clamp-none  lg:text-3xl font-bold text-foreground">
                {item.title}
              </h1>
              <p className="text-base leading-6 text-muted-foreground font-sans line-clamp-1  md:line-clamp-none lg:line-clamp-none">
                {item.info}
              </p>
              <Link
                href={item.url}
                className="hidden sm:inline-block lg:inline-block text-sm leading-6 font-medium mt-6 px-6 py-2 bg-primary text-center rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {item.buttonName}
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CarouselCard;
