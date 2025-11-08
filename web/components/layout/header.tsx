"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header
      className={cn(
        "w-full bg-secondary text-secondary-foreground shadow-sm sticky top-0 z-50"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-wide text-white">
            CE Sports
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-end gap-8 ml-auto text-right">
          <Link
            href="/campeonatos"
            className="text-sm font-medium text-white/90 hover:text-accent transition-colors"
          >
            Campeonatos
          </Link>
          <Link
            href="/projetos"
            className="text-sm font-medium text-white/90 hover:text-accent transition-colors"
          >
            Projetos
          </Link>
          <Link
            href="/noticia"
            className="text-sm font-medium text-white/90 hover:text-accent transition-colors"
          >
            Notícias
          </Link>
          <Link
            href="/contato"
            className="text-sm font-medium text-white/90 hover:text-accent transition-colors"
          >
            Contato
          </Link>

          <Link href="/login">
          <Button variant="primary" size="sm" className="ml-2">
            Login
          </Button>
          </Link>

        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-accent"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden bg-secondary text-white flex flex-col items-center gap-4 py-4 border-t border-border animate-fade-in">
          <Link href="/campeonatos" onClick={() => setIsOpen(false)}>
            Campeonatos
          </Link>
          <Link href="/projetos" onClick={() => setIsOpen(false)}>
            Projetos
          </Link>
          <Link href="/noticias" onClick={() => setIsOpen(false)}>
            Notícias
          </Link>

          <Link href="/login">
          <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>
            Login
          </Button>
          </Link>
        </nav>
      )}
    </header>
  )
}
