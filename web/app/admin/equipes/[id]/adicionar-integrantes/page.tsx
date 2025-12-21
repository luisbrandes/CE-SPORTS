"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  X,
  Search,
  Check,
  ArrowLeft,
  Save,
} from "lucide-react";

interface User {
  id: number;
  nome: string;
  email: string;
  role?: string;
}

interface EquipeInfo {
  id: number;
  nome: string;
  modalidade: string;
  ativo: boolean;
}

export default function AdicionarIntegrantesPage() {
  const { id } = useParams();
  const router = useRouter();

  const [equipe, setEquipe] = useState<EquipeInfo | null>(null);
  const [todosAlunos, setTodosAlunos] = useState<User[]>([]);
  const [integrantesAtuais, setIntegrantesAtuais] = useState<User[]>([]);
  const [selectedAlunos, setSelectedAlunos] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState({
    equipe: true,
    alunos: true,
    salvando: false,
  });

  useEffect(() => {
    async function fetchEquipe() {
      try {
        const res = await fetch(`http://localhost:8080/api/equipe/${id}`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Dados da equipe:", data);
          setEquipe({
            id: data.id,
            nome: data.nome,
            modalidade: data.modalidade,
            ativo: data.ativo,
          });

          if (data.integrantes) {
            setIntegrantesAtuais(
              data.integrantes.map((integrante: any) => ({
                id: integrante.id,
                nome: integrante.nome,
                email: integrante.email,
                role: "ALUNO",
              }))
            );
          }
        }
      } catch (error) {
        console.error("Erro ao buscar equipe:", error);
      } finally {
        setLoading((prev) => ({ ...prev, equipe: false }));
      }
    }

    fetchEquipe();
  }, [id]);

  useEffect(() => {
    async function fetchAlunos() {
      try {
        console.log(
          "Buscando alunos de: http://localhost:8080/api/auth/alunos"
        );
        const res = await fetch("http://localhost:8080/api/auth/alunos", {
          credentials: "include",
        });

        console.log("Status da resposta:", res.status);

        if (res.ok) {
          const data = await res.json();
          console.log("Alunos recebidos:", data);

          setTodosAlunos(
            data.map((item: any) => ({
              id: item.id,
              nome: item.nome || item.name,
              email: item.email,
            }))
          );
        } else {
          console.warn("Erro ao buscar alunos, usando fallback");
          setTodosAlunos([
            { id: 1, nome: "João Silva", email: "joao@cefetmg.br" },
            { id: 2, nome: "Maria Santos", email: "maria@cefetmg.br" },
            { id: 3, nome: "Pedro Oliveira", email: "pedro@cefetmg.br" },
            { id: 4, nome: "Ana Costa", email: "ana@cefetmg.br" },
            { id: 5, nome: "Carlos Pereira", email: "carlos@cefetmg.br" },
          ]);
        }
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        setTodosAlunos([
          { id: 1, nome: "João Silva", email: "joao@cefetmg.br" },
          { id: 2, nome: "Maria Santos", email: "maria@cefetmg.br" },
          { id: 3, nome: "Pedro Oliveira", email: "pedro@cefetmg.br" },
        ]);
      } finally {
        setLoading((prev) => ({ ...prev, alunos: false }));
        console.log("Carregamento de alunos concluído");
      }
    }

    fetchAlunos();
  }, []);

  const alunosDisponiveis = todosAlunos.filter(
    (aluno) =>
      !integrantesAtuais.some((integrante) => integrante.id === aluno.id) &&
      !selectedAlunos.some((selected) => selected.id === aluno.id) &&
      (aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  console.log("Alunos disponíveis:", alunosDisponiveis.length);
  console.log("Integrantes atuais:", integrantesAtuais.length);
  console.log("Todos alunos:", todosAlunos.length);

  const handleAddAluno = (aluno: User) => {
    setSelectedAlunos([...selectedAlunos, aluno]);
    setSearchTerm("");
  };

  const handleRemoveAluno = (alunoId: number) => {
    setSelectedAlunos(selectedAlunos.filter((a) => a.id !== alunoId));
  };

  const handleRemoveIntegranteAtual = (integranteId: number) => {
    setIntegrantesAtuais(
      integrantesAtuais.filter((i) => i.id !== integranteId)
    );

    console.log(
      `Integrante ${integranteId} removido. Para readicionar, busque na lista de alunos.`
    );
  };

  const handleSave = async () => {
    if (selectedAlunos.length === 0 && integrantesAtuais.length === 0) {
      alert("Nenhuma alteração para salvar.");
      return;
    }

    setLoading((prev) => ({ ...prev, salvando: true }));

    try {
      const novosIntegrantesIds = [
        ...integrantesAtuais.map((i) => i.id),
        ...selectedAlunos.map((a) => a.id),
      ];

      const payload = {
        integrantesIds: novosIntegrantesIds,
      };

      const res = await fetch(`http://localhost:8080/api/equipe/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert(`Erro ao salvar: ${errorText}`);
        return;
      }

      alert("Integrantes atualizados com sucesso!");
      router.push(`/admin/equipes/${id}`);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar alterações");
    } finally {
      setLoading((prev) => ({ ...prev, salvando: false }));
    }
  };

  if (loading.equipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando informações da equipe...</p>
        </div>
      </div>
    );
  }

  if (!equipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Equipe não encontrada
          </h2>
          <Link href="/admin/equipes">
            <Button variant="outline" className="mt-4">
              ← Voltar para Equipes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={`/admin/equipes/${id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Detalhes da Equipe
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Gerenciar Integrantes
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-600">
                Equipe: <span className="font-semibold">{equipe.nome}</span>
              </p>
              <Badge
                className={
                  equipe.ativo
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {equipe.ativo ? "Ativa" : "Inativa"}
              </Badge>
            </div>
          </div>

          <div className="rounded-full bg-blue-100 p-3">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Integrantes Atuais
                </h2>
                <Badge variant="outline">
                  {integrantesAtuais.length} integrantes
                </Badge>
              </div>

              {integrantesAtuais.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum integrante
                  </h3>
                  <p className="text-gray-600">
                    Esta equipe ainda não possui integrantes.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {integrantesAtuais.map((integrante) => (
                    <div
                      key={integrante.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-blue-100 p-2">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {integrante.nome}
                          </p>
                          <p className="text-sm text-gray-600">
                            {integrante.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() =>
                          handleRemoveIntegranteAtual(integrante.id)
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Adicionar Novos Integrantes
                </h2>
                {selectedAlunos.length > 0 && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {selectedAlunos.length} selecionados
                  </Badge>
                )}
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar aluno por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {selectedAlunos.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Alunos Selecionados
                  </h3>
                  <div className="space-y-2">
                    {selectedAlunos.map((aluno) => (
                      <div
                        key={aluno.id}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <div>
                          <p className="font-medium text-blue-900">
                            {aluno.nome}
                          </p>
                          <p className="text-sm text-blue-700">{aluno.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleRemoveAluno(aluno.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Alunos Disponíveis
                  </h3>
                  <span className="text-xs text-gray-500">
                    {alunosDisponiveis.length} encontrados
                  </span>
                </div>

                {loading.alunos ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-gray-600">Carregando alunos...</p>
                  </div>
                ) : alunosDisponiveis.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg bg-gray-50">
                    <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {searchTerm
                        ? "Nenhum aluno encontrado com este termo"
                        : selectedAlunos.length === 0 &&
                          integrantesAtuais.length > 0
                        ? "Todos os alunos já são integrantes desta equipe"
                        : "Nenhum aluno disponível"}
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                    {alunosDisponiveis.map((aluno) => (
                      <div
                        key={aluno.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleAddAluno(aluno)}
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {aluno.nome}
                          </p>
                          <p className="text-sm text-gray-600">{aluno.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-800"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`/admin/equipes/${id}`} className="sm:order-1">
                    <Button variant="outline" className="w-full">
                      Cancelar
                    </Button>
                  </Link>

                  <Button
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading.salvando || selectedAlunos.length === 0}
                  >
                    {loading.salvando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Alterações ({selectedAlunos.length} novo(s))
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
