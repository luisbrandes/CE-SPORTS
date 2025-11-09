"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Equipe {
  posicao: number;
  nome: string;
  pontos: number;
  vitorias: number;
  derrotas: number;
}

export default function CampeonatosPage() {
  const [showModal, setShowModal] = useState(false);

  const tabela: Equipe[] = [
    { posicao: 1, nome: "Informática", pontos: 12, vitorias: 4, derrotas: 0 },
    { posicao: 2, nome: "Eletrotécnica", pontos: 9, vitorias: 3, derrotas: 1 },
    { posicao: 3, nome: "Mecânica", pontos: 6, vitorias: 2, derrotas: 2 },
    { posicao: 4, nome: "Edificações", pontos: 3, vitorias: 1, derrotas: 3 },
  ];

  return (
    <main className="flex-1 container mx-auto px-4 py-8 fade-in">
      <Link href="/">
        <Button variant="outline" size="sm" className="mb-4">
          ← Voltar à Home
        </Button>
      </Link>

      <h1 className="text-3xl font-bold text-black mb-6">
        Campeonatos em Andamento
      </h1>

      <section className="grid sm:grid-cols-2 gap-6 mb-10">
        <Card>
          <h3 className="text-xl font-semibold mb-2 text-black">
            Copa Caloura 2025
          </h3>
          <p className="text-sm mb-4 text-muted-foreground">
            Campeonato entre turmas de primeiro ano. Próxima partida:
            <br /> <strong>Informática x Eletrotécnica</strong>.
          </p>
          <Button variant="outline">Ver Detalhes</Button>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-2 text-black">
            Interturmas 2025
          </h3>
          <p className="text-sm mb-4 text-muted-foreground">
            Times de todos os cursos disputando o título de melhor equipe do
            campus.
          </p>
          <Button variant="outline">Ver Detalhes</Button>
        </Card>
      </section>

      <h2 className="text-2xl font-semibold mb-4 text-black">
        Tabela de Classificação — Copa Caloura
      </h2>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 text-left">Posição</th>
              <th className="p-2 text-left">Equipe</th>
              <th className="p-2 text-left">Pontos</th>
              <th className="p-2 text-left">Vitórias</th>
              <th className="p-2 text-left">Derrotas</th>
            </tr>
          </thead>
          <tbody>
            {tabela.map((time) => (
              <tr
                key={time.posicao}
                className="border-t border-border hover:bg-muted/30 transition"
              >
                <td className="p-2">{time.posicao}º</td>
                <td className="p-2">{time.nome}</td>
                <td className="p-2">{time.pontos}</td>
                <td className="p-2">{time.vitorias}</td>
                <td className="p-2">{time.derrotas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
        <Link href="/campeonatos/registrar-partida">
          <Button
            variant="outline"
            size="md"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6"
          >
            ➕ Registrar Partida
          </Button>
        </Link>

        <Link href="/campeonatos/adicionar-campeonato">
          <Button
            variant="outline"
            size="md"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6"
          >
            🏆 Adicionar Campeonato
          </Button>
        </Link>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl shadow-lg p-6 relative w-[90%] max-w-sm">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-lg"
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-2">Login</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Escolha seu tipo de acesso:
            </p>

            <div className="flex flex-col gap-2">
              <Button variant="primary" onClick={() => alert("Login Aluno")}>
                Aluno
              </Button>
              <Button
                variant="secondary"
                onClick={() => alert("Login Administrador")}
              >
                Administrador
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
