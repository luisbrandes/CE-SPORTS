"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function EnviarNotificacaoPage() {
  const router = useRouter()

  const [titulo, setTitulo] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setFeedback({ type: null, message: "" })

    try {
      const res = await fetch("http://localhost:8080/api/admin/notification/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          titulo,
          mensagem,
        }),
      })

      if (!res.ok) {
        throw new Error("Erro ao enviar notificação")
      }

      setFeedback({
        type: "success",
        message: "Notificação enviada com sucesso!",
      })

      setTitulo("")
      setMensagem("")
    } catch {
      setFeedback({
        type: "error",
        message: "Não foi possível enviar a notificação.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-primary">
        Enviar Notificações
      </h1>

      <Card className="p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Aviso importante"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Mensagem</label>
            <Input
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite a mensagem"
              required
            />
          </div>

          {feedback.type && (
            <div
              className={`text-sm p-2 rounded ${
                feedback.type === "success"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Notificação"}
          </Button>
        </form>
      </Card>

      <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
        Voltar ao Dashboard
      </Button>
    </section>
  )
}
