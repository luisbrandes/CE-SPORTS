import Link from "next/link"
import { Dumbbell } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-8 text-muted-foreground">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/privacidade" className="hover:text-accent transition-colors">
            Política de Privacidade
          </Link>
          <Link href="/termos" className="hover:text-accent transition-colors">
            Termos de Uso
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground/80">
          © {new Date().getFullYear()} CE Sports. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
