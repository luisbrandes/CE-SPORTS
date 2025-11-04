"use client"

import { useState } from "react"
import Link from "next/link"
import { Button, Card } from "@/components/ui"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <main className="flex flex-col items-center justify-center w-full">
      {/* Banner */}
      <section className="relative h-[60vh] w-full bg-[url('/banner1.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white max-w-2xl px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Participação, Esporte e Comunidade no CEFET-MG
          </h1>
          <p className="text-lg opacity-90">
            Clique em Login para acessar como Aluno ou Administrador — explore os Campeonatos,
            Treinos, Projetos e Notícias.
          </p>
        </div>
      </section>

      {/* Cards principais */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full px-6 py-16">
        {[
          {
            icon: "🏆",
            title: "Campeonatos",
            desc: "Resultados, inscrições e classificações",
            href: "/campeonatos",
          },
          {
            icon: "📋",
            title: "Projetos",
            desc: "Horários, objetivos e equipes envolvidas",
            href: "/projetos",
          },
          {
            icon: "📰",
            title: "Notícias",
            desc: "Últimas informações do esporte no campus",
            href: "/noticias",
          },
        ].map((item) => (
          <Card
            key={item.title}
            onClick={() => (window.location.href = item.href)}
            className="cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1 text-center"
          >
            <div className="text-4xl">{item.icon}</div>
            <h3 className="font-bold text-lg mt-2">{item.title}</h3>
            <p className="text-muted-foreground mt-1 text-sm">{item.desc}</p>
          </Card>
        ))}
      </section>

      {/* Sobre */}
      <section className="bg-white rounded-2xl shadow-lg p-8 md:p-10 max-w-3xl mx-4 my-10 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Sobre o CE Sports ⚽</h2>
        <p className="text-foreground mb-3">
          O <strong>CE Sports</strong> é o sistema esportivo oficial do <strong>CEFET-MG</strong>,
          criado para integrar alunos, professores e a comunidade acadêmica nas atividades
          esportivas da instituição.
        </p>
        <p className="text-foreground mb-3">
          Aqui você pode <strong>acompanhar campeonatos</strong>, <strong>participar de projetos esportivos</strong> e <strong>ficar por dentro das últimas notícias</strong> sobre o esporte no CEFET-MG.
        </p>
        <p className="text-foreground">
          Seja você um atleta, um organizador ou apenas um torcedor, o CE Sports foi feito para conectar você ao esporte!
        </p>
      </section>

      {/* Campeonatos */}
      <section className="w-full max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-bold text-primary mb-8 text-center">
          Campeonatos em Andamento
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Copa Caloura 2025",
              desc: "Fase de grupos em andamento. Confira os resultados e próximos jogos.",
            },
            {
              title: "Interturmas 2025",
              desc: "Times das turmas do 2º ano competindo nas quadras do CEFET-MG.",
            },
            {
              title: "Torneio de Vôlei",
              desc: "Campeonato misto com equipes de diferentes cursos. Semifinais chegando!",
            },
          ].map((item) => (
            <Card key={item.title} className="p-6 text-center">
              <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
              <p className="text-muted-foreground mb-3">{item.desc}</p>
              <Button variant="outline" size="sm">
                Ver mais
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Notícias */}
      <section className="w-full max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-bold text-primary mb-8 text-center">
          Últimas Notícias
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Equipe de Futsal conquista vitória emocionante",
              desc: "O time do CEFET-MG venceu o rival por 3x2 na prorrogação. Veja os melhores momentos da partida e os próximos desafios.",
            },
            {
              title: "Novos horários de treinos disponíveis",
              desc: "Os projetos esportivos divulgaram os novos horários para o segundo semestre. Confira e participe!",
            },
            {
              title: "Projeto de corrida atrai alunos de vários cursos",
              desc: "Mais de 100 estudantes participaram do evento de corrida realizado no campus Nova Suíça. Conheça a iniciativa!",
            },
          ].map((item) => (
            <Card key={item.title} className="p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-3">{item.desc}</p>
              </div>
              <Link href="#" className="text-accent font-medium hover:underline">
                Ler mais →
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Modal de login */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 w-80 text-center shadow-xl relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-primary mb-2">Login</h2>
            <p className="text-muted-foreground mb-6">Escolha seu tipo de acesso:</p>
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                onClick={() => (window.location.href = "/login/aluno")}
              >
                Aluno
              </Button>
              <Button
                variant="secondary"
                onClick={() => (window.location.href = "/login/admin")}
              >
                Administrador
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
