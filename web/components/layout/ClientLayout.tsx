// components/ClientLayout.tsx  (CLIENT)
"use client"

import { usePathname } from "next/navigation"
import { Header, Footer, MobileMenu } from "@/components/layout"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ""
  // rotas onde queremos esconder o header/footer
  const hideLayout = ["/login", "/register", "/admin","/register/verify"].includes(pathname)

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
