import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Header, Footer, MobileMenu } from "@/components/layout"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "CE Sports",
  description: "Cefet Esportes",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-background text-primary font-sans">
        <Header />
        <MobileMenu />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
