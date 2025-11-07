"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmSenha, setConfirmSenha] = useState("")
  const [role, setRole] = useState("aluno")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome || !email || !senha || !confirmSenha) {
      alert("Por favor, preencha todos os campos.")
      return
    }

    if (senha !== confirmSenha) {
      alert("As senhas não coincidem.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, role }),
      })

      // Alguns backends retornam texto simples, então vamos tratar os dois casos
      let data
      try {
        data = await res.json()
      } catch {
        data = { message: await res.text() }
      }

      if (!res.ok) throw new Error(data.message || "Erro ao fazer cadastro")

      setMessage("✅ Cadastro realizado com sucesso! Redirecionando...")

   
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    } catch (err: any) {
      setMessage("❌ Erro: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-500 p-6">
      <Card className="w-full max-w-md text-center bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">CE Sports</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Cadastro</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nome */}
          <Input
            type="text"
            placeholder="Nome completo"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          {/* Email */}
          <Input
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Senha */}
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

          {/* Confirmar senha */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar senha"
              required
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
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

          {/* Tipo de usuário */}
          <div className="flex gap-6 justify-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="aluno"
                checked={role === "aluno"}
                onChange={() => setRole("aluno")}
              />
              Aluno
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={() => setRole("admin")}
              />
              Administrador
            </label>
          </div>

          {/* Botão de enviar */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>

        {/* Mensagem de retorno */}
        {message && (
          <p className="mt-4 text-sm text-gray-700 font-medium">{message}</p>
        )}

        {/* Links inferiores */}
        <div className="mt-6 flex flex-col gap-2">
          <Link href="/login" className="text-blue-500 hover:underline">
            Já tem conta? Fazer login
          </Link>
          <Link href="/" className="text-blue-500 hover:underline">
            ← Voltar para o site
          </Link>
        </div>
      </Card>
    </div>
  )
}
