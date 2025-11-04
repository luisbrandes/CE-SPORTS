import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { Header } from "@/components/layout"
import { Footer } from "@/components/layout"
import { MobileMenu } from "@/components/layout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap", // melhora desempenho da fonte
})

export const metadata: Metadata = {
  title: "CE Sports",
  description: "Cefet Esportes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-background text-primary font-sans antialiased">
        {/* Cabeçalho fixo */}
        <Header />
        {/* Menu móvel (aparece apenas em telas menores) */}
        <MobileMenu />
        {/* Conteúdo principal */}
        <main className="flex-1">{children}</main>
        {/* Rodapé */}
        <Footer />
      </body>
    </html>
  )
}
