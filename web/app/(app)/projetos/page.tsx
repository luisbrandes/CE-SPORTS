"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

export default function Page() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [inscritos, setInscritos] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroModalidade, setFiltroModalidade] = useState("");
  const [filtroLocal, setFiltroLocal] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("http://localhost:8080/api/projetos", {
          credentials: "include",
        });

        const data = await res.json();
        let projetosData: any[] = [];

        if (Array.isArray(data)) projetosData = data;
        else if (data?.content) projetosData = data.content;
        else if (data?.data) projetosData = data.data;
        else if (data?.projetos) projetosData = data.projetos;

        setProjetos(projetosData);

        const inscrRes = await fetch("http://localhost:8080/api/projetos/inscritos", {
          credentials: "include",
        });

        const inscrData = await inscrRes.json();
        setInscritos(Array.isArray(inscrData) ? inscrData : []);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const projetosFiltrados = useMemo(() => {
    return projetos.filter((p) =>
      p.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
      p.modalidade.toLowerCase().includes(filtroModalidade.toLowerCase()) &&
      p.local.toLowerCase().includes(filtroLocal.toLowerCase())
    );
  }, [filtroNome, filtroModalidade, filtroLocal, projetos]);

  const limparFiltros = () => {
    setFiltroNome("");
    setFiltroModalidade("");
    setFiltroLocal("");
  };

  async function inscrever(id: number) {
    try {
      const res = await fetch(`http://localhost:8080/api/projetos/${id}/inscrever`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao se inscrever");

      setInscritos((prev) => [...prev, id]);
      setProjetos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, vagasPreenchidas: p.vagasPreenchidas + 1 } : p
        )
      );
    } catch {
      alert("Erro ao inscrever");
    }
  }

  async function cancelar(id: number) {
    try {
      const res = await fetch(`http://localhost:8080/api/projetos/${id}/cancelar`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao cancelar");

      setInscritos((prev) => prev.filter((x) => x !== id));
      setProjetos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, vagasPreenchidas: p.vagasPreenchidas - 1 } : p
        )
      );
    } catch {
      alert("Erro ao cancelar inscrição");
    }
  }

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Carregando projetos...</p>;

  return (
    <main className="container mx-auto px-6 py-8 min-h-screen">

      <div className="flex justify-center mb-10">
        <Button
          onClick={() => router.push("/proposta/novaProposta")}
          className="px-10 py-6 text-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition rounded-xl"
        >
          ➕ Propor Novo Projeto
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-blue-700 select-none">Projetos</h1>

        <Button
          onClick={() => router.push("/projetos/meus-projetos")}
          className="bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition"
        >
          Minhas Inscrições
        </Button>
      </div>

      <Card className="p-6 mb-10 bg-white border border-gray-300 shadow-md rounded-lg space-y-6">
        <h2 className="font-semibold text-xl text-gray-800 select-none">Filtros</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Input placeholder="Nome" value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} />
          <Input placeholder="Modalidade" value={filtroModalidade} onChange={(e) => setFiltroModalidade(e.target.value)} />
          <Input placeholder="Local" value={filtroLocal} onChange={(e) => setFiltroLocal(e.target.value)} />
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando {projetosFiltrados.length} de {projetos.length} projetos
          </p>
          <Button variant="outline" onClick={limparFiltros}>
            Limpar filtros
          </Button>
        </div>
      </Card>

      <section className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projetosFiltrados.map((p) => {
          const vagasRestantes = p.vagasTotais - p.vagasPreenchidas;
          const estaInscrito = inscritos.includes(p.id);

          return (
            <Card
              key={p.id}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-300 relative flex flex-col"
            >
              {estaInscrito && (
                <span className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  INSCRITO
                </span>
              )}

              <h2 className="text-2xl font-bold text-blue-700 mb-2 truncate">{p.nome}</h2>

              <p className="text-sm text-gray-600"><strong>Modalidade:</strong> {p.modalidade}</p>
              <p className="text-sm text-gray-600"><strong>Local:</strong> {p.local}</p>
              <p className="text-sm text-gray-600"><strong>Responsável:</strong> {p.responsavel}</p>

              <p className="mt-3 text-sm text-gray-700 flex-grow">{p.descricao}</p>

              <p className="mt-3 text-sm font-semibold text-gray-700">
                Vagas: {p.vagasPreenchidas} / {p.vagasTotais}
              </p>

              <div className="mt-5">
                {!estaInscrito ? (
                  <Button
                    disabled={vagasRestantes <= 0}
                    onClick={() => inscrever(p.id)}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    {vagasRestantes > 0 ? "Inscrever-se" : "Sem vagas"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => cancelar(p.id)}
                    className="w-full border-red-500 text-red-500 hover:bg-red-50 transition"
                  >
                    Cancelar inscrição
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
