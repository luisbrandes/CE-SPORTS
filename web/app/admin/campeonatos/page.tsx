"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Campeonato {
  id: number;
  nome: string;
  vitoria: number;
  derrota: number;
  empate: number;
  equipes: { id: number; nome: string }[];
}

function calcularPontuacoes(camp: Campeonato, partidas: any[]) {
  const tabela: Record<string, number> = {};

  camp.equipes.forEach((equipe) => {
    tabela[equipe.nome] = 0;
  });

  partidas
    .filter((p) =>
      typeof p.campeonato === "string"
        ? p.campeonato === camp.nome
        : p.campeonato.nome === camp.nome
    )
    .forEach((p) => {
      const e1 = typeof p.equipe1 === "string" ? p.equipe1 : p.equipe1.nome;
      const e2 = typeof p.equipe2 === "string" ? p.equipe2 : p.equipe2.nome;

      if (p.empate) {
        tabela[e1] += camp.empate;
        tabela[e2] += camp.empate;
      } else if (p.vencedor) {
        const vencedor =
          typeof p.vencedor === "string" ? p.vencedor : p.vencedor.nome;
        const perdedor = vencedor === e1 ? e2 : e1;

        tabela[vencedor] += camp.vitoria;
        tabela[perdedor] += camp.derrota;
      }
    });

  return Object.entries(tabela)
    .map(([nome, pontos]) => ({ nome, pontos }))
    .sort((a, b) => b.pontos - a.pontos);
}

export default function CampeonatosPage() {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampeonatos() {
      try {
        const res = await fetch("http://localhost:8080/api/campeonato", {
          credentials: "include",
        });
        if (!res.ok)
          throw new Error(
            `Erro ${res.status}: não foi possível carregar os campeonatos`
          );
        const data = await res.json();
        setCampeonatos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCampeonatos();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">
        Carregando campeonatos...
      </p>
    );
  if (error)
    return <p className="text-center text-red-600 mt-10">Erro: {error}</p>;

  return (
    <main className="flex-1 container mx-auto px-4 py-8 fade-in">
      <Link href="/">
        <Button variant="outline" size="sm" className="mb-4">
          ← Voltar à Home
        </Button>
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl page-title text-black font-bold mb-6">
          Campeonatos em Andamento
        </h1>

        <Link href="/admin/campeonatos/historico-partidas">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Histórico de Partidas
          </Button>
        </Link>
      </div>

      {}
      <section className="grid sm:grid-cols-2 gap-6 mb-10">
        {campeonatos.map((camp) => {
          const partidas: any[] = [];

          const ranking = calcularPontuacoes(camp, partidas);

          return (
            <Card key={camp.id} className="p-4">
              <h3 className="text-xl font-semibold text-black mb-4">
                {camp.nome}
              </h3>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Equipe</th>
                    <th className="p-2 text-left">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((r) => (
                    <tr key={r.nome} className="border-b">
                      <td className="p-2">{r.nome}</td>
                      <td className="p-2 font-bold">{r.pontos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          );
        })}
      </section>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
        <Link href="/admin/campeonatos/adicionar-campeonato">
          <Button
            variant="outline"
            size="md"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6"
          >
            🏆 Adicionar Campeonato
          </Button>
        </Link>
      </div>
    </main>
  );
}
