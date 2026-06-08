"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import DiscountedCard from "@components/product/DiscountedCard";

const ModernHero = ({ discountedProducts, attributes }) => {
  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 mt-4 md:mt-8 mb-8 relative z-0">
      <div className="relative w-full overflow-hidden rounded-lg min-h-[450px] sm:min-h-[550px] lg:min-h-[580px] flex items-center justify-center"
           style={{ background: "linear-gradient(180deg, #34d399 0%, #f5f5f5  50%, #f1f5f9 100%)" }}>
        
        {/* Large Background Text */}
        <div className="absolute top-8 sm:top-12 lg:top-16 left-0 w-full flex justify-center text-center pointer-events-none select-none z-0">
          <h1 
            className="text-[100px] sm:text-[140px] md:text-[180px] lg:text-[240px] xl:text-[280px] font-serif font-black text-primary/8 leading-[0.6] tracking-tighter relative drop-shadow-sm"
            style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
          >
            Fresh
            <span className="relative inline-block">
              M
            </span>
            art
          </h1>
        </div>

        {/* Small sparks/stars */}
        <div className="absolute top-[25%] left-[10%] lg:left-[15%] text-[#A6E161] z-0 animate-pulse">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L1 11l8.5-2.5z"/></svg>
        </div>
        <div className="absolute bottom-[20%] lg:bottom-[30%] right-[10%] lg:right-[15%] text-[#A6E161] z-0 scale-75 animate-pulse delay-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L1 11l8.5-2.5z"/></svg>
        </div>

        {/* Wavy background lines (subtle decoration) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none z-0">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0 20 Q 25 40 50 20 T 100 20 L 100 0 L 0 0 Z" fill="white" />
            </svg>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full h-full min-h-[500px] sm:min-h-[600px] lg:min-h-[640px] flex flex-col lg:flex-row items-center lg:items-end lg:justify-between px-6 sm:px-12 lg:px-20 pb-12 lg:pb-0 pt-16 sm:pt-24 lg:pt-0">
          
          {/* Left Text and CTA */}
          <div className="lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left pt-0 lg:pb-24 order-2 lg:order-1 mt-auto lg:mt-0 z-30">
            <p className="text-[#0E3A24] font-medium text-sm sm:text-base lg:text-lg mb-6 max-w-[280px] sm:max-w-xs leading-relaxed drop-shadow-sm">
              Shop from thousands of farm-fresh fruits, vegetables, dairy, and daily essentials at unbeatable prices.
            </p>
            <Link href="/search?category=fresh-vegetables">
              <button className="bg-primary hover:bg-primary/80 text-white rounded-full pl-6 pr-2 py-2 flex items-center justify-between gap-4 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <span className="text-sm md:text-base">Shop Now</span>
                <span className="bg-white text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </span>
              </button>
            </Link>
          </div>

          {/* Center Image */}
          <div className="lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 w-[85%] sm:w-[350px] md:w-[400px] lg:w-[480px] xl:w-[550px] flex justify-center items-end order-1 lg:order-2 z-20 pointer-events-none mt-10 lg:mt-0">
             {/* Using a placeholder remote image that matches the context, if unavailable it will fallback. Assuming we use an img tag to bypass next/image configuration barriers for external URLs temporarily */}
             <img 
               src="https://i.ibb.co.com/XxFqFFtT/hero-shopping-img.png" 
               alt="Delivery Person" 
               className="w-full h-auto object-contain drop-shadow-2xl max-h-[400px] lg:max-h-[600px] object-bottom"
             />
          </div>

          {/* Right Floating Card Slider */}
          <div className="hidden lg:flex lg:w-[280px] xl:w-[280px] justify-end items-end pb-6 lg:pb-12 order-3 z-30">
            {discountedProducts?.length > 0 ? (
              <div className="w-full">
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                  }}
                  modules={[Autoplay]}
                >
                  {discountedProducts.slice(0, 5).map((product) => (
                    <SwiperSlide key={product._id} className="bg-transparent pb-3">
                      <DiscountedCard product={product} attributes={attributes} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModernHero;
