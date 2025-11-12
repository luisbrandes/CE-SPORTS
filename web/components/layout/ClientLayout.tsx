"use client"

import { usePathname } from "next/navigation"
import { Header, Footer, MobileMenu } from "@/components/layout"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ""

  const hideLayout =
    pathname.startsWith("/admin") ||
    ["/login", "/register", "/register/verify"].includes(pathname)

  return (
    <>
      {!hideLayout && <Header />}
      {!hideLayout && <MobileMenu />}

      <main className="flex-1">
        {children}
      </main>

      {!hideLayout && <Footer />}
    </>
  )
}
