"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "./session"

export function useAdminGuard() {
  const { user, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "ROLE_ADMIN") {
        router.push("/")
      }
    }
  }, [user, loading, router])
}
