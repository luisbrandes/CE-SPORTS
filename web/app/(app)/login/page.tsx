"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  // Envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      alert("Por favor, preencha todos os campos.")
      return
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-500 p-6">
      <Card className="w-full max-w-md text-center bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">CE Sports</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant={loginType === "admin" ? "secondary" : "primary"}
            className={`w-full ${
              loginType === "admin"
                ? "bg-yellow-400 text-blue-900 hover:bg-yellow-500"
                : ""
            }`}
          >
            {loginType === "admin" ? "Entrar " : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-2">
          <Link href="/cadastro" className="text-blue-500 hover:underline">
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
