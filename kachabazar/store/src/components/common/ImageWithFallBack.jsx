"use client";
import { useState, useEffect } from "react";

const fallbackImage =
  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

const ImageWithFallback = ({
  src,
  fallback = fallbackImage,
  alt = "image",
  fill,
  priority,
  sizes,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  const nativeProps = {};
  if (fill) {
    nativeProps.style = {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      ...(props.style || {}),
    };
  } else {
    if (props.width) nativeProps.width = props.width;
    if (props.height) nativeProps.height = props.height;
    nativeProps.style = { objectFit: "cover", ...(props.style || {}) };
  }
  if (priority) nativeProps.fetchPriority = "high";
  if (sizes) nativeProps.sizes = sizes;

  return (
    <img
      src={imgSrc}
      onError={() => setImgSrc(fallback)}
      alt={alt}
      loading={priority ? "eager" : props.loading || "lazy"}
      className={`object-cover transition duration-150 ease-linear transform group-hover:scale-105 ${
        props.className || ""
      }`}
      {...nativeProps}
    />
  );
};

export default ImageWithFallback;
