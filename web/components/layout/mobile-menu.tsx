"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden fixed top-4 right-4 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md border border-border bg-background/80 backdrop-blur-md"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-48 rounded-lg border border-border bg-background shadow-lg flex flex-col"
          )}
        >
          <Link
            href="/"
            className="px-4 py-3 text-sm hover:bg-secondary/20"
            onClick={() => setOpen(false)}
          >
            Início
          </Link>
          <Link
            href="/sobre"
            className="px-4 py-3 text-sm hover:bg-secondary/20"
            onClick={() => setOpen(false)}
          >
            Sobre
          </Link>
          <Link
            href="/programas"
            className="px-4 py-3 text-sm hover:bg-secondary/20"
            onClick={() => setOpen(false)}
          >
            Programas
          </Link>
          <Link
            href="/contato"
            className="px-4 py-3 text-sm hover:bg-secondary/20"
            onClick={() => setOpen(false)}
          >
            Contato
          </Link>
        </div>
      )}
    </div>
  )
}
