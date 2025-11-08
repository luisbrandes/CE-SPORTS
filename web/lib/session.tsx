"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "./api"


export type User = {
  id: number
  nome: string
  email: string
  role: "ROLE_ADMIN" | "ROLE_USER" | string
}

type SessionContextType = {
  user: User | null
  loading: boolean
  refreshSession: () => Promise<void>
  logout: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  async function refreshSession() {
    try {
      const res = await apiFetch("/auth/me")
      setUser(res.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await apiFetch("/auth/logout", { method: "POST" })
    } catch (e) {
      console.warn("Erro ao deslogar", e)
    } finally {
      setUser(null)
      router.push("/login")
    }
  }

  useEffect(() => {
    refreshSession()
  }, [])

  return (
    <SessionContext.Provider value={{ user, loading, refreshSession, logout }}>
      {children}
    </SessionContext.Provider>
  )
}


export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useSession deve ser usado dentro de <SessionProvider>")
  }
  return context
}
