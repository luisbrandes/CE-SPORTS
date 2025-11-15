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

export default function CampeonatosPage() {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 busca os campeonatos do backend
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
        {campeonatos.map((camp) => (
          <Card key={camp.id}>
            <h3 className="text-xl font-semibold mb-2 text-black">
              {camp.nome}
            </h3>
            <p className="text-sm mb-4 text-muted-foreground">
              {camp.equipes && camp.equipes.length > 0 ? (
                <>
                  Equipes participantes:{" "}
                  <strong>{camp.equipes.map((e) => e.nome).join(", ")}</strong>
                </>
              ) : (
                "Nenhuma equipe registrada ainda."
              )}
            </p>
            <Button variant="outline">Ver Detalhes</Button>
          </Card>
        ))}
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
