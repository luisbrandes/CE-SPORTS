"use client"

import { useEffect, useState } from "react"

export function useAuth(redirectIfNotLogged = true) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("http://localhost:8080/api/auth/me", {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else if (redirectIfNotLogged) {
          window.location.href = "/login"
        }
      } catch (err) {
        if (redirectIfNotLogged) window.location.href = "/login"
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  return { user, loading }
}
