"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiFetch("/auth/me")

        if (data?.user) {
          setUserName(data.user.nome || data.user.email)
          setIsAdmin(data.user.role === "ROLE_ADMIN")
        } else {
          setUserName(null)
        }
      } catch (e) {
        console.error("Erro no /auth/me", e)
        setUserName(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" })
    } catch {}
    finally {
      setUserName(null)
      router.push("/login")
    }
  }

  return (
    <header className={cn("w-full bg-secondary text-secondary-foreground shadow-sm sticky top-0 z-50")}>
      <div className="container mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="text-lg font-bold tracking-wide select-none">CE Sports</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 ml-auto">
          {!loading && userName ? (
            <>
              <Link href="/campeonatos" className="text-sm hover:text-accent transition-colors">Campeonatos</Link>
              <Link href="/projetos" className="text-sm hover:text-accent transition-colors">Projetos</Link>
              <Link href="/noticias" className="text-sm hover:text-accent transition-colors">Notícias</Link>
              <Link href="/contato" className="text-sm hover:text-accent transition-colors">Contato</Link>

              {isAdmin && (
                <Link href="/admin" className="text-sm hover:text-accent transition-colors">Painel Admin</Link>
              )}

              <div className="flex items-center gap-4 text-white ml-6">
                <span className="font-medium select-text">👋 {userName}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-white hover:bg-blue-800 transition-colors"
                >
                  <LogOut size={16} /> Sair
                </Button>
              </div>
            </>
          ) : (
            !loading && (
              <Link href="/login"  className="ml-2">
                <Button variant="primary" size="sm">Login</Button>
              </Link>
            )
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-accent focus:outline-none"
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden bg-secondary text-white flex flex-col items-center gap-4 py-4 border-t">
          {!loading && userName ? (
            <>
              <Link href="/campeonatos" onClick={() => setIsOpen(false)} className="w-full text-center py-2 hover:text-accent transition-colors">
                Campeonatos
              </Link>
              <Link href="/projetos" onClick={() => setIsOpen(false)} className="w-full text-center py-2 hover:text-accent transition-colors">
                Projetos
              </Link>
              <Link href="/noticias" onClick={() => setIsOpen(false)} className="w-full text-center py-2 hover:text-accent transition-colors">
                Notícias
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 text-sm hover:text-accent transition-colors"
                >
                  Painel Admin
                </Link>
              )}

              <span className="font-medium py-2 select-text">{userName}</span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleLogout()
                  setIsOpen(false)
                }}
                className="w-full"
              >
                <LogOut size={16} /> Sair
              </Button>
            </>
          ) : (
            !loading && (
              <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="primary" size="sm" className="w-full">Login</Button>
              </Link>
            )
          )}
        </nav>
      )}
    </header>
  )
}
