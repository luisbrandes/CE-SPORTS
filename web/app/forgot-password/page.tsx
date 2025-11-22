"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const Router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (loading) return 
    setLoading(true)

    const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setMessage("📬 Email enviado! Verifique sua caixa de entrada.")
      setTimeout(() => Router.push("/login"), 1500)
    } else {
      setMessage("❌ Email não encontrado.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-500 p-6">
      <Card className="w-full max-w-md text-center bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">CE Sports</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Recuperar Senha
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Digite seu e-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar link de recuperação"}
          </Button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-gray-700 font-medium">{message}</p>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Link href="/login" className="text-blue-500 hover:underline">
            Voltar ao Login
          </Link>
        </div>
      </Card>
    </div>
  )
}
