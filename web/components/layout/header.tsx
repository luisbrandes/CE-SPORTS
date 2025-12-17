"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Verifica se há usuário logado ao carregar
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiFetch("/auth/me");
        if (data?.user) {
          setUserName(data.user.nome || data.user.email || "Usuário");
        } else {
          setUserName(null);
        }
      } catch {
        setUserName(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // ignora erro
    } finally {
      setUserName(null);
      router.push("/login");
    }
  };

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

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center justify-end gap-8 ml-auto text-right">
          {!loading && userName ? (
            <>
              <Link
                href="/aluno/campeonatos"
                className="text-sm font-medium text-white/90 hover:text-accent transition-colors"
              >
                Campeonatos
              </Link>
              <Link
                href="/aluno/equipes"
                className="text-sm font-medium text-white/90 hover:text-accent transition-colors"
              >
                Equipes
              </Link>
              <Link
                href="/projetos"
                className="text-sm font-medium text-white/90 hover:text-accent transition-colors"
              >
                Projetos
              </Link>
              <Link
                href="/noticias"
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

              {/* Nome + Logout */}
              <div className="flex items-center gap-3 text-white">
                <span className="font-medium">👋 {userName}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-white hover:bg-blue-800"
                >
                  <LogOut size={16} />
                  Sair
                </Button>
              </div>
            </>
          ) : (
            // 🔹 Apenas botão de login se não estiver logado
            !loading && (
              <Link href="/login">
                <Button variant="primary" size="sm" className="ml-2">
                  Login
                </Button>
              </Link>
            )
          )}
        </nav>

        {/* Botão Menu Mobile */}
        <button
          className="md:hidden text-accent"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navegação Mobile */}
      {isOpen && (
        <nav className="md:hidden bg-secondary text-white flex flex-col items-center gap-4 py-4 border-t border-border animate-fade-in">
          {!loading && userName ? (
            <>
              <Link href="/campeonatos" onClick={() => setIsOpen(false)}>
                Campeonatos
              </Link>
              <Link href="/projetos" onClick={() => setIsOpen(false)}>
                Projetos
              </Link>
              <Link href="/noticias" onClick={() => setIsOpen(false)}>
                Notícias
              </Link>
              <span className="font-medium">{userName}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                <LogOut size={16} />
                Sair
              </Button>
            </>
          ) : (
            !loading && (
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="primary" size="sm">
                  Login
                </Button>
              </Link>
            )
          )}
        </nav>
      )}
    </header>
  );
}
