"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function NovoProjetoPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    local: "",
    modalidade: "",
    responsavel: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:8080/api/projetos", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Erro ao cadastrar projeto")

      alert("✅ Projeto cadastrado com sucesso!")
      router.push("/projetos")
    } catch (err) {
      console.error(err)
      alert("❌ Erro ao cadastrar projeto.")
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-background">
      <Card className="max-w-xl w-full p-6 space-y-4">
        <h2 className="text-2xl font-bold">🏆 Cadastrar Novo Projeto</h2>
        <p className="text-muted-foreground text-sm">
          Preencha as informações abaixo para adicionar um novo projeto ao sistema.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Projeto</label>
            <Input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Projeto Futsal 2025"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={4}
              placeholder="Descreva brevemente o projeto..."
              className="w-full rounded-md border border-border bg-background p-2 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Data de Início</label>
              <Input type="date" name="dataInicio" value={form.dataInicio} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data de Término</label>
              <Input type="date" name="dataFim" value={form.dataFim} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Local</label>
              <Input
                name="local"
                value={form.local}
                onChange={handleChange}
                placeholder="Ex: Ginásio Principal"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Modalidade</label>
              <Input
                name="modalidade"
                value={form.modalidade}
                onChange={handleChange}
                placeholder="Ex: Futsal"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Responsável</label>
            <Input
              name="responsavel"
              value={form.responsavel}
              onChange={handleChange}
              placeholder="Nome do responsável"
              required
            />
          </div>

          <Button type="submit" className="w-full mt-3 bg-yellow-400 hover:bg-yellow-500 font-semibold">
            Adicionar Projeto
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={() => router.push("/admin/projetos")}
          >
            Cancelar
          </Button>
        </form>

        <footer className="text-center text-sm text-muted-foreground pt-4">
          © 2025 CE Sports - CEFET-MG
        </footer>
      </Card>
    </main>
  )
}
