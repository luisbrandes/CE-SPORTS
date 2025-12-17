"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Users, Calendar, Award, Search, Filter } from "lucide-react";

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

export default function CampeonatosAlunoPage() {
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando campeonatos...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Erro ao carregar campeonatos
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Campeonatos em Andamento
            </h1>
            <p className="text-gray-600">
              Acompanhe todos os campeonatos do CEFET-MG
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/aluno/campeonatos/historico-partidas"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Ver Histórico de Partidas
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Campeonatos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campeonatos.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Equipes Participantes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todasEquipes.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campeonatosFiltrados.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-orange-100 p-3 mr-4">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Partidas Hoje</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline-block h-4 w-4 mr-1" />
                Buscar campeonato
              </label>
              <Input
                placeholder="Digite o nome do campeonato..."
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline-block h-4 w-4 mr-1" />
                Filtrar por equipe
              </label>
              <Select value={filtroEquipe} onValueChange={setFiltroEquipe}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as equipes" />
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

            <div>
              <Button
                variant="outline"
                onClick={limparFiltros}
                className="h-10"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Mostrando {campeonatosFiltrados.length} de {campeonatos.length}{" "}
            campeonatos
            {filtroEquipe !== "todos" && ` com a equipe "${filtroEquipe}"`}
            {filtroNome && ` contendo "${filtroNome}" no nome`}
          </div>
        </Card>

        <section className="space-y-6">
          {campeonatosFiltrados.length === 0 ? (
            <Card className="p-12 text-center">
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum campeonato encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                {filtroNome || filtroEquipe !== "todos"
                  ? "Tente ajustar os filtros para encontrar campeonatos"
                  : "Nenhum campeonato cadastrado no momento"}
              </p>
              {(filtroNome || filtroEquipe !== "todos") && (
                <Button variant="outline" onClick={limparFiltros}>
                  Limpar filtros
                </Button>
              )}
            </Card>
          ) : (
            campeonatosFiltrados.map((camp) => {
              const classificacao = classificacoes[camp.id] || [];

              return (
                <Card
                  key={camp.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Informações do Campeonato */}
                    <div className="lg:w-1/3">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {camp.nome}
                          </h3>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                              {camp.equipes.length} equipes
                            </span>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Pontuação:</span>{" "}
                              {camp.vitoria}V / {camp.empate}E / {camp.derrota}D
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Equipes Participantes */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Equipes Participantes:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {camp.equipes.slice(0, 8).map((equipe) => (
                            <span
                              key={equipe.id}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                              {equipe.nome}
                            </span>
                          ))}
                          {camp.equipes.length > 8 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{camp.equipes.length - 8} outras
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-2/3">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Classificação
                      </h4>
                      {classificacao.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Pos
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Equipe
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  PTS
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  J
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  V
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  E
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  D
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  SG
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {classificacao.map((equipe, index) => (
                                <tr
                                  key={equipe.nomeEquipe}
                                  className={`hover:bg-gray-50 ${
                                    index < 3 ? "bg-gray-50" : ""
                                  }`}
                                >
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div
                                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                                        index === 0
                                          ? "bg-yellow-100 text-yellow-800"
                                          : index === 1
                                          ? "bg-gray-100 text-gray-800"
                                          : index === 2
                                          ? "bg-orange-100 text-orange-800"
                                          : "bg-white text-gray-900"
                                      }`}
                                    >
                                      <span className="font-bold">
                                        {index + 1}°
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="font-medium text-gray-900">
                                      {equipe.nomeEquipe}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="font-bold text-gray-900">
                                      {equipe.pontos}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                                    {equipe.jogos}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-green-600">
                                    {equipe.vitorias}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-yellow-600">
                                    {equipe.empates}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-red-600">
                                    {equipe.derrotas}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span
                                      className={`font-medium ${
                                        equipe.saldoGols > 0
                                          ? "text-green-600"
                                          : equipe.saldoGols < 0
                                          ? "text-red-600"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {equipe.saldoGols > 0 ? "+" : ""}
                                      {equipe.saldoGols}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 border rounded-lg bg-gray-50">
                          <p className="text-gray-500">
                            Nenhuma partida registrada ainda
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Aguarde o registro das primeiras partidas
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </section>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Dúvidas sobre os campeonatos? Entre em contato com a coordenação
            esportiva.
          </p>
          <p className="mt-1">
            As classificações são atualizadas automaticamente após cada partida.
          </p>
        </div>
      </div>
    </div>
  );
}

const Button = ({
  children,
  variant = "default",
  onClick,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variantClasses =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
