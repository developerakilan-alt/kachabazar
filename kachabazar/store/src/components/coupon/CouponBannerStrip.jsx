import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

import { getShowingCoupons } from "@services/CouponServices";

const CouponBannerStrip = async () => {
  const { coupons } = await getShowingCoupons();

  if (!coupons || coupons.length === 0) return null;

  const activeCoupons = coupons.filter(
    (c) => c.logo && !dayjs().isAfter(dayjs(c.endTime))
  );

  if (activeCoupons.length === 0) return null;

  const items = [...activeCoupons, ...activeCoupons];

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-primary/5 via-accent-amber/10 to-primary/5 border-b border-border/40">
      <div className="group relative flex overflow-x-hidden py-2.5">
        <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
          {items.map((coupon, idx) => (
            <Link
              key={`${coupon._id}-${idx}`}
              href="/offers"
              className="flex items-center gap-3 mx-4 shrink-0 rounded-lg bg-background/80 px-3 py-1.5 shadow-sm hover:bg-background transition-colors"
            >
              {coupon.logo && (
                <div className="relative h-9 w-20 overflow-hidden rounded border border-border/40 shrink-0">
                  <Image
                    src={coupon.logo}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}
              <span className="text-sm font-bold text-red-500">
                {coupon.discountType?.type === "fixed"
                  ? `$${coupon.discountType?.value} OFF`
                  : `${coupon.discountType?.value}% OFF`}
              </span>
              <span className="text-xs text-muted-foreground max-w-[120px] truncate">
                {coupon.title?.en || ""}
              </span>
              <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold">
                {coupon.couponCode}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponBannerStrip;
