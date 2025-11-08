"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Menu, X } from "lucide-react"
import { useAdminGuard } from "@/lib/useAdminGuard"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useAdminGuard() 
    
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-primary">
      {/* Botão do menu mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md border border-border bg-background/80 backdrop-blur-md"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar responsiva */}
      <div
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 transform bg-secondary/30 backdrop-blur-md border-r border-border transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:ml-0 mt-12 md:mt-0 overflow-y-auto">{children}</main>
    </div>
  )
}
