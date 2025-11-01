import * as React from "react"
import { cn } from "@/lib/utils"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md",
        className
      )}
      {...props}
    />
  )
}
