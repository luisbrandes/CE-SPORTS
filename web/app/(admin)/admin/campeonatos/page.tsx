"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function CampeonatosPage() {
  const router = useRouter()

  const handleVoltar = () => router.push("/admin")
  const handleAddCampeonato = () =>
    router.push("/admin/adicionar-campeonato")
  const handleGerenciar = () =>
    router.push("/admin/editar-dados-campeonato")

  return (
    <main className="container mx-auto py-10 px-6 animate-fade-in">
      {/* Botão voltar */}
      <Button variant="outline" onClick={handleVoltar} className="mb-6">
        ← Voltar à Home
      </Button>

      <h1 className="text-3xl font-bold text-primary mb-8">
        Campeonatos em Andamento
      </h1>

      {/* Cards de campeonatos */}
      <section className="grid md:grid-cols-2 gap-6 mb-10">
        <Card className="p-6 flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-primary">
            Copa Caloura 2025
          </h3>
          <p className="text-sm text-muted-foreground">
            Campeonato entre turmas de primeiro ano. Próxima partida:
            Informática x Eletrotécnica.
          </p>
          <Button variant="outline" className="mt-auto w-fit">
            Ver Detalhes
          </Button>
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-primary">
            Interturmas 2025
          </h3>
          <p className="text-sm text-muted-foreground">
            Times de todos os cursos disputando o título de melhor equipe do
            campus.
          </p>
          <Button variant="outline" className="mt-auto w-fit">
            Ver Detalhes
          </Button>
        </Card>
      </section>

      {/* Tabela de classificação */}
      <h2 className="text-2xl font-semibold text-primary mb-4">
        Tabela de Classificação - Copa Caloura
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
          <thead className="bg-secondary text-primary font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">Posição</th>
              <th className="py-3 px-4 text-left">Equipe</th>
              <th className="py-3 px-4 text-left">Pontos</th>
              <th className="py-3 px-4 text-left">Vitórias</th>
              <th className="py-3 px-4 text-left">Derrotas</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="py-2 px-4">1º</td>
              <td className="py-2 px-4">Informática</td>
              <td className="py-2 px-4">12</td>
              <td className="py-2 px-4">4</td>
              <td className="py-2 px-4">0</td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-2 px-4">2º</td>
              <td className="py-2 px-4">Eletrotécnica</td>
              <td className="py-2 px-4">9</td>
              <td className="py-2 px-4">3</td>
              <td className="py-2 px-4">1</td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-2 px-4">3º</td>
              <td className="py-2 px-4">Mecânica</td>
              <td className="py-2 px-4">6</td>
              <td className="py-2 px-4">2</td>
              <td className="py-2 px-4">2</td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-2 px-4">4º</td>
              <td className="py-2 px-4">Edificações</td>
              <td className="py-2 px-4">3</td>
              <td className="py-2 px-4">1</td>
              <td className="py-2 px-4">3</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ações */}
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <Button variant="outline" onClick={handleAddCampeonato}>
          ＋ Adicionar Novo Campeonato
        </Button>
        <Button variant="outline" onClick={handleGerenciar}>
          Gerenciar Campeonato
        </Button>
      </div>
    </main>
  )
}
