"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/dist/client/components/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

 
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos.")
    return
  }

  try {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, senha }),
    })

    const data = await res.json().catch(() => ({})) 

    if (!res.ok) {
      const errorMessage =
        data?.error || data?.message || `Erro ${res.status}: ${res.statusText}`
      throw new Error(errorMessage)
    }

    alert("✅ Login realizado com sucesso!")
    router.push(data.redirect)
  } catch (err: any) {
    console.error("❌ Erro no login:", err)
    alert("❌ Erro: " + err.message)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-500 p-6">
      <Card className="w-full max-w-md text-center bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">CE Sports</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campo de e-mail */}
          <Input
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Campo de senha com botão de mostrar/ocultar */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
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

          {/* Botão de enviar */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Entrar
          </Button>
        </form>

        {/* Mensagem de retorno */}
        {message && (
          <p className="mt-4 text-sm text-gray-700 font-medium">{message}</p>
        )}

        {/* Links inferiores */}
        <div className="mt-6 flex flex-col gap-2">
          <Link href="/register" className="text-blue-500 hover:underline">
            Não tem conta? Cadastre-se
          </Link>
          <Link href="/" className="text-blue-500 hover:underline">
            ← Voltar para o site
          </Link>
        </div>
      </Card>
    </div>
  )
}
