"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Treino = {
  id: number
  modalidade: string
  data: string
  horaInicio: string
  horaFim: string
  local: string
  professor: string
  vagasTotais: number
  status: string
}

export default function TreinosAdminPage() {
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [erro, setErro] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarTreinos()
  }, [])

  const carregarTreinos = async () => {
    try {
      setLoading(true)

      const res = await fetch("http://localhost:8080/api/treinos", {
        credentials: "include"
      })

      if (!res.ok) {
        setErro("Sem permissão ou erro no servidor.")
        return
      }

      const contentType = res.headers.get("content-type")

      if (!contentType || !contentType.includes("application/json")) {
        setErro("O servidor retornou algo inesperado.")
        return
      }

      const data = await res.json()
      setTreinos(data)

    } catch (err) {
      console.error(err)
      setErro("Erro ao carregar treinos.")
    } finally {
      setLoading(false)
    }
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  const formatarHora = (hora: string) => {
    return hora.substring(0, 5)
  }

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">📋 Treinos Cadastrados</h1>
        <Link href="/admin/treino/cadastrotreino">
          <Button>+ Novo Treino</Button>
        </Link>
      </div>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}

      {!loading && treinos.length === 0 && !erro && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Nenhum treino cadastrado até o momento.</p>
          <Link href="/admin/treino/novo">
            <Button>Cadastrar Primeiro Treino</Button>
          </Link>
        </Card>
      )}

      {!loading && treinos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treinos.map(treino => (
            <Card key={treino.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold">{treino.modalidade}</h2>
                <span className={`text-xs px-2 py-1 rounded ${
                  treino.status === 'ATIVO' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {treino.status}
                </span>
              </div>
              
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>📅 Data:</strong> {formatarData(treino.data)}</p>
                <p><strong>🕒 Horário:</strong> {formatarHora(treino.horaInicio)} às {formatarHora(treino.horaFim)}</p>
                <p><strong>📍 Local:</strong> {treino.local}</p>
                <p><strong>👨‍🏫 Professor:</strong> {treino.professor}</p>
                <p><strong>👥 Vagas:</strong> {treino.vagasTotais}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {loading && <p className="text-muted-foreground">Carregando treinos...</p>}
    </section>
  )
}
