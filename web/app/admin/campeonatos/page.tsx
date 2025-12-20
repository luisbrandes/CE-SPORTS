"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 👇 IMPORT DO ÍCONE (ÚNICA COISA EXTRA)
import { Pencil } from "lucide-react";

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

  const [filtroEquipe, setFiltroEquipe] = useState<string>("todos");
  const [filtroNome, setFiltroNome] = useState<string>("");
  const [todasEquipes, setTodasEquipes] = useState<string[]>([]);

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

        const equipesSet = new Set<string>();
        data.forEach((camp: Campeonato) => {
          camp.equipes.forEach((equipe: Equipe) => {
            equipesSet.add(equipe.nome);
          });
        });
        setTodasEquipes(Array.from(equipesSet).sort());

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
          } catch (err) {}
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

  const campeonatosFiltrados = useMemo(() => {
    return campeonatos.filter((camp) => {
      const passaFiltroNome =
        filtroNome === "" ||
        camp.nome.toLowerCase().includes(filtroNome.toLowerCase());

      const passaFiltroEquipe =
        filtroEquipe === "todos" ||
        camp.equipes.some((e) => e.nome === filtroEquipe);

      return passaFiltroNome && passaFiltroEquipe;
    });
  }, [campeonatos, filtroNome, filtroEquipe]);

  const limparFiltros = () => {
    setFiltroNome("");
    setFiltroEquipe("todos");
  };

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

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl page-title text-black font-bold">
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

      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por nome do campeonato
            </label>
            <Input
              placeholder="Digite o nome do campeonato..."
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por equipe participante
            </label>
            <Select value={filtroEquipe} onValueChange={setFiltroEquipe}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma equipe" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="todos">Todas as equipes</SelectItem>
                {todasEquipes.map((equipe) => (
                  <SelectItem key={equipe} value={equipe}>
                    {equipe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={limparFiltros} className="h-10">
              Limpar Filtros
            </Button>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Mostrando {campeonatosFiltrados.length} de {campeonatos.length}{" "}
          campeonatos
          {filtroEquipe !== "todos" && ` com a equipe "${filtroEquipe}"`}
          {filtroNome && ` contendo "${filtroNome}" no nome`}
        </div>
      </Card>

      <section className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {campeonatosFiltrados.length === 0 ? (
          <div className="col-span-2 text-center py-10">
            <p className="text-gray-500 text-lg">
              Nenhum campeonato encontrado com os filtros aplicados.
            </p>
            <Button variant="outline" onClick={limparFiltros} className="mt-4">
              Limpar filtros
            </Button>
          </div>
        ) : (
          campeonatosFiltrados.map((camp) => {
            const classificacao = classificacoes[camp.id] || [];

            return (
              <Card
                key={camp.id}
                className="p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">

                  {/* 👇 ÚNICA ALTERAÇÃO: ÍCONE AO LADO DO NOME */}
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-black">
                      {camp.nome}
                    </h3>

                    <Link href={`/admin/campeonatos/${camp.id}/editar`}>
                      <Pencil
                        size={20}
                        className="text-gray-600 hover:text-blue-600 cursor-pointer transition"
                      />
                    </Link>
                  </div>

                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {camp.equipes.length} equipes
                  </span>
                </div>

                {classificacao.length > 0 ? (
                  <div className="overflow-x-auto">
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
                            <td className="p-2 font-medium">
                              {equipe.nomeEquipe}
                            </td>
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
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Nenhuma partida registrada ainda</p>
                    <p className="text-sm mt-1">
                      Registre partidas para ver a classificação
                    </p>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </section>

      {/* Botão de adicionar campeonato */}
      <div className="flex justify-center mt-8 space-x-4">
        <Link href="/admin/campeonatos/adicionar-campeonato">
          <Button
            variant="outline"
            size="md"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
          >
            🏆 Adicionar Novo Campeonato
          </Button>
        </Link>

        <Link href="/admin/campeonatos/registrar-partida">
          <Button
            variant="outline"
            size="md"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 px-5"
          >
            ➕ Nova Partida
          </Button>
        </Link>
      </div>
    </main>
  );
}
