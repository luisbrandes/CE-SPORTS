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

        let projetosData: any[] = [];
        if (Array.isArray(data)) {
          projetosData = data;
        } else if (data && typeof data === "object") {
          if (Array.isArray((data as any).content)) projetosData = (data as any).content;
          else if (Array.isArray((data as any).data)) projetosData = (data as any).data;
          else if (Array.isArray((data as any).projetos)) projetosData = (data as any).projetos;
          else projetosData = [];
        }

        setProjetos(Array.isArray(projetosData) ? projetosData : []);

        const inscRes = await fetch("http://localhost:8080/api/projetos/inscritos", {
          credentials: "include",
        });
        const inscIds = await inscRes.json();
        setInscritos(Array.isArray(inscIds) ? inscIds : []);
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
    <main className="container mx-auto px-6 py-8 min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 select-none">
        Meus Projetos Inscritos
      </h1>

      {meusProjetos.length === 0 ? (
        <p className="text-gray-600 text-center text-lg select-text">
          Você ainda não está inscrito em nenhum projeto.
        </p>
      ) : (
        <section className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {meusProjetos.map((p) => (
            <Card
              key={p.id}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-300 transition"
            >
              <h2 className="text-2xl font-bold text-blue-700 mb-3 select-text truncate">
                {p.nome}
              </h2>

              <p className="text-sm text-gray-700 mb-1">
                <strong>Modalidade:</strong> {p.modalidade}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Local:</strong> {p.local}
              </p>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Responsável:</strong> {p.responsavel}
              </p>

              <p className="text-sm text-gray-600 mb-5 select-text">{p.descricao}</p>

              <p className="text-sm font-semibold text-gray-700">
                Vagas: {p.vagasPreenchidas} / {p.vagasTotais}
              </p>
            </Card>
          ))}
        </section>
      )}

      <div className="flex justify-center">
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          className="mt-10 px-8 py-3 hover:bg-gray-100 transition"
        >
          Voltar
        </Button>
      </div>
    </main>
  );
}
