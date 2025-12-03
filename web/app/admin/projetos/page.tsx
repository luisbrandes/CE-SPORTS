"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { Pencil, Trash2, CalendarDays, MapPin, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const [loading, setLoading] = useState(true);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroModalidade, setFiltroModalidade] = useState("");
  const [filtroLocal, setFiltroLocal] = useState("");

  const carregarProjetos = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/projetos", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Falha ao buscar projetos");

      const data = await res.json();
      setProjetos(data);
    } catch (err) {
      console.error("Erro ao buscar projetos:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORREÇÃO PRINCIPAL: Filtro seguro com tratamento de valores nulos/undefined
  const projetosFiltrados = useMemo(() => {
    return projetos.filter((p) => {
      // Tratamento seguro para valores nulos/undefined
      const nome = (p.nome || '').toLowerCase();
      const modalidade = (p.modalidade || '').toLowerCase();
      const local = (p.local || '').toLowerCase();
      
      const filtroNomeLower = filtroNome.toLowerCase();
      const filtroModalidadeLower = filtroModalidade.toLowerCase();
      const filtroLocalLower = filtroLocal.toLowerCase();

      const matchNome = filtroNomeLower === '' || nome.includes(filtroNomeLower);
      const matchModalidade = filtroModalidadeLower === '' || modalidade.includes(filtroModalidadeLower);
      const matchLocal = filtroLocalLower === '' || local.includes(filtroLocalLower);

      return matchNome && matchModalidade && matchLocal;
    });
  }, [projetos, filtroNome, filtroModalidade, filtroLocal]);

  const limparFiltros = () => {
    setFiltroNome("");
    setFiltroModalidade("");
    setFiltroLocal("");
  };

  useEffect(() => {
    carregarProjetos();
  }, []);

  const handleRemoverProjeto = async (id: number) => {
    if (!confirm("Deseja realmente remover este projeto?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/projetos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao remover projeto");

      setProjetos((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Projeto removido com sucesso!");
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao remover projeto. Confira o console.");
    }
  };

  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString("pt-BR");

  return (
    <main className="p-8 space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-blue-700">📋 Gerenciar Projetos</h1>

        <Button
          onClick={() => router.push("/admin/projetos/cadastrarProjetos")}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          ＋ Adicionar Projeto
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-6 mb-8 space-y-4 bg-gray-50 border border-gray-200 shadow-sm">
        <h2 className="font-semibold text-lg">Filtros</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input 
              value={filtroNome} 
              onChange={(e) => setFiltroNome(e.target.value)} 
              placeholder="Pesquisar..." 
            />
          </div>

          <div>
            <label className="text-sm font-medium">Modalidade</label>
            <Input 
              value={filtroModalidade} 
              onChange={(e) => setFiltroModalidade(e.target.value)} 
              placeholder="Ex: Futsal" 
            />
          </div>

          <div>
            <label className="text-sm font-medium">Local</label>
            <Input 
              value={filtroLocal} 
              onChange={(e) => setFiltroLocal(e.target.value)} 
              placeholder="Ex: Quadra A" 
            />
          </div>
        </div>

        <div className="flex justify-between pt-1">
          <p className="text-sm text-gray-600">
            Mostrando {projetosFiltrados.length} de {projetos.length} projetos
          </p>

          <Button variant="outline" onClick={limparFiltros}>
            Limpar filtros
          </Button>
        </div>
      </Card>

      {/* LISTAGEM */}
      {loading ? (
        <p className="text-center text-gray-500">Carregando projetos...</p>
      ) : (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetosFiltrados.length > 0 ? (
            projetosFiltrados.map((proj) => (
              <Card
                key={proj.id}
                className="p-6 flex flex-col justify-between border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900">{proj.nome}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {proj.modalidade}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {proj.descricao}
                  </p>

                  <div className="text-sm space-y-1 pt-2">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="text-blue-600" />
                      <strong>Local:</strong> {proj.local}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-blue-600" />
                      <strong>Período:</strong> {formatarData(proj.dataInicio)} –{" "}
                      {formatarData(proj.dataFim)}
                    </p>

                    <p>
                      <strong>Responsável:</strong> {proj.responsavel}
                    </p>

                    <p className="flex items-center gap-2">
                      <Users size={16} className="text-blue-600" />
                      <strong>Vagas:</strong>{" "}
                      {proj.vagasPreenchidas}/{proj.vagasTotais}
                    </p>
                  </div>
                </div>

                {/* BOTÕES */}
                <div className="flex gap-2 mt-5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                    onClick={() => router.push(`/admin/projetos/editar/${proj.id}`)}
                  >
                    <Pencil size={16} /> Editar
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-1"
                    onClick={() => handleRemoverProjeto(proj.id)}
                  >
                    <Trash2 size={16} /> Remover
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              {projetos.length === 0 
                ? "Nenhum projeto cadastrado ainda." 
                : "Nenhum projeto encontrado com os filtros aplicados."
              }
            </p>
          )}
        </section>
      )}
    </main>
  );
}
