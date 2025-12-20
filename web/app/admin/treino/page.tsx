"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface Treino {
  id: number
  modalidade: string
  data: string
  horaInicio: string
  horaFim: string
  local: string
  professor: string
  vagasTotais: number
  vagasDisponiveis: number
  recorrente: boolean
  dataInicio?: string
  dataFim?: string
  diasDaSemana?: string[]
}

export default function TreinosAdminPage() {
  const router = useRouter()
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [loading, setLoading] = useState(true)

  const handleRemoverTreino = async (id: number) => {
    if (!confirm("Deseja realmente remover este treino?")) return

    try {
      const res = await fetch(`http://localhost:8080/api/treinos/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Erro ao remover treino")
      setTreinos(treinos.filter((treino) => treino.id !== id))
      alert("Treino removido com sucesso!")
    } catch (err) {
      console.error(err)
      alert("Erro ao remover treino.")
    }
  }

  const handleEditarTreino = (id: number) => {
    router.push(`/admin/treino/editar/${id}`)
  }

  useEffect(() => {
    async function carregarTreinos() {
      try {
        const res = await fetch("http://localhost:8080/api/treinos", { 
          credentials: "include" 
        })
        if (!res.ok) throw new Error("Falha ao buscar treinos")
        const data: Treino[] = await res.json()
        setTreinos(data)
      } catch (err) {
        console.error("Erro ao buscar treinos:", err)
      } finally {
        setLoading(false)
      }
    }
    carregarTreinos()
  }, [])

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  const formatarHorario = (horario: string) => {
    if (!horario) return ""
    return horario.substring(0, 5)
  }

  const formatarDiasSemana = (dias: string[] | undefined) => {
    if (!dias || dias.length === 0) return ""
    
    const diasMap: Record<string, string> = {
      "MONDAY": "Seg",
      "TUESDAY": "Ter", 
      "WEDNESDAY": "Qua",
      "THURSDAY": "Qui",
      "FRIDAY": "Sex",
      "SATURDAY": "Sáb",
      "SUNDAY": "Dom"
    }
    
    return dias.map(dia => diasMap[dia] || dia).join(", ")
  }

  return (
    <main className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🏋️‍♂️ Treinos Cadastrados</h1>
        <Button onClick={() => router.push("/admin/treino/cadastrotreino")}>
          ＋ Novo Treino
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Carregando treinos...</p>
      ) : (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {treinos.length > 0 ? (
            treinos.map((treino) => (
              <Card key={treino.id} className="p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{treino.modalidade}</h3>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        treino.vagasDisponiveis > 0 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {treino.vagasDisponiveis} vagas
                      </span>

                      {treino.recorrente && (
                        <span className="text-xs px-2 py-1 mt-1 bg-blue-100 text-blue-800 rounded-full">
                          Recorrente
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {treino.recorrente ? (
                    <>
                      <p className="text-sm mb-1">
                        <strong>Período:</strong> {formatarData(treino.dataInicio!)} - {formatarData(treino.dataFim!)}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Dias:</strong> {formatarDiasSemana(treino.diasDaSemana)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm mb-3">
                      <strong>Data:</strong> {formatarData(treino.data)}
                    </p>
                  )}
                  
                  <p className="text-sm mb-1">
                    <strong>Horário:</strong> {formatarHorario(treino.horaInicio)} - {formatarHorario(treino.horaFim)}
                  </p>
                  <p className="text-sm mb-1">
                    <strong>Local:</strong> {treino.local}
                  </p>
                  <p className="text-sm mb-1">
                    <strong>Professor:</strong> {treino.professor}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>ID:</strong> {treino.id}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditarTreino(treino.id)}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleRemoverTreino(treino.id)}
                    >
                      Remover
                    </Button>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    Ver Inscritos
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum treino cadastrado ainda.</p>
              <Button onClick={() => router.push("/admin/treino/cadastrotreino")}>
                Cadastrar Primeiro Treino
              </Button>
            </div>
          )}
        </section>
      )}

      <div className="flex justify-center pt-4">
        <Button 
          variant="outline" 
          onClick={() => router.push("/admin")}
          className="px-8"
        >
          Voltar ao Painel
        </Button>
      </div>
    </main>
  )
}
