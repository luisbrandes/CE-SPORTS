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

export default function ProjetosPage() {
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

        // Normaliza resposta
        let projetosData: any[] = [];
        if (Array.isArray(data)) {
          projetosData = data;
        } else if (data && typeof data === "object") {
          if (Array.isArray((data as any).content)) projetosData = (data as any).content;
          else if (Array.isArray((data as any).data)) projetosData = (data as any).data;
          else if (Array.isArray((data as any).projetos)) projetosData = (data as any).projetos;
          else projetosData = [];
        }

        if (!Array.isArray(projetosData)) projetosData = [];
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
    const lista = Array.isArray(projetos) ? projetos : [];
    return lista.filter((p) => {
      const matchNome = (p.nome || "").toLowerCase().includes(filtroNome.toLowerCase());
      const matchModalidade = (p.modalidade || "").toLowerCase().includes(filtroModalidade.toLowerCase());
      const matchLocal = (p.local || "").toLowerCase().includes(filtroLocal.toLowerCase());
      return matchNome && matchModalidade && matchLocal;
    });
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
        prev.map((p) => (p.id === id ? { ...p, vagasPreenchidas: p.vagasPreenchidas + 1 } : p))
      );
    } catch (err) {
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
        prev.map((p) => (p.id === id ? { ...p, vagasPreenchidas: p.vagasPreenchidas - 1 } : p))
      );
    } catch (err) {
      alert("Erro ao cancelar inscrição");
    }
  }

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Carregando projetos...</p>;

  return (
    <main className="container mx-auto px-6 py-8 min-h-screen 0">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-blue-700 select-none">Projetos</h1>

        <Button
          onClick={() => router.push("/projetos/meus-projetos")}
          className="bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition"
        >
          Minhas Inscrições
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-6 mb-10 bg-white border border-gray-300 shadow-md rounded-lg space-y-6">
        <h2 className="font-semibold text-xl text-gray-800 select-none">Filtros</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 select-none">Nome</label>
            <Input
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              placeholder="Pesquisar..."
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 select-none">Modalidade</label>
            <Input
              value={filtroModalidade}
              onChange={(e) => setFiltroModalidade(e.target.value)}
              placeholder="Ex: Futsal"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 select-none">Local</label>
            <Input
              value={filtroLocal}
              onChange={(e) => setFiltroLocal(e.target.value)}
              placeholder="Ex: Quadra A"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600 select-text">
            Mostrando {projetosFiltrados.length} de {projetos.length} projetos
          </p>
          <Button variant="outline" onClick={limparFiltros} className="hover:bg-gray-100">
            Limpar filtros
          </Button>
        </div>
      </Card>

      {/* Cards */}
      <section className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projetosFiltrados.map((p) => {
          const vagasRestantes = p.vagasTotais - p.vagasPreenchidas;
          const estaInscrito = inscritos.includes(p.id);

          return (
            <Card
              key={p.id}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-300 relative flex flex-col"
            >
              {/* Badge inscrito */}
              {estaInscrito && (
                <span className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full select-none">
                  INSCRITO
                </span>
              )}

              <h2 className="text-2xl font-bold text-blue-700 mb-2 select-text truncate">{p.nome}</h2>

              <p className="text-sm text-gray-600">
                <strong>Modalidade:</strong> {p.modalidade}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Local:</strong> {p.local}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Responsável:</strong> {p.responsavel}
              </p>

              <p className="mt-3 text-sm text-gray-700 flex-grow select-text">{p.descricao}</p>

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
