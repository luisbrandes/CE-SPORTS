"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Users, Trophy, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Equipe {
  id: number;
  nome: string;
  modalidade: string;
  ativo: boolean;
}

export default function AdicionarCampeonatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    pontosVitoria: "3",
    pontosDerrota: "0",
    pontosEmpate: "1",
  });

  const [equipesDisponiveis, setEquipesDisponiveis] = useState<Equipe[]>([]);
  const [equipesSelecionadas, setEquipesSelecionadas] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [buscaEquipe, setBuscaEquipe] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchEquipes() {
      try {
        const res = await fetch("http://localhost:8080/api/equipe", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          const equipesAtivas = data.filter((equipe: Equipe) => equipe.ativo);
          setEquipesDisponiveis(equipesAtivas);
        }
      } catch (error) {
        console.error("Erro ao buscar equipes:", error);
      }
    }

    fetchEquipes();
  }, []);

  const equipesFiltradas = equipesDisponiveis.filter(
    (equipe) =>
      !equipesSelecionadas.some((e) => e.id === equipe.id) &&
      (equipe.nome.toLowerCase().includes(buscaEquipe.toLowerCase()) ||
        equipe.modalidade.toLowerCase().includes(buscaEquipe.toLowerCase()))
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "nome") {
      e.target.setCustomValidity("");
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const adicionarEquipe = (equipe: Equipe) => {
    if (!equipesSelecionadas.some((e) => e.id === equipe.id)) {
      setEquipesSelecionadas([...equipesSelecionadas, equipe]);
      setBuscaEquipe("");
    }
  };

  const removerEquipe = (equipeId: number) => {
    setEquipesSelecionadas(
      equipesSelecionadas.filter((equipe) => equipe.id !== equipeId)
    );
  };

  const getModalidadeColor = (modalidade: string) => {
    const colors: Record<string, string> = {
      FUTEBOL: "bg-green-100 text-green-800",
      BASQUETE: "bg-orange-100 text-orange-800",
      HANDEBOL: "bg-blue-100 text-blue-800",
      VOLEI: "bg-purple-100 text-purple-800",
    };
    return colors[modalidade] || "bg-gray-100 text-gray-800";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (equipesSelecionadas.length < 2) {
      alert("O campeonato deve ter pelo menos 2 equipes participantes!");
      setLoading(false);
      return;
    }

    if (!formData.nome.trim()) {
      alert("O nome do campeonato é obrigatório!");
      setLoading(false);
      return;
    }

    const payload = {
      nome: formData.nome.trim(),
      equipes: equipesSelecionadas.map((equipe) => equipe.nome),
      vitoria: Number(formData.pontosVitoria),
      derrota: Number(formData.pontosDerrota),
      empate: Number(formData.pontosEmpate),
    };

    try {
      const res = await fetch("http://localhost:8080/api/campeonato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 409) {
          alert("Já existe um campeonato com este nome!");
        } else {
          const errorText = await res.text();
          alert(`Erro ao criar campeonato: ${errorText}`);
        }
        setLoading(false);
        return;
      }

      alert("Campeonato criado com sucesso!");
      router.push("/admin/campeonatos");
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
              href="/admin/campeonatos"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Voltar para Campeonatos
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Novo Campeonato
            </h1>
            <p className="text-gray-600 mt-2">
              Crie um novo campeonato e selecione as equipes participantes
            </p>
          </div>

          <div className="rounded-full bg-blue-100 p-3">
            <Trophy className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b">
                  Informações do Campeonato
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Campeonato *
                    </label>
                    <Input
                      name="nome"
                      placeholder="Ex: Copa CEFET 2024"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Escolha um nome único e descritivo
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pontos por Vitória *
                      </label>
                      <Input
                        name="pontosVitoria"
                        type="number"
                        placeholder="3"
                        required
                        value={formData.pontosVitoria}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pontos por Empate *
                      </label>
                      <Input
                        name="pontosEmpate"
                        type="number"
                        placeholder="1"
                        required
                        value={formData.pontosEmpate}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pontos por Derrota *
                      </label>
                      <Input
                        name="pontosDerrota"
                        type="number"
                        placeholder="0"
                        required
                        value={formData.pontosDerrota}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seleção de Equipes */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b">
                  Equipes Participantes
                </h2>

                <div className="space-y-6">
                  {equipesSelecionadas.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Equipes Selecionadas ({equipesSelecionadas.length})
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEquipesSelecionadas([])}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remover Todas
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {equipesSelecionadas.map((equipe) => (
                          <div
                            key={equipe.id}
                            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-blue-100 p-2">
                                <Users className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {equipe.nome}
                                </p>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getModalidadeColor(
                                    equipe.modalidade
                                  )}`}
                                >
                                  {equipe.modalidade}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removerEquipe(equipe.id)}
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
                        Buscar Equipes Disponíveis
                      </h3>
                      <Badge variant="outline">
                        {equipesFiltradas.length} disponíveis
                      </Badge>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar equipe por nome ou modalidade..."
                        value={buscaEquipe}
                        onChange={(e) => setBuscaEquipe(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {equipesFiltradas.length > 0 ? (
                      <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                        {equipesFiltradas.map((equipe) => (
                          <div
                            key={equipe.id}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => adicionarEquipe(equipe)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-gray-100 p-2">
                                <Users className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {equipe.nome}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${getModalidadeColor(
                                      equipe.modalidade
                                    )}`}
                                  >
                                    {equipe.modalidade}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    ID: {equipe.id}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-800"
                            >
                              Adicionar
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-lg bg-gray-50">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {buscaEquipe
                            ? "Nenhuma equipe encontrada com este termo"
                            : equipesSelecionadas.length === 0
                            ? "Nenhuma equipe disponível"
                            : "Todas as equipes já foram selecionadas"}
                        </p>
                        {buscaEquipe && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setBuscaEquipe("")}
                            className="mt-3"
                          >
                            Limpar busca
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Resumo da Seleção
                        </h4>
                        <p className="text-sm text-gray-600">
                          {equipesSelecionadas.length} equipe(s) selecionada(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Mínimo: 2 equipes
                        </p>
                        <p
                          className={`text-sm ${
                            equipesSelecionadas.length >= 2
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {equipesSelecionadas.length >= 2
                            ? "✅ Requisito atendido"
                            : "❌ Selecione mais equipes"}
                        </p>
                      </div>
                    </div>

                    {equipesSelecionadas.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-700 mb-2">
                          Modalidades incluídas:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(
                            new Set(
                              equipesSelecionadas.map((e) => e.modalidade)
                            )
                          ).map((modalidade) => (
                            <Badge
                              key={modalidade}
                              className={getModalidadeColor(modalidade)}
                            >
                              {modalidade}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Link href="/admin/campeonatos" className="sm:order-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </Link>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={
                    loading ||
                    equipesSelecionadas.length < 2 ||
                    !formData.nome.trim()
                  }
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Trophy className="mr-2 h-4 w-4" />
                      Criar Campeonato
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
