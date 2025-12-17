"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Trophy,
  Search,
  Filter,
  Eye,
  ChevronRight,
  Award,
  User,
} from "lucide-react";

interface Equipe {
  id: number;
  nome: string;
  modalidade: string;
  descricao?: string;
  totalIntegrantes: number;
  totalCampeonatos: number;
  ativo: boolean;
  integrantesNomes: string[];
}

const MODALIDADES = ["FUTEBOL", "BASQUETE", "HANDEBOL", "VOLEI"];

export default function EquipesAlunoPage() {
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroModalidade, setFiltroModalidade] = useState("todas");
  const [filtroStatus, setFiltroStatus] = useState("ativas");

  useEffect(() => {
    async function fetchEquipes() {
      try {
        const res = await fetch("http://localhost:8080/api/equipe", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(
            `Erro ${res.status}: não foi possível carregar as equipes`
          );
        }

        const data = await res.json();
        setEquipes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEquipes();
  }, []);

  const equipesFiltradas = useMemo(() => {
    return equipes.filter((equipe) => {
      const passaFiltroNome =
        filtroNome === "" ||
        equipe.nome.toLowerCase().includes(filtroNome.toLowerCase()) ||
        equipe.descricao?.toLowerCase().includes(filtroNome.toLowerCase());

      const passaFiltroModalidade =
        filtroModalidade === "todas" || equipe.modalidade === filtroModalidade;

      const passaFiltroStatus =
        filtroStatus === "todas" ||
        (filtroStatus === "ativas" && equipe.ativo) ||
        (filtroStatus === "inativas" && !equipe.ativo);

      return passaFiltroNome && passaFiltroModalidade && passaFiltroStatus;
    });
  }, [equipes, filtroNome, filtroModalidade, filtroStatus]);

  const estatisticas = useMemo(() => {
    const totalEquipes = equipes.length;
    const equipesAtivas = equipes.filter((e) => e.ativo).length;
    const totalIntegrantes = equipes.reduce(
      (sum, e) => sum + e.totalIntegrantes,
      0
    );
    const totalCampeonatos = equipes.reduce(
      (sum, e) => sum + e.totalCampeonatos,
      0
    );

    return { totalEquipes, equipesAtivas, totalIntegrantes, totalCampeonatos };
  }, [equipes]);

  const limparFiltros = () => {
    setFiltroNome("");
    setFiltroModalidade("todas");
    setFiltroStatus("ativas");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando equipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Erro ao carregar equipes
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Equipes do CEFET-MG
            </h1>
            <p className="text-gray-600">
              Conheça todas as equipes esportivas da instituição
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Equipes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estatisticas.totalEquipes}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Equipes Ativas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estatisticas.equipesAtivas}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Atletas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estatisticas.totalIntegrantes}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-orange-100 p-3 mr-4">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Competições</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estatisticas.totalCampeonatos}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline-block h-4 w-4 mr-1" />
                Buscar equipe
              </label>
              <Input
                placeholder="Digite nome ou descrição..."
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline-block h-4 w-4 mr-1" />
                Modalidade
              </label>
              <Select
                value={filtroModalidade}
                onValueChange={setFiltroModalidade}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as modalidades" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="todas">Todas as modalidades</SelectItem>
                  {MODALIDADES.map((modalidade) => (
                    <SelectItem key={modalidade} value={modalidade}>
                      {modalidade.charAt(0) + modalidade.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="ativas">Somente ativas</SelectItem>
                  <SelectItem value="inativas">Somente inativas</SelectItem>
                  <SelectItem value="todas">Todas as equipes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button
                variant="outline"
                onClick={limparFiltros}
                className="h-10"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Mostrando {equipesFiltradas.length} de {equipes.length} equipes
          </div>
        </Card>

        {equipesFiltradas.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma equipe encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              {filtroNome ||
              filtroModalidade !== "todas" ||
              filtroStatus !== "ativas"
                ? "Tente ajustar os filtros para encontrar equipes"
                : "Nenhuma equipe cadastrada no sistema"}
            </p>
            {filtroNome ||
            filtroModalidade !== "todas" ||
            filtroStatus !== "ativas" ? (
              <Button variant="outline" onClick={limparFiltros}>
                Limpar filtros
              </Button>
            ) : null}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipesFiltradas.map((equipe) => (
              <Card
                key={equipe.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {equipe.nome}
                      </h3>
                      <Badge
                        className={`mt-2 ${getModalidadeColor(
                          equipe.modalidade
                        )}`}
                      >
                        {equipe.modalidade.charAt(0) +
                          equipe.modalidade.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                    <Badge variant={equipe.ativo ? "default" : "secondary"}>
                      {equipe.ativo ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>

                  {equipe.descricao && (
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                      {equipe.descricao}
                    </p>
                  )}

                  <div className="flex justify-between mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {equipe.totalIntegrantes}
                      </div>
                      <div className="text-xs text-gray-600">Atletas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {equipe.totalCampeonatos}
                      </div>
                      <div className="text-xs text-gray-600">Campeonatos</div>
                    </div>
                  </div>

                  {equipe.integrantesNomes.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Alguns integrantes:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {equipe.integrantesNomes.map((nome, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {nome}
                          </span>
                        ))}
                        {equipe.totalIntegrantes > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{equipe.totalIntegrantes - 3} outros
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <Link href={`/aluno/equipes/${equipe.id}`} className="block">
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Para entrar em uma equipe, entre em contato com o responsável ou
            compareça aos treinos.
          </p>
          <p className="mt-1">
            Horários de treino podem ser consultados na secretaria esportiva.
          </p>
        </div>
      </div>
    </div>
  );
}

const Button = ({
  children,
  variant = "default",
  onClick,
  className = "",
  disabled = false,
  size = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: "default" | "sm";
}) => {
  const baseClasses = "font-medium transition-colors rounded-lg";
  const sizeClasses = size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-2";

  const variantClasses =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
