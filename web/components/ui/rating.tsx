"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface RatingProps {
  max?: number
  initial?: number
  onChange?: (value: number) => void
}

export function RatingStars({ max = 5, initial = 0, onChange }: RatingProps) {
  const [rating, setRating] = useState(initial)

  const handleChange = (value: number) => {
    setRating(value)
    onChange?.(value)
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, index) => {
        const value = index + 1
        return (
          <button
            key={value}
            onClick={() => handleChange(value)}
            className="focus:outline-none"
          >
            <Star
              className={`w-5 h-5 ${
                value <= rating ? "fill-accent text-accent" : "text-muted"
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
