"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function PartidasPage() {
  const [partidas, setPartidas] = useState<ApiPartidaRaw[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros
  const [filtroCampeonato, setFiltroCampeonato] = useState<string>("todos");
  const [filtroEquipe, setFiltroEquipe] = useState<string>("todos");
  const [filtroData, setFiltroData] = useState<string>("");

  // Listas para selects
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
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-black">
              Histórico de Partidas
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Visualize e filtre todas as partidas registradas
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/admin/campeonatos">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                ← Voltar para Campeonatos
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchPartidas}
              disabled={loading}
            >
              {loading ? "Carregando..." : "🔄 Atualizar"}
            </Button>
          </div>
        </div>

        {/* Seção de Filtros */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data (YYYY-MM-DD)
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

          {/* Contador e estatísticas */}
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

        {/* Tabela de Partidas */}
        <Card className="p-4">
          {loading && (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Carregando partidas...</p>
            </div>
          )}

          {!loading && error && (
            <div className="py-8 text-center">
              <div className="text-red-600 mb-3">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
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
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-2">
                  {filtroCampeonato !== "todos" ||
                  filtroEquipe !== "todos" ||
                  filtroData
                    ? "Nenhuma partida encontrada com os filtros aplicados."
                    : "Nenhuma partida registrada ainda."}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  {filtroCampeonato !== "todos" ||
                  filtroEquipe !== "todos" ||
                  filtroData
                    ? "Tente ajustar os filtros ou limpar todos para ver todas as partidas."
                    : "Registre a primeira partida para começar!"}
                </p>
                {(filtroCampeonato !== "todos" ||
                  filtroEquipe !== "todos" ||
                  filtroData) && (
                  <Button
                    variant="outline"
                    onClick={limparFiltros}
                    className="mt-2"
                  >
                    Limpar filtros
                  </Button>
                )}
                {!filtroCampeonato && !filtroEquipe && !filtroData && (
                  <Link href="/admin/campeonatos/registrar-partida">
                    <Button className="mt-2 bg-blue-600 hover:bg-blue-700">
                      Registrar primeira partida
                    </Button>
                  </Link>
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
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Data
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Campeonato
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Equipe 1
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Equipe 2
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Placar
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
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
                    {partidas &&
                      partidasParaMostrar.length < partidas.length && (
                        <span className="ml-2">
                          (filtrado de{" "}
                          <span className="font-medium">{partidas.length}</span>{" "}
                          no total)
                        </span>
                      )}
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
