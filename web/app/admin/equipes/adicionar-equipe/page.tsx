"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, ArrowLeft, Save, UserPlus, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface User {
  id: number;
  nome: string;
  email: string;
}

const MODALIDADES = [
  { value: "FUTEBOL", label: "Futebol" },
  { value: "BASQUETE", label: "Basquete" },
  { value: "HANDEBOL", label: "Handebol" },
  { value: "VOLEI", label: "Vôlei" },
];

export default function AdicionarEquipePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alunos, setAlunos] = useState<User[]>([]);
  const [selectedAlunos, setSelectedAlunos] = useState<User[]>([]);
  const [searchAluno, setSearchAluno] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    modalidade: "",
    descricao: "",
  });

  async function buscarAlunos() {
    try {
      const res = await fetch("http://localhost:8080/api/auth/alunos", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          id: item.id || item.userId,
          nome: item.nome || item.name || item.username,
          email: item.email || item.userEmail,
        }));
      } else {
        throw new Error("Formato de resposta inválido");
      }
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      return [
        { id: 1, nome: "João Silva", email: "joao@cefetmg.br" },
        { id: 2, nome: "Maria Santos", email: "maria@cefetmg.br" },
        { id: 3, nome: "Pedro Oliveira", email: "pedro@cefetmg.br" },
      ];
    }
  }

  useEffect(() => {
    async function fetchAlunos() {
      const alunosData = await buscarAlunos();
      setAlunos(alunosData);
    }
    fetchAlunos();
  }, []);

  const alunosFiltrados = alunos.filter(
    (aluno) =>
      !selectedAlunos.find((s) => s.id === aluno.id) &&
      (aluno.nome.toLowerCase().includes(searchAluno.toLowerCase()) ||
        aluno.email.toLowerCase().includes(searchAluno.toLowerCase()))
  );

  const handleAddAluno = (aluno: User) => {
    setSelectedAlunos([...selectedAlunos, aluno]);
    setSearchAluno("");
  };

  const handleRemoveAluno = (alunoId: number) => {
    setSelectedAlunos(selectedAlunos.filter((a) => a.id !== alunoId));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.nome || !formData.modalidade) {
      alert("Nome e modalidade são obrigatórios!");
      setLoading(false);
      return;
    }

    const payload = {
      nome: formData.nome,
      modalidade: formData.modalidade,
      descricao: formData.descricao || "",
      integrantesIds: selectedAlunos.map((aluno) => aluno.id),
    };

    try {
      const res = await fetch("http://localhost:8080/api/equipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 409) {
          alert("Já existe uma equipe com este nome!");
        } else {
          const errorText = await res.text();
          alert(`Erro ao criar equipe: ${errorText}`);
        }
        setLoading(false);
        return;
      }

      alert("Equipe criada com sucesso!");
      router.push("/admin/equipes");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão com o servidor.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin/equipes"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Equipes
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Nova Equipe</h1>
            <p className="text-gray-600 mt-2">
              Crie uma nova equipe esportiva e adicione seus integrantes
            </p>
          </div>

          <div className="rounded-full bg-blue-100 p-3">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b">
                  Informações da Equipe
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nome da Equipe *
                    </label>
                    <Input
                      name="nome"
                      placeholder="Ex: Leões do CEFET"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Escolha um nome único e identificador
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Modalidade *
                    </label>
                    <Select
                      value={formData.modalidade}
                      onValueChange={(value) =>
                        handleSelectChange("modalidade", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {MODALIDADES.map((modalidade) => (
                          <SelectItem
                            key={modalidade.value}
                            value={modalidade.value}
                          >
                            {modalidade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Descrição (opcional)
                  </label>
                  <Textarea
                    name="descricao"
                    placeholder="Descreva a equipe, objetivos, história..."
                    value={formData.descricao}
                    onChange={handleChange}
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    Máximo de 500 caracteres
                  </p>
                </div>
              </div>

              {/* Seleção de Integrantes */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b">
                  Integrantes da Equipe
                </h2>

                {selectedAlunos.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Integrantes Selecionados ({selectedAlunos.length})
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAlunos([])}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remover Todos
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedAlunos.map((aluno) => (
                        <div
                          key={aluno.id}
                          className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {aluno.nome}
                            </p>
                            <p className="text-sm text-gray-600">
                              {aluno.email}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAluno(aluno.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Buscar Alunos
                    </h3>
                    <Badge variant="outline">
                      {alunosFiltrados.length} disponíveis
                    </Badge>
                  </div>

                  <div className="flex gap-4">
                    <Input
                      placeholder="Buscar por nome ou email..."
                      value={searchAluno}
                      onChange={(e) => setSearchAluno(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSearchAluno("")}
                    >
                      Limpar
                    </Button>
                  </div>

                  {alunosFiltrados.length > 0 ? (
                    <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                      {alunosFiltrados.map((aluno) => (
                        <div
                          key={aluno.id}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleAddAluno(aluno)}
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {aluno.nome}
                            </p>
                            <p className="text-sm text-gray-600">
                              {aluno.email}
                            </p>
                          </div>
                          <Button
                            type="button"
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
                  ) : (
                    <div className="text-center py-8 border rounded-lg bg-gray-50">
                      <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {searchAluno
                          ? "Nenhum aluno encontrado com este termo"
                          : selectedAlunos.length === 0
                          ? "Nenhum aluno disponível para adicionar"
                          : "Todos os alunos já foram adicionados"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Link href="/admin/equipes" className="sm:order-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Criar Equipe
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
