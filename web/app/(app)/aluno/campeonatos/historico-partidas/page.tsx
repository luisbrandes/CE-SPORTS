"use client";

import { useEffect, useState, useMemo } from "react";
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
import {
  Calendar,
  Trophy,
  Users,
  Search,
  Filter,
  ChevronLeft,
} from "lucide-react";

type ApiEquipe = {
  id?: number;
  nome?: string;
};

type ApiCampeonato = {
  id?: number;
  nome?: string;
};

type ApiPartidaRaw = {
  id?: number;
  campeonato?: ApiCampeonato | string;
  equipe1?: ApiEquipe | string;
  equipe2?: ApiEquipe | string;
  pontuacao1?: number | string | null;
  pontuacao2?: number | string | null;
  empate?: boolean;
  vencedor?: ApiEquipe | string | null;
  data?: string | null;
};

export default function HistoricoPartidasAlunoPage() {
  const [partidas, setPartidas] = useState<ApiPartidaRaw[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filtroCampeonato, setFiltroCampeonato] = useState<string>("todos");
  const [filtroEquipe, setFiltroEquipe] = useState<string>("todos");
  const [filtroData, setFiltroData] = useState<string>("");

  const [campeonatos, setCampeonatos] = useState<string[]>([]);
  const [equipes, setEquipes] = useState<string[]>([]);

  const normalizeName = (
    value: ApiEquipe | ApiCampeonato | string | undefined | null
  ) => {
    if (!value) return "-";
    if (typeof value === "string") return value;
    return (value as any).nome ?? "-";
  };

  const normalizeScore = (
    val: number | string | undefined | null
  ): number | null => {
    if (val === null || val === undefined) return null;
    if (typeof val === "number") return val;
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
  };

  const fetchPartidas = async () => {
    setLoading(true);
    setError(null);
    setPartidas(null);

    try {
      const res = await fetch("http://localhost:8080/api/partida", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(
          `Erro ${res.status}: não foi possível carregar as partidas`
        );
      }

      const json = await res.json();
      const arr = Array.isArray(json)
        ? json
        : json?.data ?? json?.content ?? json?.partidas ?? null;

      if (!arr || !Array.isArray(arr)) {
        throw new Error("Formato de dados inesperado");
      }

      const normalized = arr.map((p: ApiPartidaRaw) => ({
        ...p,
        pontuacao1: normalizeScore(p.pontuacao1 as any),
        pontuacao2: normalizeScore(p.pontuacao2 as any),
      }));

      setPartidas(normalized);

      const campeonatosSet = new Set<string>();
      const equipesSet = new Set<string>();

      normalized.forEach((p: ApiPartidaRaw) => {
        const camp = normalizeName(p.campeonato);
        const e1 = normalizeName(p.equipe1);
        const e2 = normalizeName(p.equipe2);

        if (camp !== "-") campeonatosSet.add(camp);
        if (e1 !== "-") equipesSet.add(e1);
        if (e2 !== "-") equipesSet.add(e2);
      });

      setCampeonatos(Array.from(campeonatosSet).sort());
      setEquipes(Array.from(equipesSet).sort());
    } catch (e: any) {
      setError(
        `Não foi possível obter partidas: ${e?.message || "erro desconhecido"}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartidas();
  }, []);

  const partidasFiltradas = useMemo(() => {
    if (!partidas) return null;

    return partidas
      .filter((p) => {
        const camp = normalizeName(p.campeonato);
        const e1 = normalizeName(p.equipe1);
        const e2 = normalizeName(p.equipe2);
        const dataPartida = p.data || "";

        const passaFiltroCampeonato =
          filtroCampeonato === "todos" ||
          camp.toLowerCase().includes(filtroCampeonato.toLowerCase());

        const passaFiltroEquipe =
          filtroEquipe === "todos" ||
          e1.toLowerCase().includes(filtroEquipe.toLowerCase()) ||
          e2.toLowerCase().includes(filtroEquipe.toLowerCase());

        const passaFiltroData =
          filtroData === "" || dataPartida.includes(filtroData);

        return passaFiltroCampeonato && passaFiltroEquipe && passaFiltroData;
      })
      .sort((a, b) => {
        const aDate = a.data ? Date.parse(a.data) : NaN;
        const bDate = b.data ? Date.parse(b.data) : NaN;
        if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) return bDate - aDate;
        if (!Number.isNaN(aDate)) return -1;
        if (!Number.isNaN(bDate)) return 1;
        const aId = a.id ?? 0;
        const bId = b.id ?? 0;
        return bId - aId;
      });
  }, [partidas, filtroCampeonato, filtroEquipe, filtroData]);

  const limparFiltros = () => {
    setFiltroCampeonato("todos");
    setFiltroEquipe("todos");
    setFiltroData("");
  };

  const partidasParaMostrar = partidasFiltradas || partidas;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link
              href="/aluno/campeonatos"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar para Campeonatos
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Histórico de Partidas
            </h1>
            <p className="text-gray-600 mt-2">
              Consulte todas as partidas já realizadas no CEFET-MG
            </p>
          </div>

          <div className="rounded-full bg-blue-100 p-3">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Partidas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {partidas?.length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vitórias</p>
                <p className="text-2xl font-bold text-gray-900">
                  {partidas?.filter((p) => p.vencedor && !p.empate).length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Empates</p>
                <p className="text-2xl font-bold text-gray-900">
                  {partidas?.filter((p) => p.empate).length || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline-block h-4 w-4 mr-2" />
                Campeonato
              </label>
              <Select
                value={filtroCampeonato}
                onValueChange={setFiltroCampeonato}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os campeonatos" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="todos">Todos os campeonatos</SelectItem>
                  {campeonatos.map((camp) => (
                    <SelectItem key={camp} value={camp}>
                      {camp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline-block h-4 w-4 mr-2" />
                Equipe
              </label>
              <Select value={filtroEquipe} onValueChange={setFiltroEquipe}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as equipes" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="todos">Todas as equipes</SelectItem>
                  {equipes.map((equipe) => (
                    <SelectItem key={equipe} value={equipe}>
                      {equipe}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline-block h-4 w-4 mr-2" />
                Data
              </label>
              <Input
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                placeholder="Filtrar por data"
                className="w-full"
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={limparFiltros}
                className="w-full h-10"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {partidasParaMostrar?.length || 0}
              </span>{" "}
              partidas encontradas
            </div>

            {filtroCampeonato !== "todos" && (
              <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                <span>Campeonato:</span>
                <span className="font-medium">{filtroCampeonato}</span>
                <button
                  onClick={() => setFiltroCampeonato("todos")}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </div>
            )}

            {filtroEquipe !== "todos" && (
              <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <span>Equipe:</span>
                <span className="font-medium">{filtroEquipe}</span>
                <button
                  onClick={() => setFiltroEquipe("todos")}
                  className="ml-1 text-green-500 hover:text-green-700"
                >
                  ×
                </button>
              </div>
            )}

            {filtroData && (
              <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                <span>Data:</span>
                <span className="font-medium">{filtroData}</span>
                <button
                  onClick={() => setFiltroData("")}
                  className="ml-1 text-purple-500 hover:text-purple-700"
                >
                  ×
                </button>
              </div>
            )}

            {(filtroCampeonato !== "todos" ||
              filtroEquipe !== "todos" ||
              filtroData) && (
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={limparFiltros}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Limpar todos
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          {loading && (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Carregando partidas...</p>
            </div>
          )}

          {!loading && error && (
            <div className="py-8 text-center">
              <div className="text-red-600 mb-3">
                <Calendar className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium">Erro ao carregar partidas</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              <Button variant="outline" onClick={fetchPartidas}>
                Tentar novamente
              </Button>
            </div>
          )}

          {!loading &&
            partidasParaMostrar &&
            partidasParaMostrar.length === 0 && (
              <div className="py-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma partida encontrada
                </h3>
                <p className="text-gray-600 mb-4">
                  {filtroCampeonato !== "todos" ||
                  filtroEquipe !== "todos" ||
                  filtroData
                    ? "Tente ajustar os filtros para encontrar partidas"
                    : "Nenhuma partida registrada ainda"}
                </p>
                {(filtroCampeonato !== "todos" ||
                  filtroEquipe !== "todos" ||
                  filtroData) && (
                  <Button variant="outline" onClick={limparFiltros}>
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}

          {!loading &&
            partidasParaMostrar &&
            partidasParaMostrar.length > 0 && (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Campeonato
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Equipe 1
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Equipe 2
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Placar
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Resultado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {partidasParaMostrar.map((p, idx) => {
                        const camp = normalizeName(p.campeonato);
                        const e1 = normalizeName(p.equipe1);
                        const e2 = normalizeName(p.equipe2);
                        const g1 = p.pontuacao1 ?? null;
                        const g2 = p.pontuacao2 ?? null;

                        const left = g1 === null ? "-" : String(g1);
                        const right = g2 === null ? "-" : String(g2);
                        const placarDisplay =
                          g1 === null && g2 === null
                            ? "Pendente"
                            : `${left} × ${right}`;

                        let resultado = "-";
                        let resultadoCor = "";
                        if (p.empate) {
                          resultado = "Empate";
                          resultadoCor = "text-yellow-600";
                        } else if (p.vencedor) {
                          resultado = normalizeName(p.vencedor);
                          resultadoCor = "text-green-600";
                        } else if (
                          typeof g1 === "number" &&
                          typeof g2 === "number"
                        ) {
                          if (g1 > g2) {
                            resultado = e1;
                            resultadoCor = "text-green-600";
                          } else if (g2 > g1) {
                            resultado = e2;
                            resultadoCor = "text-green-600";
                          } else {
                            resultado = "Empate";
                            resultadoCor = "text-yellow-600";
                          }
                        }

                        const dataStr = p.data
                          ? new Date(p.data + "T00:00:00").toLocaleDateString(
                              "pt-BR"
                            )
                          : "-";

                        const isEquipe1Vencedora = resultado === e1;
                        const isEquipe2Vencedora = resultado === e2;

                        return (
                          <tr
                            key={p.id ?? idx}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {dataStr}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {camp}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div
                                className={`text-sm font-medium ${
                                  isEquipe1Vencedora
                                    ? "text-green-700 font-bold"
                                    : "text-gray-900"
                                }`}
                              >
                                {e1}
                                {isEquipe1Vencedora && (
                                  <span className="ml-1 text-green-500">✓</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div
                                className={`text-sm font-medium ${
                                  isEquipe2Vencedora
                                    ? "text-green-700 font-bold"
                                    : "text-gray-900"
                                }`}
                              >
                                {e2}
                                {isEquipe2Vencedora && (
                                  <span className="ml-1 text-green-500">✓</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-lg font-bold text-gray-900">
                                {placarDisplay}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`text-sm font-bold ${resultadoCor}`}
                              >
                                {resultado}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando{" "}
                    <span className="font-medium">
                      {partidasParaMostrar.length}
                    </span>{" "}
                    partidas
                  </div>

                  <div className="mt-2 sm:mt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="text-gray-600"
                    >
                      ↑ Voltar ao topo
                    </Button>
                  </div>
                </div>
              </>
            )}
        </Card>
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
  size = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: "default" | "sm";
}) => {
  const baseClasses = "font-medium transition-colors rounded-lg";
  const sizeClasses = size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-2";

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
  }[variant];

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
