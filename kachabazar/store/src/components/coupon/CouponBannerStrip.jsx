"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { getShowingCoupons } from "@services/CouponServices";

const CouponBannerStrip = () => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { coupons } = await getShowingCoupons();
        if (!coupons || coupons.length === 0) {
          setItems([]);
          return;
        }
        const active = coupons.filter(
          (c) => c.logo && !dayjs().isAfter(dayjs(c.endTime))
        );
        setItems(active.length > 0 ? active : []);
      } catch {
        setItems([]);
      }
    })();
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full bg-foreground/5 border-y border-border/40">
      <div className="mx-auto max-w-screen-2xl px-1 sm:px-10">
        <Swiper
          spaceBetween={8}
          centeredSlides={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={items.length > 1}
          modules={[Autoplay]}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {items.map((coupon) => (
            <SwiperSlide key={coupon._id}>
              <Link
                href="/offers"
                className="relative block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group max-sm:aspect-[160/60] aspect-[200/100]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${coupon.logo})` }}
                />
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors" />
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center px-2 sm:px-3"
                  style={{
                    color: coupon.textColor || "#FFFFFF",
                    fontFamily: coupon.fontFamily || "inherit",
                  }}
                >
                  <span className="text-[8px] sm:text-[10px] font-medium leading-tight text-center mb-px">
                    {coupon.title?.en || ""}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold tracking-wide">
                    {coupon.couponCode}
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CouponBannerStrip;
