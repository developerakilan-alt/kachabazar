import React from "react";
import { FiStar } from "react-icons/fi";

const Rating = ({
  rating = 4.5,
  totalReviews = 128,
  size = "sm",
  showReviews = true,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSize =
    size === "lg" ? "w-5 h-5" : size === "sm" ? "w-4 h-4" : "w-3 h-3";
  const textSize =
    size === "lg" ? "text-base" : size === "sm" ? "text-sm" : "text-xs";

  return null;
};

export default Rating;
