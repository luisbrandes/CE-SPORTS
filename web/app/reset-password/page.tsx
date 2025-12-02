"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/dist/client/components/navigation"

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const token = params.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const passwordsMatch = password === confirmPassword

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!passwordsMatch) {
      setMessage("❌ As senhas não coincidem.")
      return
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      })

      const data = await res.json().catch(() => null)

      if (res.ok) {
        setMessage("✅ Senha alterada com sucesso!")
        setTimeout(() => router.push("/login"), 2000)
      } else {
        setMessage(`❌ Erro: ${data?.message || "Algo deu errado."}`)
      }
    } catch (error: any) {
      setMessage(`❌ Erro de conexão: ${error.message}`)
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-500 p-6">
      <Card className="w-full max-w-md text-center bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">CE Sports</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Redefinir Senha
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Campo nova senha */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Nova senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Campo confirmar senha */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar senha"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {!passwordsMatch && confirmPassword.length > 0 && (
            <p className="text-sm text-red-600 font-medium">
              ⚠ As senhas não coincidem
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            disabled={!passwordsMatch}
          >
            Alterar senha
          </Button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-gray-700 font-medium">{message}</p>
        )}
      </Card>
    </div>
  )
}
