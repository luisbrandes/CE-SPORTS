"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Trophy,
  Calendar,
  Award,
  User,
  Mail,
  ChevronRight,
  Edit,
  Trash2,
  ArrowLeft,
  Plus,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Integrante {
  id: number;
  nome: string;
  email: string;
}

interface CampeonatoEquipe {
  id: number;
  nome: string;
  colocacao: number | null;
  pontos: number | null;
}

interface EquipeDetalhes {
  id: number;
  nome: string;
  modalidade: string;
  descricao: string | null;
  ativo: boolean;
  integrantes: Integrante[];
  campeonatos: CampeonatoEquipe[];
}

interface Campeonato {
  id: number;
  nome: string;
}

const MODALIDADES = ["FUTEBOL", "BASQUETE", "HANDEBOL", "VOLEI"];

export default function DetalhesEquipePage() {
  const { id } = useParams();
  const router = useRouter();

  const [equipe, setEquipe] = useState<EquipeDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [editForm, setEditForm] = useState({
    nome: "",
    modalidade: "",
    descricao: "",
    ativo: true,
  });

  const [campeonatosDisponiveis, setCampeonatosDisponiveis] = useState<
    Campeonato[]
  >([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState<string>("");
  const [showAddCampeonato, setShowAddCampeonato] = useState(false);
  const [showAddIntegrante, setShowAddIntegrante] = useState(false);

  useEffect(() => {
    async function fetchEquipe() {
      try {
        const res = await fetch(`http://localhost:8080/api/equipe/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(
            `Erro ${res.status}: não foi possível carregar a equipe`
          );
        }

        const data = await res.json();
        setEquipe(data);
        setEditForm({
          nome: data.nome,
          modalidade: data.modalidade,
          descricao: data.descricao || "",
          ativo: data.ativo,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEquipe();
  }, [id]);

  useEffect(() => {
    async function fetchCampeonatos() {
      try {
        const res = await fetch("http://localhost:8080/api/campeonato", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setCampeonatosDisponiveis(data);
        }
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    }

    fetchCampeonatos();
  }, []);

  const getModalidadeColor = (modalidade: string) => {
    const colors: Record<string, string> = {
      FUTEBOL: "bg-green-100 text-green-800",
      BASQUETE: "bg-orange-100 text-orange-800",
      HANDEBOL: "bg-blue-100 text-blue-800",
      VOLEI: "bg-purple-100 text-purple-800",
    };
    return colors[modalidade] || "bg-gray-100 text-gray-800";
  };

  const getColocacaoColor = (colocacao: number | null) => {
    if (!colocacao) return "bg-gray-100 text-gray-800";
    if (colocacao === 1) return "bg-yellow-100 text-yellow-800";
    if (colocacao === 2) return "bg-gray-100 text-gray-800";
    if (colocacao === 3) return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  const handleSaveEdit = async () => {
    try {
      const payload: any = {};

      if (editForm.nome !== equipe?.nome) payload.nome = editForm.nome;
      if (editForm.modalidade !== equipe?.modalidade)
        payload.modalidade = editForm.modalidade;
      if (editForm.descricao !== equipe?.descricao)
        payload.descricao = editForm.descricao;
      if (editForm.ativo !== equipe?.ativo) payload.ativo = editForm.ativo;

      const res = await fetch(`http://localhost:8080/api/equipe/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert(`Erro ao atualizar: ${errorText}`);
        return;
      }

      setEquipe({
        ...equipe!,
        nome: editForm.nome,
        modalidade: editForm.modalidade,
        descricao: editForm.descricao,
        ativo: editForm.ativo,
      });

      setEditMode(false);
      alert("Equipe atualizada com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar equipe");
    }
  };

  const handleAddCampeonato = async () => {
    if (!selectedCampeonato) {
      alert("Selecione um campeonato");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/equipe/${id}/campeonatos/${selectedCampeonato}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        alert(`Erro: ${errorText}`);
        return;
      }

      const equipeRes = await fetch(`http://localhost:8080/api/equipe/${id}`, {
        credentials: "include",
      });

      if (equipeRes.ok) {
        const data = await equipeRes.json();
        setEquipe(data);
      }

      setSelectedCampeonato("");
      setShowAddCampeonato(false);
      alert("Equipe adicionada ao campeonato!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao adicionar ao campeonato");
    }
  };

  const handleRemoveCampeonato = async (campeonatoId: number) => {
    if (!confirm("Tem certeza que deseja remover a equipe deste campeonato?")) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/equipe/${id}/campeonatos/${campeonatoId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        alert(`Erro: ${errorText}`);
        return;
      }

      const equipeRes = await fetch(`http://localhost:8080/api/equipe/${id}`, {
        credentials: "include",
      });

      if (equipeRes.ok) {
        const data = await equipeRes.json();
        setEquipe(data);
      }

      alert("Equipe removida do campeonato!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao remover do campeonato");
    }
  };

  const handleDeleteEquipe = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/equipe/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert(`Erro: ${errorText}`);
        return;
      }

      alert("Equipe excluída com sucesso!");
      router.push("/admin/equipes");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir equipe");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando detalhes da equipe...</p>
        </div>
      </div>
    );
  }

  if (error || !equipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Erro ao carregar equipe
          </h2>
          <p className="text-red-600">{error || "Equipe não encontrada"}</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/admin/equipes"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Equipes
              </Link>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>

              <div className="flex-1">
                {editMode ? (
                  <div className="space-y-4">
                    <Input
                      value={editForm.nome}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nome: e.target.value })
                      }
                      className="text-3xl font-bold"
                    />
                    <Select
                      value={editForm.modalidade}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, modalidade: value })
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MODALIDADES.map((modalidade) => (
                          <SelectItem key={modalidade} value={modalidade}>
                            {modalidade.charAt(0) +
                              modalidade.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {equipe.nome}
                    </h1>
                    <div className="flex items-center gap-3">
                      <Badge className={getModalidadeColor(equipe.modalidade)}>
                        {equipe.modalidade.charAt(0) +
                          equipe.modalidade.slice(1).toLowerCase()}
                      </Badge>
                      <Badge variant={equipe.ativo ? "default" : "secondary"}>
                        {equipe.ativo ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>

            {editMode ? (
              <Textarea
                value={editForm.descricao}
                onChange={(e) =>
                  setEditForm({ ...editForm, descricao: e.target.value })
                }
                className="mt-4"
                placeholder="Descrição da equipe..."
                rows={3}
              />
            ) : (
              equipe.descricao && (
                <p className="mt-4 text-gray-600">{equipe.descricao}</p>
              )
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {editMode ? (
              <>
                <Button
                  onClick={handleSaveEdit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Salvar Alterações
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditMode(false);
                    setEditForm({
                      nome: equipe.nome,
                      modalidade: equipe.modalidade,
                      descricao: equipe.descricao || "",
                      ativo: equipe.ativo,
                    });
                  }}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditMode(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Equipe</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a equipe "{equipe.nome}"?
                        Esta ação não pode ser desfeita e removerá a equipe de
                        todos os campeonatos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteEquipe}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Integrantes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {equipe.integrantes.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-orange-100 p-3 mr-4">
                <Trophy className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Campeonatos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {equipe.campeonatos.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Melhor Colocação</p>
                <p className="text-2xl font-bold text-gray-900">
                  {equipe.campeonatos.some((c) => c.colocacao === 1)
                    ? "1º Lugar"
                    : equipe.campeonatos.some((c) => c.colocacao === 2)
                    ? "2º Lugar"
                    : equipe.campeonatos.some((c) => c.colocacao === 3)
                    ? "3º Lugar"
                    : "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Conteúdo em duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna 1: Integrantes */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Integrantes ({equipe.integrantes.length})
              </h2>

              <Dialog
                open={showAddIntegrante}
                onOpenChange={setShowAddIntegrante}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Integrante
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Integrante</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-gray-600 mb-4">
                      Para adicionar integrantes, edite a equipe na página de
                      edição.
                    </p>
                    <Button
                      onClick={() => setEditMode(true)}
                      className="w-full"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Equipe
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="p-6">
              {equipe.integrantes.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum integrante
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Esta equipe ainda não possui integrantes.
                  </p>
                  <Button onClick={() => setEditMode(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Integrantes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {equipe.integrantes.map((integrante) => (
                    <div
                      key={integrante.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-blue-100 p-2">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {integrante.nome}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {integrante.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => {
                          // Implementar remoção de integrante se necessário
                          alert("Para remover integrantes, edite a equipe.");
                        }}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Campeonatos ({equipe.campeonatos.length})
              </h2>

              <Dialog
                open={showAddCampeonato}
                onOpenChange={setShowAddCampeonato}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Inscrever em Campeonato
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Inscrever em Campeonato</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selecione o campeonato
                      </label>
                      <Select
                        value={selectedCampeonato}
                        onValueChange={setSelectedCampeonato}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha um campeonato" />
                        </SelectTrigger>
                        <SelectContent>
                          {campeonatosDisponiveis
                            .filter(
                              (c) =>
                                !equipe.campeonatos.some((ec) => ec.id === c.id)
                            )
                            .map((campeonato) => (
                              <SelectItem
                                key={campeonato.id}
                                value={String(campeonato.id)}
                              >
                                {campeonato.nome}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCampeonato("");
                          setShowAddCampeonato(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddCampeonato}>Inscrever</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="p-6">
              {equipe.campeonatos.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum campeonato
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Esta equipe ainda não está inscrita em nenhum campeonato.
                  </p>
                  <Button onClick={() => setShowAddCampeonato(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Inscrever em Campeonato
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {equipe.campeonatos.map((campeonato) => (
                    <div
                      key={campeonato.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-orange-100 p-2">
                          <Trophy className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {campeonato.nome}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            {campeonato.colocacao ? (
                              <Badge
                                className={getColocacaoColor(
                                  campeonato.colocacao
                                )}
                              >
                                {campeonato.colocacao}º Colocado
                              </Badge>
                            ) : (
                              <Badge variant="outline">Sem classificação</Badge>
                            )}
                            {campeonato.pontos !== null && (
                              <span className="text-sm text-gray-600">
                                {campeonato.pontos} pontos
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/admin/campeonatos/${campeonato.id}`}>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleRemoveCampeonato(campeonato.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Ações Rápidas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href={`/admin/campeonatos?equipe=${equipe.nome}`}>
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <Trophy className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Ver Campeonatos
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ver todos os campeonatos disponíveis
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href={`/admin/campeonatos/registrar-partida`}>
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Registrar Partida
                    </h3>
                    <p className="text-sm text-gray-600">
                      Registrar nova partida para esta equipe
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Button
              variant="outline"
              className="h-auto p-6"
              onClick={() => setEditMode(true)}
            >
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <Edit className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Editar Equipe</h3>
                  <p className="text-sm text-gray-600">
                    Alterar informações da equipe
                  </p>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
