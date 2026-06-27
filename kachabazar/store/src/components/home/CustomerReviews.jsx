"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const CustomerReviews = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-neutral-50">
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="text-center mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
            What Our Customers Say
          </h2>
        </div>

        <Swiper
          spaceBetween={24}
          centeredSlides={false}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={images.length > 1}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1536: { slidesPerView: 4 },
          }}
          className="customer-reviews-swiper"
        >
          {images.map((src, i) => (
            <SwiperSlide key={i} className="pb-14">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white shadow-sm border border-neutral-100">
                <Image
                  src={src}
                  alt={`Customer review ${i + 1}`}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CustomerReviews;
