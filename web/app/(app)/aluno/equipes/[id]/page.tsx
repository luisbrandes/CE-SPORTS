"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Trophy,
  Award,
  User,
  Mail,
  ChevronLeft,
  Calendar,
  Target,
  Users as UsersIcon,
} from "lucide-react";

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

export default function DetalhesEquipeAlunoPage() {
  const { id } = useParams();

  const [equipe, setEquipe] = useState<EquipeDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEquipe();
  }, [id]);

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
          <Link href="/aluno/equipes">
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
                href="/aluno/equipes"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Voltar para Equipes
              </Link>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>

              <div className="flex-1">
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
              </div>
            </div>

            {equipe.descricao && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sobre a Equipe
                </h3>
                <p className="text-gray-600 bg-white p-4 rounded-lg border">
                  {equipe.descricao}
                </p>
              </div>
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
                <p className="text-sm text-gray-600">Campeonatos Atuais</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Integrantes ({equipe.integrantes.length})
              </h2>
              <Badge variant="outline">
                <UsersIcon className="h-3 w-3 mr-1" />
                {equipe.integrantes.length} atletas
              </Badge>
            </div>

            <Card className="p-6">
              {equipe.integrantes.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum integrante
                  </h3>
                  <p className="text-gray-600">
                    Esta equipe ainda não possui integrantes.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {equipe.integrantes.map((integrante) => (
                    <div
                      key={integrante.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="rounded-full bg-blue-100 p-2">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {integrante.nome}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {integrante.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {equipe.ativo && (
              <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Interessado em participar?
                    </h4>
                    <p className="text-sm text-gray-700">
                      Para entrar nesta equipe, entre em contato com o
                      responsável ou compareça aos treinos. Consulte a
                      secretaria esportiva para horários.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Campeonatos ({equipe.campeonatos.length})
              </h2>
              <Badge variant="outline">
                <Trophy className="h-3 w-3 mr-1" />
                {equipe.campeonatos.length} competições
              </Badge>
            </div>

            <Card className="p-6">
              {equipe.campeonatos.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum campeonato
                  </h3>
                  <p className="text-gray-600">
                    Esta equipe ainda não está inscrita em nenhum campeonato.
                  </p>
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

                      <Link href={`/aluno/campeonatos/${campeonato.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Próximas Partidas
                </h3>
              </div>
              <div className="text-center py-6">
                <p className="text-gray-500">
                  Nenhuma partida agendada no momento
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  As partidas serão exibidas aqui quando agendadas
                </p>
              </div>
            </Card>
          </div>
        </div>

        {equipe.ativo && (
          <div className="mt-8">
            <Card className="p-6 bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📞 Como Participar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Entre em contato:
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Secretaria Esportiva: (31) 3319-7000</li>
                    <li>• Email: esportes@cefetmg.br</li>
                    <li>• Local: Ginásio Poliesportivo - Campus I</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Horários de Treino:
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Segunda a Sexta: 14h às 18h</li>
                    <li>• Sábados: 8h às 12h</li>
                    <li>• Consulte modalidade específica</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}
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
  variant?: "default" | "outline" | "ghost";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: "default" | "sm";
}) => {
  const baseClasses = "font-medium transition-colors rounded-lg";
  const sizeClasses = size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-2";

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
  }[variant];

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
