"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/session";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useSession();

  if (loading)
    return <p className="text-center py-10 text-gray-500">Carregando...</p>;


  function getRoute(target: string) {
    return user ? target : "/login";
  }

  const mainCards = [
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
  ];

  const campeonatos = [
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
  ];

  const noticias = [
    {
      title: "Equipe de Futsal conquista vitória emocionante",
      desc: "O time do CEFET-MG venceu o rival por 3x2 na prorrogação.",
    },
    {
      title: "Novos horários de treinos disponíveis",
      desc: "Os projetos esportivos divulgaram novos horários.",
    },
    {
      title: "Projeto de corrida atrai alunos",
      desc: "Mais de 100 estudantes participaram do evento.",
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center w-full bg-gray-50 min-h-screen">

      {/* Banner */}
      <section
        className="relative h-[60vh] w-full bg-[url('/img/banner1.jpg')] bg-cover bg-center flex items-center justify-center"
        aria-label="Banner principal CE Sports"
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white max-w-2xl px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 select-none">
            Participação, Esporte e Comunidade no CEFET-MG
          </h1>
          <p className="text-lg opacity-90">
            Clique em Login para acessar como Aluno ou Administrador.
          </p>
        </div>
      </section>

      {/* Cards principais */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full px-6 py-16">
        {mainCards.map((item) => (
          <Card
            key={item.title}
            onClick={() => router.push(getRoute(item.href))}
            className="cursor-pointer hover:shadow-xl transition-transform hover:-translate-y-1 text-center p-6 flex flex-col items-center justify-center"
            role="link"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(getRoute(item.href));
            }}
          >
            <div className="text-5xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-xl text-blue-700">{item.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm max-w-xs">
              {item.desc}
            </p>
          </Card>
        ))}
      </section>

      {/* Sobre */}
      <section className="bg-white rounded-2xl shadow-lg p-8 md:p-10 max-w-3xl mx-4 my-10 text-center">
        <h2 className="text-3xl font-bold text-primary mb-5 select-none">
          Sobre o CE Sports ⚽
        </h2>
        <p className="mb-4 leading-relaxed">
          O <strong>CE Sports</strong> é o sistema esportivo oficial do{" "}
          <strong>CEFET-MG</strong>, criado para integrar a comunidade acadêmica.
        </p>
        <p className="mb-4 leading-relaxed">
          Você pode acompanhar campeonatos, participar de projetos esportivos e
          ficar por dentro das notícias.
        </p>
        <p className="leading-relaxed">
          Seja atleta, organizador ou torcedor — o CE Sports é para você!
        </p>
      </section>

      {/* Campeonatos */}
      <section className="w-full max-w-5xl px-6 py-12">
        <h2 className="text-3xl font-bold text-primary mb-10 text-center select-none">
          Campeonatos em Andamento
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {campeonatos.map((item) => (
            <Card
              key={item.title}
              className="p-6 text-center flex flex-col justify-between hover:shadow-lg transition-shadow rounded-lg border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground mb-6">{item.desc}</p>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  alert("Página de detalhes do campeonato ainda não implementada.")
                }
                className="mx-auto"
              >
                Ver mais
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Notícias */}
      <section className="w-full max-w-5xl px-6 py-12">
        <h2 className="text-3xl font-bold text-primary mb-10 text-center select-none">
          Últimas Notícias
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {noticias.map((item) => (
            <Card
              key={item.title}
              className="p-6 flex flex-col justify-between hover:shadow-lg transition-shadow rounded-lg border border-gray-200"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mb-4">{item.desc}</p>
              </div>

              <Link
                href="#"
                className="text-accent font-medium hover:underline mx-auto"
              >
                Ler mais →
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
