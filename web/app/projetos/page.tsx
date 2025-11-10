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

  useEffect(() => {
    fetch("http://localhost:8080/api/projetos")
      .then((res) => res.json())
      .then(setProjetos)
      .catch((err) => console.error("Erro ao buscar projetos:", err))
  }, [])

  return (
    <main className="p-6 space-y-8">
      <Button variant="outline" onClick={() => router.push("/")}>
        ← Voltar à Home
      </Button>

      <h1 className="text-3xl font-bold text-center">🏅 Projetos Esportivos</h1>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projetos.length > 0 ? (
          projetos.map((proj) => (
            <Card key={proj.id}>
              <h3 className="text-lg font-semibold">{proj.nome}</h3>
              <p className="text-sm text-muted-foreground mb-2">{proj.descricao}</p>
              <p className="text-sm">
                <strong>Modalidade:</strong> {proj.modalidade}
              </p>
              <p className="text-sm">
                <strong>Local:</strong> {proj.local}
              </p>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Participar
              </Button>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">Nenhum projeto cadastrado.</p>
        )}
      </section>

      <div className="flex flex-wrap justify-center gap-4 pt-8">
        <Button variant="outline" onClick={() => router.push("/projetos/cadastrarProjetos")}>
          ＋ Adicionar Novo Projeto
        </Button>
        <Button variant="outline">Editar Dados</Button>
        <Button variant="outline">Aprovar Projetos</Button>
      </div>

      <footer className="text-center text-sm text-muted-foreground mt-10">
        &copy; 2025 CE Sports — CEFET-MG | Todos os direitos reservados
      </footer>
    </main>
  )
}
pps-xkbe-tap