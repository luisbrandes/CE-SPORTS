"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ">
      {/* HEADER */}
      <header className="mb-6 lg:mb-8">
        <Card className="bg-white border border-[#E5E7F0] rounded-2xl shadow-sm px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#14539A]">
                Painel Administrativo
              </h1>
              <p className="text-xs sm:text-sm text-[#7C8698]">
                Acesse rapidamente as principais áreas de gestão da plataforma.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full sm:w-auto border-[#D2D7E5] text-[#14539A] hover:bg-[#F2F4FB] rounded-full h-9 sm:h-10 px-4 text-xs sm:text-sm font-medium"
            >
              Ir para Área do Aluno
            </Button>
          </div>
        </Card>
      </header>

      {/* CARDS DO PAINEL */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {/* Usuários Pendentes */}
        <Card
          className="p-4 sm:p-5 lg:p-6 cursor-pointer bg-white border border-[#E5E7F0] rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          onClick={() => router.push("/admin/aprovacoesContas")}
        >
          <h2 className="text-base sm:text-lg font-semibold text-[#14539A] mb-1.5">
            Usuários Pendentes
          </h2>
          <p className="text-xs sm:text-sm text-[#7C8698] leading-relaxed">
            Gerencie solicitações de acesso. Aprove, rejeite e ajuste permissões
            de novos usuários que aguardam liberação no sistema.
          </p>
        </Card>

        {/* Campeonatos */}
        <Card
          className="p-4 sm:p-5 lg:p-6 cursor-pointer bg-white border border-[#E5E7F0] rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          onClick={() => router.push("/admin/campeonatos")}
        >
          <h2 className="text-base sm:text-lg font-semibold text-[#14539A] mb-1.5">
            Campeonatos
          </h2>
          <p className="text-xs sm:text-sm text-[#7C8698] leading-relaxed">
            Crie, edite e acompanhe campeonatos esportivos. Controle equipes,
            pontuações, partidas e classificações em tempo real.
          </p>
        </Card>

        {/* Notícias */}
        <Card
          className="p-4 sm:p-5 lg:p-6 cursor-pointer bg-white border border-[#E5E7F0] rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          onClick={() => router.push("/admin/noticia")}
        >
          <h2 className="text-base sm:text-lg font-semibold text-[#14539A] mb-1.5">
            Notícias
          </h2>
          <p className="text-xs sm:text-sm text-[#7C8698] leading-relaxed">
            Publique novidades e comunicados oficiais. Gerencie manchetes,
            descrições, imagens e visibilidade das notícias no portal.
          </p>
        </Card>

        {/* Treinos */}
        <Card
          className="p-4 sm:p-5 lg:p-6 cursor-pointer bg-white border border-[#E5E7F0] rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          onClick={() => router.push("/admin/treino")}
        >
          <h2 className="text-base sm:text-lg font-semibold text-[#14539A] mb-1.5">
            Cadastro de Treinos
          </h2>
          <p className="text-xs sm:text-sm text-[#7C8698] leading-relaxed">
            Adicione e gerencie treinos esportivos no sistema, definindo séries,
            duração e grupos de alunos específicos.
          </p>
        </Card>

        {/* Projetos */}
        <Card
          className="p-4 sm:p-5 lg:p-6 cursor-pointer bg-white border border-[#E5E7F0] rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          onClick={() => router.push("/admin/projetos")}
        >
          <h2 className="text-base sm:text-lg font-semibold text-[#14539A] mb-1.5">
            Projetos
          </h2>
          <p className="text-xs sm:text-sm text-[#7C8698] leading-relaxed">
            Administre projetos e programas esportivos. Controle participantes,
            cronogramas, metas e materiais relacionados.
          </p>
        </Card>

        {/* Notificações */}
        <Card
          className="p-4 sm:p-5 lg:p-6 cursor-pointer bg-white border border-[#E5E7F0] rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          onClick={() => router.push("/admin/notificacoes")}
        >
          <h2 className="text-base sm:text-lg font-semibold text-[#14539A] mb-1.5">
            Notificações
          </h2>
          <p className="text-xs sm:text-sm text-[#7C8698] leading-relaxed">
            Envie comunicados para os usuários da plataforma.
          </p>
        </Card>
      </section>
    </div>
  );
}
