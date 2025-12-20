"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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

interface PropostaProjeto {
  id: number;
  nome: string;
  descricao: string;
  modalidade: string;
  local: string;
  alunoNome: string;
  mediaAvaliacoes?: number;
  minhaNota?: number | null;
}

interface AvaliacaoResponse {
  id: number;
  mediaAvaliacoes?: number;
}

function Estrelas({
  valor,
  onChange,
  disabled = false,
  isLoading = false
}: {
  valor: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  return (
    <div className="relative">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => !disabled && onChange(n)}
            disabled={disabled || isLoading}
            className={cn(
              "text-2xl transition-all duration-200",
              !disabled && !isLoading && "hover:scale-110",
              n <= valor ? "text-yellow-500" : "text-gray-300",
              (disabled || isLoading) && "cursor-not-allowed",
              !disabled && !isLoading && "hover:text-yellow-400"
            )}
            aria-label={`Nota ${n} estrelas`}
          >
            ★
          </button>
        ))}
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded">
          <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default function ProjetosPage() {
  const router = useRouter();

  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [propostas, setPropostas] = useState<PropostaProjeto[]>([]);
  const [inscritos, setInscritos] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [avaliando, setAvaliando] = useState<number | null>(null);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroModalidade, setFiltroModalidade] = useState("");
  const [filtroLocal, setFiltroLocal] = useState("");
  const [filtroPropostaNome, setFiltroPropostaNome] = useState("");
  const [filtroPropostaAluno, setFiltroPropostaAluno] = useState("");
  const [filtroPropostaModalidade, setFiltroPropostaModalidade] = useState("");


  const loadData = async () => {
    try {
      setLoading(true);


      const projetosRes = await fetch("http://localhost:8080/api/projetos", {
        credentials: "include",
      });
      if (projetosRes.ok) {
        setProjetos(await projetosRes.json());
      }


      const inscritosRes = await fetch(
        "http://localhost:8080/api/projetos/inscritos",
        { credentials: "include" }
      );
      if (inscritosRes.ok) {
        setInscritos(await inscritosRes.json());
      }


      try {
        const propostasRes = await fetch(
          "http://localhost:8080/api/propostas",
          {
            credentials: "include",
            headers: {
              "Cache-Control": "no-cache"
            }
          }
        );

        if (propostasRes.ok) {
          const propostasData = await propostasRes.json();
          console.log("Propostas carregadas:", propostasData);
          setPropostas(propostasData);
        } else {
          console.warn("Erro ao carregar propostas:", propostasRes.status);
          setPropostas([]);
        }
      } catch (propostasError) {
        console.error("Erro na requisição de propostas:", propostasError);
        setPropostas([]);
      }

    } catch (e) {
      console.error("Erro geral ao carregar dados", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


 const carregarPropostas = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/propostas", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) return;

      const data: any[] = await res.json();

      setPropostas((prev) =>
        data.map((p) => {
          const anterior = prev.find((x) => x.id === p.id);

          return {
            ...p,
            mediaAvaliacoes: typeof p.mediaAvaliacoes === "number" ? p.mediaAvaliacoes : 0,
            minhaNota: anterior?.minhaNota ?? p.minhaNota ?? null,
          };
        })
      );
    } catch (e) {
      console.error("Erro ao carregar propostas", e);
    }
  };

  const projetosFiltrados = useMemo(() => {
    return projetos.filter(
      (p) =>
        p.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
        p.modalidade.toLowerCase().includes(filtroModalidade.toLowerCase()) &&
        p.local.toLowerCase().includes(filtroLocal.toLowerCase())
    );
  }, [projetos, filtroNome, filtroModalidade, filtroLocal]);

  const limparFiltros = () => {
    setFiltroNome("");
    setFiltroModalidade("");
    setFiltroLocal("");
  };

  const propostasFiltradas = useMemo(() => {
    return propostas.filter((p) =>
      p.nome.toLowerCase().includes(filtroPropostaNome.toLowerCase()) &&
      p.alunoNome.toLowerCase().includes(filtroPropostaAluno.toLowerCase()) &&
      p.modalidade.toLowerCase().includes(filtroPropostaModalidade.toLowerCase())
    );
  }, [propostas, filtroPropostaNome, filtroPropostaAluno, filtroPropostaModalidade]);

  async function inscrever(id: number) {
    await fetch(`http://localhost:8080/api/projetos/${id}/inscrever`, {
      method: "POST",
      credentials: "include",
    });

    setInscritos((p) => [...p, id]);
    setProjetos((p) =>
      p.map((x) =>
        x.id === id
          ? { ...x, vagasPreenchidas: x.vagasPreenchidas + 1 }
          : x
      )
    );
  }

  async function cancelar(id: number) {
    await fetch(`http://localhost:8080/api/projetos/${id}/cancelar`, {
      method: "POST",
      credentials: "include",
    });

    setInscritos((p) => p.filter((x) => x !== id));
    setProjetos((p) =>
      p.map((x) =>
        x.id === id
          ? { ...x, vagasPreenchidas: x.vagasPreenchidas - 1 }
          : x
      )
    );
  }


   async function avaliarProposta(propostaId: number, nota: number) {
    if (avaliando === propostaId) return;

    setAvaliando(propostaId);

  
    setPropostas((prev) =>
      prev.map((p) =>
        p.id === propostaId ? { ...p, minhaNota: nota } : p
      )
    );

    try {
      await fetch(
        `http://localhost:8080/api/propostas/${propostaId}/avaliar`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nota }),
        }
      );

      
      await carregarPropostas();
    } catch (e) {
      console.error("Erro ao avaliar", e);
    } finally {
      setAvaliando(null);
    }
  }




  if (loading) {
    return (
      <main className="container mx-auto px-6 py-12 min-h-screen ">
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-center text-gray-500 text-xl">Carregando projetos...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-8 min-h-screen ">
      {/* Cabeçalho */}
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4 select-none">
          Projetos Esportivos
        </h1>
        <p className="text-xl text-gray-600">
          Inscreva-se nos projetos disponíveis e avalie propostas de novos projetos
        </p>
      </div>

      {/* Cabeçalho com botões */}
      <div className="flex flex-wrap gap-3 justify-center mb-12 max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.push("/projetos/proposta/minhas")}
          className="hover:bg-gray-100"
        >
          Minhas Propostas
        </Button>
        <Button
          onClick={() => router.push("/projetos/proposta/novas")}
          className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
        >
          Propor Projeto
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push("/projetos/meus-projetos")}
          className="hover:bg-gray-100"
        >
          Minhas Inscrições
        </Button>

      </div>

      {/* Filtros Projetos */}
      <Card className="p-6 mb-12 bg-white border border-gray-300 shadow-md rounded-xl space-y-6 max-w-4xl mx-auto">
        <h2 className="font-semibold text-xl text-gray-800 select-none">Filtrar Projetos</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 select-none">
              Nome
            </label>
            <Input
              placeholder="Ex: Futsal..."
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 select-none">
              Modalidade
            </label>
            <Input
              placeholder="Ex: Futsal, Vôlei..."
              value={filtroModalidade}
              onChange={(e) => setFiltroModalidade(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 select-none">
              Local
            </label>
            <Input
              placeholder="Ex: Quadra A..."
              value={filtroLocal}
              onChange={(e) => setFiltroLocal(e.target.value)}
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

      {/* Lista de Projetos */}
      <section className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto">
        {projetosFiltrados.map((p) => {
          const vagasRestantes = p.vagasTotais - p.vagasPreenchidas;
          const estaInscrito = inscritos.includes(p.id);

          return (
            <Card
              key={p.id}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-300 relative flex flex-col group hover:-translate-y-1"
            >
              {estaInscrito && (
                <span className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full select-none shadow-md">
                  INSCRITO
                </span>
              )}

              <h2 className="text-2xl font-bold text-blue-700 mb-4 select-text truncate group-hover:text-blue-800 transition-colors">
                {p.nome}
              </h2>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Modalidade:</strong> {p.modalidade}
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Local:</strong> {p.local}
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Responsável:</strong> {p.responsavel}
                </p>
              </div>

              <p className="text-sm text-gray-600 flex-grow mb-4 select-text leading-relaxed">
                {p.descricao}
              </p>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-800 bg-gray-50 p-2 rounded-lg">
                  Vagas: <span className="text-blue-600">{p.vagasPreenchidas}</span> /{' '}
                  <span className="text-blue-600">{p.vagasTotais}</span>
                </p>

                <div>
                  {!estaInscrito ? (
                    <Button
                      disabled={vagasRestantes <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        inscrever(p.id);
                      }}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                      {vagasRestantes > 0 ? "Inscrever-se" : "Sem vagas"}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelar(p.id);
                      }}
                      className="w-full border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600 transition-all shadow-sm"
                    >
                      Cancelar inscrição
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </section>


      {/* Propostas */}
      <section className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 select-none">
            Propostas de Novos Projetos
          </h2>

        </div>

        {/* Filtros Propostas */}
        <Card className="p-6 mb-10 bg-white border border-gray-300 shadow-md rounded-xl space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2 select-none">
                Nome da proposta
              </label>
              <Input
                value={filtroPropostaNome}
                onChange={(e) => setFiltroPropostaNome(e.target.value)}
                placeholder="Ex: Torneio de Xadrez..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2 select-none">
                Aluno
              </label>
              <Input
                value={filtroPropostaAluno}
                onChange={(e) => setFiltroPropostaAluno(e.target.value)}
                placeholder="Ex: João Silva..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2 select-none">
                Modalidade
              </label>
              <Input
                value={filtroPropostaModalidade}
                onChange={(e) => setFiltroPropostaModalidade(e.target.value)}
                placeholder="Ex: Xadrez..."
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600 select-text">
              Mostrando {propostasFiltradas.length} de {propostas.length} propostas
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFiltroPropostaNome("");
                setFiltroPropostaAluno("");
                setFiltroPropostaModalidade("");
              }}
              className="hover:bg-gray-100"
            >
              Limpar filtros
            </Button>
          </div>
        </Card>

        {propostasFiltradas.length === 0 ? (
          <Card className="p-12 text-center bg-white border border-gray-200 shadow-sm rounded-xl max-w-2xl mx-auto">
            <p className="text-gray-500 text-lg mb-6 select-text">
              Nenhuma proposta encontrada com os filtros aplicados.
            </p>
            <Button
              variant="outline"
              className="hover:bg-gray-100"
              onClick={() => {
                setFiltroPropostaNome("");
                setFiltroPropostaAluno("");
                setFiltroPropostaModalidade("");
              }}
            >
              Ver todas as propostas
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {propostasFiltradas.map((p) => (
              <Card
                key={p.id}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-300 flex flex-col group hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-blue-700 mb-3 select-text truncate group-hover:text-blue-800">
                  {p.nome}
                </h3>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong className="text-gray-900">Aluno:</strong> {p.alunoNome}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong className="text-gray-900">Modalidade:</strong> {p.modalidade}
                  </p>
                </div>

                <p className="text-sm text-gray-600 flex-grow mb-6 select-text leading-relaxed">
                  {p.descricao}
                </p>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2 select-none">
                      Sua avaliação {p.minhaNota && `(${p.minhaNota} estrelas)`}
                    </label>
                    <Estrelas
                      valor={p.minhaNota ?? 0}
                      onChange={(nota) => avaliarProposta(p.id, nota)}
                      disabled={false}
                      isLoading={avaliando === p.id}
                    />
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold text-blue-700 text-center">
                      Média geral:{" "}
                      <span className="text-lg">
                        {typeof p.mediaAvaliacoes === "number"
                          ? p.mediaAvaliacoes.toFixed(1)
                          : "0.0"}
                      </span>
                      {p.minhaNota && (
                        <span className="block text-xs text-gray-600 mt-1">
                          Sua avaliação: {p.minhaNota} estrelas
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}