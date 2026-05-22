"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void;
  size?: "lg" | "sm";
  readOnly?: boolean;
};

export function StarRating({
  value,
  onChange,
  size = "lg",
  readOnly = false,
}: StarRatingProps) {
  const [hoveredValue, setHoveredValue] = useState(0);
  const activeValue = hoveredValue || value;
  const iconClassName = size === "lg" ? "h-9 w-9" : "h-4 w-4";

  return (
    <div
      className={cn("flex items-center", size === "lg" ? "gap-3" : "gap-1")}
      onMouseLeave={() => setHoveredValue(0)}
    >
      {([1, 2, 3, 4, 5] as const).map((rating) => {
        const isActive = rating <= activeValue;

        return (
          <button
            key={rating}
            type="button"
            aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
            disabled={readOnly}
            className={cn(
              "rounded-md text-[var(--color-muted)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              !readOnly && "hover:scale-105",
            )}
            onMouseEnter={() => !readOnly && setHoveredValue(rating)}
            onClick={() => !readOnly && onChange(rating)}
          >
            <Star
              aria-hidden="true"
              className={cn(
                iconClassName,
                isActive
                  ? "fill-[var(--color-star)] text-[var(--color-star)]"
                  : "fill-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
