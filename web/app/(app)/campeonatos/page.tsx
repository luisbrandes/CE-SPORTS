"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const campeonatos = [
  {
    titulo: "Copa Caloura 2025",
    descricao:
      "Campeonato entre turmas de primeiro ano. Próxima partida: Informática x Eletrotécnica.",
  },
  {
    titulo: "Interturmas 2025",
    descricao:
      "Times de todos os cursos disputando o título de melhor equipe do campus.",
  },
];

const classificacao = [
  {
    posicao: "1º",
    equipe: "Informática",
    pontos: 12,
    vitorias: 4,
    derrotas: 0,
  },
  {
    posicao: "2º",
    equipe: "Eletrotécnica",
    pontos: 9,
    vitorias: 3,
    derrotas: 1,
  },
  { posicao: "3º", equipe: "Mecânica", pontos: 6, vitorias: 2, derrotas: 2 },
  { posicao: "4º", equipe: "Edificações", pontos: 3, vitorias: 1, derrotas: 3 },
];

export default function CampeonatosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col">
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="font-bold text-2xl text-blue-900">CE Sports</div>
        <nav className="flex gap-4 items-center">
          <Link href="/" className="hover:underline text-blue-700">
            Home
          </Link>
          <Link href="/projetos" className="hover:underline text-blue-700">
            Projetos
          </Link>
          <Link href="/noticias" className="hover:underline text-blue-700">
            Notícias
          </Link>
          <Link href="/login">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Login
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button className="mb-4">
          <Link href="/">← Voltar à Home</Link>
        </Button>
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Campeonatos em Andamento
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {campeonatos.map((camp, idx) => (
            <Card key={idx} className="p-6">
              <h3 className="font-bold text-xl text-blue-800 mb-2">
                {camp.titulo}
              </h3>
              <p className="text-gray-700 mb-4">{camp.descricao}</p>
              <Button>Ver Detalhes</Button>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-blue-800 mb-4">
          Tabela de Classificação - Copa Caloura
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Posição</th>
                <th className="py-2 px-4 border-b">Equipe</th>
                <th className="py-2 px-4 border-b">Pontos</th>
                <th className="py-2 px-4 border-b">Vitórias</th>
                <th className="py-2 px-4 border-b">Derrotas</th>
              </tr>
            </thead>
            <tbody>
              {classificacao.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-4 border-b">{row.posicao}</td>
                  <td className="py-2 px-4 border-b">{row.equipe}</td>
                  <td className="py-2 px-4 border-b">{row.pontos}</td>
                  <td className="py-2 px-4 border-b">{row.vitorias}</td>
                  <td className="py-2 px-4 border-b">{row.derrotas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="bg-white text-gray-600 text-center py-4">
        &copy; 2025 CE Sports — CEFET-MG | Todos os direitos reservados
      </footer>
    </div>
  );
}
