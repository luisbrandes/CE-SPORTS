"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface Projeto {
  id: number
  nome: string
  descricao: string
  modalidade: string
  local: string
  dataInicio: string
  dataFim: string
  responsavel: string
}

export default function ProjetosPage() {
  const router = useRouter()
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)

  const handleRemoverProjeto = async (id: number) => {
    if (!confirm("Deseja realmente remover este projeto?")) return

    try {
      const res = await fetch(`http://localhost:8080/api/projetos/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Erro ao remover projeto")
      setProjetos(projetos.filter((proj) => proj.id !== id))
      alert("✅ Projeto removido com sucesso!")
    } catch (err) {
      console.error(err)
      alert("❌ Erro ao remover projeto.")
    }
  }

  useEffect(() => {
    async function carregarProjetos() {
      try {
        const res = await fetch("http://localhost:8080/api/projetos", { credentials: "include" })
        if (!res.ok) throw new Error("Falha ao buscar projetos")
        const data = await res.json()
        setProjetos(data)
      } catch (err) {
        console.error("Erro ao buscar projetos:", err)
      } finally {
        setLoading(false)
      }
    }
    carregarProjetos()
  }, [])

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">🏅 Projetos Esportivos</h1>

      {loading ? (
        <p className="text-center text-muted-foreground">Carregando projetos...</p>
      ) : (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {projetos.length > 0 ? (
            projetos.map((proj) => (
              <Card key={proj.id} className="flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{proj.nome}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{proj.descricao}</p>
                  <p className="text-sm">
                    <strong>Modalidade:</strong> {proj.modalidade}
                  </p>
                  <p className="text-sm">
                    <strong>Local:</strong> {proj.local}
                  </p>
                  <p className="text-sm">
                    <strong>Período:</strong> {formatarData(proj.dataInicio)} – {formatarData(proj.dataFim)}
                  </p>
                  <p className="text-sm">
                    <strong>Responsável:</strong> {proj.responsavel}
                  </p>
                </div>
                <div className="flex flex-col gap-2 mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    Participar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleRemoverProjeto(proj.id)}
                  >
                    Remover
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground col-span-full">
              Nenhum projeto cadastrado ainda.
            </p>
          )}
        </section>
      )}

      <div className="flex flex-wrap justify-center gap-4 pt-8">
        <Button variant="outline" onClick={() => router.push("/admin/projetos/cadastrarProjetos")}>
          ＋ Adicionar Novo Projeto
        </Button>
        <Button variant="outline">Editar Dados</Button>
        <Button variant="outline">Aprovar Projetos</Button>
      </div>
    </main>
  )
}
