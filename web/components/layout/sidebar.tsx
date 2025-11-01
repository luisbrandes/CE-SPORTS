"use client"

import Link from "next/link"
import { Dumbbell, Users, Settings, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Dumbbell },
    { href: "/admin/usuarios", label: "Usuários", icon: Users },
    { href: "/admin/config", label: "Configurações", icon: Settings },
  ]

  return (
    <aside className="flex flex-col justify-between h-full">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <Dumbbell className="h-6 w-6 text-accent" />
          <span className="font-semibold text-primary">CE Sports</span>
        </div>

        {/* Navegação */}
        <nav className="mt-6 flex flex-col gap-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 text-sm font-medium hover:bg-accent/10 hover:text-accent transition-colors",
                pathname === href
                  ? "text-accent font-semibold"
                  : "text-primary/70"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={onNavigate}
        className="flex items-center gap-3 px-6 py-4 text-sm text-primary/60 hover:text-destructive transition"
      >
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  )
}
