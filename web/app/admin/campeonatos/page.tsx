"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Equipe {
  id: number;
  nome: string;
}

interface Campeonato {
  id: number;
  nome: string;
  vitoria: number;
  derrota: number;
  empate: number;
  equipes: Equipe[];
}

interface ClassificacaoEquipe {
  nomeEquipe: string;
  pontos: number;
  jogos: number;
  vitorias: number;
  derrotas: number;
  empates: number;
  golsPro: number;
  golsContra: number;
  saldoGols: number;
}

export default function CampeonatosPage() {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [classificacoes, setClassificacoes] = useState<
    Record<number, ClassificacaoEquipe[]>
  >({});
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

        const classificacoesData: Record<number, ClassificacaoEquipe[]> = {};
        for (const camp of data) {
          try {
            const classificacaoRes = await fetch(
              `http://localhost:8080/api/campeonato/${camp.id}/classificacao`,
              {
                credentials: "include",
              }
            );
            if (classificacaoRes.ok) {
              const classificacaoData = await classificacaoRes.json();
              classificacoesData[camp.id] = classificacaoData;
            }
          } catch (err) {
            console.error(
              `Erro ao buscar classificação do campeonato ${camp.id}:`,
              err
            );
          }
        }
        setClassificacoes(classificacoesData);
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
      <Link href="/admin">
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

      <section className="grid sm:grid-cols-2 gap-6 mb-10">
        {campeonatos.map((camp) => {
          const classificacao = classificacoes[camp.id] || [];

          return (
            <Card key={camp.id} className="p-4">
              <h3 className="text-xl font-semibold text-black mb-4">
                {camp.nome}
              </h3>

              {classificacao.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-2 text-left">Pos</th>
                      <th className="p-2 text-left">Equipe</th>
                      <th className="p-2 text-center">PTS</th>
                      <th className="p-2 text-center">J</th>
                      <th className="p-2 text-center">V</th>
                      <th className="p-2 text-center">E</th>
                      <th className="p-2 text-center">D</th>
                      <th className="p-2 text-center">SG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classificacao.map((equipe, index) => (
                      <tr
                        key={equipe.nomeEquipe}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-2 font-medium">{index + 1}°</td>
                        <td className="p-2">{equipe.nomeEquipe}</td>
                        <td className="p-2 text-center font-bold">
                          {equipe.pontos}
                        </td>
                        <td className="p-2 text-center">{equipe.jogos}</td>
                        <td className="p-2 text-center text-green-600">
                          {equipe.vitorias}
                        </td>
                        <td className="p-2 text-center text-yellow-600">
                          {equipe.empates}
                        </td>
                        <td className="p-2 text-center text-red-600">
                          {equipe.derrotas}
                        </td>
                        <td className="p-2 text-center">
                          {equipe.saldoGols > 0 ? "+" : ""}
                          {equipe.saldoGols}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Nenhuma partida registrada ainda
                </div>
              )}
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
