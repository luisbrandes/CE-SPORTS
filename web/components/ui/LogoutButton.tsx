"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/session"

export default function LogoutButton() {
  const { logout } = useSession()

  return (
    <Button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white">
      Sair
    </Button>
  )
}
