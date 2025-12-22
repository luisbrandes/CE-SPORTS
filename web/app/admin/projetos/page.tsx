"use client";

import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo, Suspense } from "react";
import { Pencil, Trash2, CalendarDays, MapPin, Users, Search, X, Dumbbell } from "lucide-react";
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

function ProjetosPageContent() {
  const searchParams = useSearchParams()
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

  const projetosFiltrados = useMemo(() => {
    return projetos.filter((p) => {
      const nome = (p.nome || "").toLowerCase();
      const modalidade = (p.modalidade || "").toLowerCase();
      const local = (p.local || "").toLowerCase();

      const filtroNomeLower = filtroNome.toLowerCase();
      const filtroModalidadeLower = filtroModalidade.toLowerCase();
      const filtroLocalLower = filtroLocal.toLowerCase();

      const matchNome = filtroNomeLower === "" || nome.includes(filtroNomeLower);
      const matchModalidade = filtroModalidadeLower === "" || modalidade.includes(filtroModalidadeLower);
      const matchLocal = filtroLocalLower === "" || local.includes(filtroLocalLower);

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
      alert("Projeto removido com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao remover projeto. Confira o console.");
    }
  };

  const formatarData = (data: string) => new Date(data).toLocaleDateString("pt-BR");

  const getProgressColor = (preenchidas: number, totais: number) => {
    const percent = (preenchidas / totais) * 100;
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-orange-400";
    return "bg-emerald-500";
  };

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ">

      <header className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white rounded-2xl border border-[#E5E7F0] px-4 sm:px-6 py-4 sm:py-5 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl">📑</span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#14539A]">
                Gerenciar Projetos
              </h1>
            </div>
            <p className="text-sm sm:text-base text-[#7C8698]">
              Organize e acompanhe seus projetos esportivos
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => router.push("/admin/projetos/cadastrarProjetos")}
              className="w-full sm:w-auto bg-[#FFC94B] hover:bg-[#ffbf24] text-[#1B3C6D] font-semibold shadow-sm rounded-full px-5 sm:px-6 py-2.5 h-auto"
            >
              + Adicionar Projeto
            </Button>
            <Button
              onClick={() => router.push("/admin/projetos/propostas")}
              variant="outline"
              className="w-full sm:w-auto border-[#E5E7F0] text-[#14539A] hover:bg-[#F2F4FB] font-semibold rounded-full px-5 sm:px-6 py-2.5 h-auto"
            >
              📄 Propostas
            </Button>
          </div>
        </div>
      </header>

      
      <section className="mb-6 lg:mb-8">
        <Card className="border border-[#E5E7F0] rounded-2xl shadow-sm bg-white px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#14539A]">Filtros</h2>
              <p className="text-xs sm:text-sm text-[#7C8698]">Encontre projetos rapidamente</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm bg-[#FFF5CF] text-[#E2A01D] px-3 py-1.5 rounded-full font-semibold">
                {projetosFiltrados.length} de {projetos.length} projetos
              </span>
              <Button
                variant="outline"
                onClick={limparFiltros}
                className="h-9 sm:h-10 rounded-full border-[#E5E7F0] text-[#14539A] hover:bg-[#F2F4FB] px-3 sm:px-4 text-xs sm:text-sm"
              >
                <X className="w-4 h-4 mr-1" /> Limpar filtros
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B2BACB]" />
              <Input
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                placeholder="Pesquisar por nome..."
                className="pl-9 h-11 rounded-xl border-[#E0E3EB] text-sm"
              />
            </div>
            <Input
              value={filtroModalidade}
              onChange={(e) => setFiltroModalidade(e.target.value)}
              placeholder="Ex: Futsal, Vôlei..."
              className="h-11 rounded-xl border-[#E0E3EB] text-sm"
            />
            <Input
              value={filtroLocal}
              onChange={(e) => setFiltroLocal(e.target.value)}
              placeholder="Ex: Quadra A..."
              className="h-11 rounded-xl border-[#E0E3EB] text-sm"
            />
          </div>
        </Card>
      </section>

    
      {loading ? (
        <Card className="border border-[#E5E7F0] rounded-2xl shadow-sm bg-white py-16 text-center">
          <div className="mx-auto mb-4 h-8 w-8 border-2 border-[#14539A] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm sm:text-base text-[#7C8698]">Carregando projetos...</p>
        </Card>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {projetosFiltrados.length > 0 ? (
            projetosFiltrados.map((proj) => {
              const progress = proj.vagasTotais > 0 ? (proj.vagasPreenchidas / proj.vagasTotais) * 100 : 0;

              return (
                <Card
                  key={proj.id}
                  className="flex flex-col justify-between border border-[#E5E7F0] rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="flex justify-between gap-3">
                      <h3 className="text-base sm:text-lg font-semibold text-[#14539A] line-clamp-1">
                        {proj.nome}
                      </h3>
                      <span className="text-[11px] uppercase tracking-wide text-[#E2A01D] font-bold shrink-0 bg-[#FFF5CF] px-2 py-0.5 rounded">
                        {proj.modalidade}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#7C8698] leading-relaxed line-clamp-2 min-h-[40px]">
                      {proj.descricao}
                    </p>

                    <hr className="border-[#F0F1F6]" />

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#14539A]">
                        <MapPin className="w-4 h-4 text-[#FFC94B]" />
                        <span>{proj.local}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#14539A]">
                        <CalendarDays className="w-4 h-4 text-[#14539A]" />
                        <span>{formatarData(proj.dataInicio)} – {formatarData(proj.dataFim)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#14539A]">
                        <Users className="w-4 h-4 text-[#FFC94B]" />
                        <span>{proj.responsavel}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-[#A0A7B8]">
                        <span>{proj.vagasPreenchidas}/{proj.vagasTotais} vagas</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#F0F1F6] overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(proj.vagasPreenchidas, proj.vagasTotais)}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                 
                  <div className="bg-[#F8F9FD] border-t border-[#F0F1F6] p-4 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#D2D7E5] text-[#14539A] hover:bg-white text-xs font-semibold h-9"
                        onClick={() => router.push(`/admin/projetos/editar/${proj.id}`)}
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1.5" /> Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#D2D7E5] text-[#14539A] hover:bg-white text-xs font-semibold h-9"
                        onClick={() => router.push(`/admin/projetos/${proj.id}/inscritos`)}
                      >
                        <Users className="w-3.5 h-3.5 mr-1.5" /> Inscritos
                      </Button>
                    </div>
                    
                    {/* Parte que liga os filtros de treino ao projeto */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-[#14539A] text-[#14539A] hover:bg-[#14539A] hover:text-white text-xs font-bold h-9 transition-all"
                      onClick={() => router.push(`/admin/treino?modalidade=${proj.modalidade}`)}
                    >
                      <Dumbbell className="w-3.5 h-3.5 mr-1.5" /> Ver Treinos de {proj.modalidade}
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full text-xs font-semibold h-9 bg-[#EF4444] hover:bg-[#dc2626]"
                      onClick={() => handleRemoverProjeto(proj.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remover Projeto
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="col-span-full border border-[#E5E7F0] rounded-2xl shadow-sm bg-white py-14 text-center">
              <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-[#F2F4FB] flex items-center justify-center">
                <Search className="w-5 h-5 text-[#B2BACB]" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[#14539A] mb-1">
                {projetos.length === 0 ? "Nenhum projeto cadastrado ainda." : "Nenhum projeto encontrado."}
              </h3>
              <p className="text-xs sm:text-sm text-[#7C8698]">
                {projetos.length === 0 ? "Clique em “Adicionar Projeto” para começar." : "Tente ajustar ou limpar os filtros."}
              </p>
            </Card>
          )}
        </section>
      )}
    </div>
  );
}

export default function ProjetosPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Carregando projetos...</div>}>
      <ProjetosPageContent />
    </Suspense>
  );
}