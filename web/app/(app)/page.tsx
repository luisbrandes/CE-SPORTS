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
  const router = useRouter();

  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [inscritos, setInscritos] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroModalidade, setFiltroModalidade] = useState("");
  const [filtroLocal, setFiltroLocal] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:8080/api/projetos", {
          credentials: "include",
        });

        const data = await res.json();

        let lista: any[] = [];

        if (Array.isArray(data)) lista = data;
        else if (data?.content) lista = data.content;
        else if (data?.data) lista = data.data;
        else if (data?.projetos) lista = data.projetos;

        setProjetos(Array.isArray(lista) ? lista : []);

        const inscRes = await fetch("http://localhost:8080/api/projetos/inscritos", {
          credentials: "include",
        });

        const ids = await inscRes.json();
        setInscritos(Array.isArray(ids) ? ids : []);
      } catch (err) {
        console.error("Erro ao carregar projetos:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const projetosFiltrados = useMemo(() => {
    return projetos.filter((p) => {
      const nome = p.nome.toLowerCase().includes(filtroNome.toLowerCase());
      const modalidade = p.modalidade.toLowerCase().includes(filtroModalidade.toLowerCase());
      const local = p.local.toLowerCase().includes(filtroLocal.toLowerCase());
      return nome && modalidade && local;
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

      if (!res.ok) throw new Error();

      setInscritos((prev) => [...prev, id]);
      setProjetos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, vagasPreenchidas: p.vagasPreenchidas + 1 } : p
        )
      );
    } catch {
      alert("Erro ao se inscrever");
    }
  }

  async function cancelar(id: number) {
    try {
      const res = await fetch(`http://localhost:8080/api/projetos/${id}/cancelar`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error();

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
    return <p className="text-center mt-10 text-gray-500">Carregando projetos...</p>;

  return (
    <main className="container mx-auto px-6 py-8 min-h-screen">

     
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-blue-700 select-none">Projetossss</h1>

        <div className="flex gap-4">
          <Button
            onClick={() => router.push("/meus-projetos")}
            className="bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition"
          >
            Minhas Inscrições
          </Button>

          <Button
            onClick={() => router.push("/proporProjetos")}
            className="bg-yellow-500 text-white shadow-md hover:bg-yellow-600 hover:shadow-lg transition"
          >
            Propor Projeto
          </Button>
        </div>
      </div>

   
      <Card className="p-6 mb-10 bg-white border border-gray-300 shadow-md rounded-lg space-y-6">
        <h2 className="font-semibold text-xl text-gray-800 select-none">Filtros</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Nome</label>
            <Input
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              placeholder="Pesquisar..."
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Modalidade</label>
            <Input
              value={filtroModalidade}
              onChange={(e) => setFiltroModalidade(e.target.value)}
              placeholder="Ex: Futsal"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Local</label>
            <Input
              value={filtroLocal}
              onChange={(e) => setFiltroLocal(e.target.value)}
              placeholder="Ex: Quadra A"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando {projetosFiltrados.length} de {projetos.length} projetos
          </p>
          <Button variant="outline" onClick={limparFiltros} className="hover:bg-gray-100">
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
