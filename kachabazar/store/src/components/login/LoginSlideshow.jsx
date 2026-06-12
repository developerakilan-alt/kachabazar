"use client";

import { useState, useEffect, useCallback } from "react";

const PLACEHOLDER =
  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

const LoginSlideshow = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const [catRes, prodRes] = await Promise.all([
          fetch(`${baseUrl}/category/show`),
          fetch(`${baseUrl}/products/store`),
        ]);

        const { categories } = await catRes.json();
        const { products } = await prodRes.json();

        if (!categories?.length) return;

        const allCategories = categories.flatMap((c) => [
          c,
          ...(c.children || []),
        ]);

        const slides = allCategories
          .slice(0, 8)
          .map((cat) => {
            const product = (products || []).find((p) => {
              const pid =
                typeof p.category === "string" ? p.category : p.category?._id;
              const cid =
                typeof cat._id === "string" ? cat._id : cat._id?.toString();
              return pid === cid;
            });

            const img =
              product?.image?.[0]?.src ||
              product?.image?.[0] ||
              product?.image ||
              cat?.icon ||
              PLACEHOLDER;

            return { src: img, name: cat.name?.en || "" };
          })
          .filter((s) => s.src && s.src !== PLACEHOLDER);

        if (slides.length > 0) setImages(slides);
      } catch {
        // fallback
      }
    };

    fetchData();
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    if (images.length < 2) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [images.length, next]);

  if (!images.length) {
    return (
      <div className="h-full min-h-[500px] rounded-2xl bg-gradient-to-br from-neutral-100 to-stone-100 dark:from-neutral-800 dark:to-stone-900 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
            Imitation Jwels for Elegance
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Designed perfect for everyday wear and special occasions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800">
      {images.map((item, i) => (
        <img
          key={i}
          src={item.src}
          alt={item.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

      <div className="absolute bottom-8 left-8 right-8">
        {images[currentIndex]?.name && (
          <p className="text-white text-lg font-semibold tracking-wide mb-3">
            {images[currentIndex].name}
          </p>
        )}
        <div className="flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? "bg-white w-8" : "bg-white/40 w-1.5"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginSlideshow;
