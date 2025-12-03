"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Projeto {
  id: number;
  nome: string;
  descricao: string;
  modalidade: string;
  local: string;
  dataInicio: string;
  dataFim: string;
  responsavel: string;
  vagasTotais: number;
  vagasPreenchidas: number;
}

export default function MeusProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [inscritos, setInscritos] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:8080/api/projetos", {
          credentials: "include",
        });
        const data = await res.json();
        setProjetos(data);

        const inscRes = await fetch("http://localhost:8080/api/projetos/inscritos", {
          credentials: "include",
        });
        const inscIds = await inscRes.json();
        setInscritos(inscIds);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Carregando...</p>;

  const meusProjetos = projetos.filter((p) => inscritos.includes(p.id));

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meus Projetos Inscritos</h1>

      {meusProjetos.length === 0 ? (
        <p className="text-gray-600">Você ainda não está inscrito em nenhum projeto.</p>
      ) : (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meusProjetos.map((p) => (
            <Card key={p.id} className="p-5 bg-white rounded-xl">
              <h2 className="text-xl font-bold text-blue-600">{p.nome}</h2>

              <p><strong>Modalidade:</strong> {p.modalidade}</p>
              <p><strong>Local:</strong> {p.local}</p>
              <p><strong>Responsável:</strong> {p.responsavel}</p>

              <p className="mt-3 text-sm text-gray-600">{p.descricao}</p>

              <p className="mt-3 text-sm font-semibold">
                Vagas: {p.vagasPreenchidas}/{p.vagasTotais}
              </p>
            </Card>
          ))}
        </section>
      )}

      <Button
        onClick={() => window.history.back()}
        className="mt-6"
        variant="outline"
      >
        Voltar
      </Button>
    </main>
  );
}
