"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    const candidates = ["/api/partida"];
    let lastError: any = null;

    for (const url of candidates) {
      try {
        const res = await fetch("http://localhost:8080/api/partida", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });
        if (!res.ok) {
          lastError = `endpoint ${url} retornou ${res.status}`;
          continue;
        }
        const json = await res.json();
        const arr = Array.isArray(json)
          ? json
          : json?.data ?? json?.content ?? json?.partidas ?? null;
        if (!arr || !Array.isArray(arr)) {
          lastError = `endpoint ${url} retornou formato inesperado`;
          continue;
        }
        const normalized = arr.map((p: ApiPartidaRaw) => ({
          ...p,
          pontuacao1: normalizeScore(p.pontuacao1 as any),
          pontuacao2: normalizeScore(p.pontuacao2 as any),
        }));
        setPartidas(normalized);
        setLoading(false);
        return;
      } catch (e) {
        lastError = e;
      }
    }

    setLoading(false);
    setError(
      `Não foi possível obter partidas: ${
        typeof lastError === "string"
          ? lastError
          : (lastError && lastError.message) || "erro desconhecido"
      }. Verifique o endpoint da API.`
    );
  };

  useEffect(() => {
    fetchPartidas();
  }, []);

  const sortedPartidas = useMemo(() => {
    if (!partidas) return null;
    return [...partidas].sort((a, b) => {
      const aDate = a.data ? Date.parse(a.data) : NaN;
      const bDate = b.data ? Date.parse(b.data) : NaN;
      if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) return bDate - aDate;
      if (!Number.isNaN(aDate)) return -1;
      if (!Number.isNaN(bDate)) return 1;
      const aId = a.id ?? 0;
      const bId = b.id ?? 0;
      return bId - aId;
    });
  }, [partidas]);

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">
              Histórico de Partidas
            </h1>
          </div>

          <div className="flex items-center gap-3">
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
              onClick={() => {
                fetchPartidas();
              }}
            >
              Refresh
            </Button>

            <Link href="/admin/campeonatos/registrar-partida">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-5"
              >
                ➕ Nova Partida
              </Button>
            </Link>
          </div>
        </div>

        <Card className="p-4">
          {loading && (
            <div className="py-8 text-center">Carregando partidas...</div>
          )}

          {!loading && error && (
            <div className="py-6">
              <div className="text-red-600 mb-2">Erro: {error}</div>
              <div className="text-sm text-muted-foreground mb-4">
                Se a API não estiver pronta, você pode usar dados mock:
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => fetchPartidas()}>
                  Tentar novamente
                </Button>
              </div>
            </div>
          )}

          {!loading && sortedPartidas && sortedPartidas.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              Nenhuma partida encontrada.
            </div>
          )}

          {!loading && sortedPartidas && sortedPartidas.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-2 text-left">Campeonato</th>
                    <th className="p-2 text-left">Equipe 1</th>
                    <th className="p-2 text-left">Equipe 2</th>
                    <th className="p-2 text-left">Placar</th>
                    <th className="p-2 text-left">Resultado</th>
                    <th className="p-2 text-left">Data</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedPartidas.map((p, idx) => {
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
                    if (p.empate) resultado = "Empate";
                    else if (p.vencedor) resultado = normalizeName(p.vencedor);
                    else if (typeof g1 === "number" && typeof g2 === "number") {
                      if (g1 > g2) resultado = e1;
                      else if (g2 > g1) resultado = e2;
                      else resultado = "—";
                    }

                    const dataStr = p.data
                      ? new Date(p.data).toLocaleString("pt-BR")
                      : "-";

                    return (
                      <tr
                        key={p.id ?? idx}
                        className="border-t border-border hover:bg-muted/30 transition"
                      >
                        <td className="p-2 text-black">{camp}</td>
                        <td className="p-2">{e1}</td>
                        <td className="p-2">{e2}</td>
                        <td className="p-2 font-medium">{placarDisplay}</td>
                        <td className="p-2">{resultado}</td>
                        <td className="p-2">{dataStr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
