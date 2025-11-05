"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NoticiasPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const redirectToLogin = (type: "aluno" | "admin") => {
    router.push(`/login?type=${type}`)
    closeModal()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br text-white">
      {/* Conteúdo principal */}
      <section className="container mx-auto py-12 px-6">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="mb-6 text-white border-white hover:bg-white/10"
        >
          ← Voltar à Home
        </Button>

        <h1 className="text-4xl font-bold mb-10 text-center text-yellow-300">
          Últimas Notícias
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white text-blue-900 p-6">
            <h3 className="text-xl font-semibold mb-2">
              CEFET-MG realiza Copa Caloura 2025
            </h3>
            <p className="text-gray-700 mb-3">
              O tradicional campeonato entre turmas teve início nesta semana,
              reunindo mais de 200 alunos em diversas modalidades esportivas.
            </p>
            <Link
              href="#"
              className="text-blue-700 font-semibold hover:underline"
            >
              Ler mais →
            </Link>
          </Card>

          <Card className="bg-white text-blue-900 p-6">
            <h3 className="text-xl font-semibold mb-2">
              Projeto de Corrida reúne estudantes e servidores
            </h3>
            <p className="text-gray-700 mb-3">
              O projeto tem como objetivo promover a integração e incentivar
              hábitos saudáveis entre os membros da comunidade escolar.
            </p>
            <Link
              href="#"
              className="text-blue-700 font-semibold hover:underline"
            >
              Ler mais →
            </Link>
          </Card>

          <Card className="bg-white text-blue-900 p-6">
            <h3 className="text-xl font-semibold mb-2">
              Times femininos de vôlei ganham destaque
            </h3>
            <p className="text-gray-700 mb-3">
              As equipes femininas do CEFET-MG estão representando a instituição
              em torneios intercolegiais com ótimos resultados.
            </p>
            <Link
              href="#"
              className="text-blue-700 font-semibold hover:underline"
            >
              Ler mais →
            </Link>
          </Card>
        </div>
      </section>

      {/* Botão centralizado abaixo do conteúdo */}
      <div className="flex justify-center py-12">
        <Button
          className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 px-8 py-6 text-lg font-semibold"
          onClick={() => router.push("/noticia/cadastrarNoticia")}
        >
          Cadastrar Notícia
        </Button>
      </div>
    </main>
  )
}
