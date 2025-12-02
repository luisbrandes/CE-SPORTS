"use client";

import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Painel Administrativo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Usuários Pendentes */}
        <Card
          className="p-6 cursor-pointer hover:bg-accent transition"
          onClick={() => router.push("/admin/aprovacoesContas")}
        >
          <h2 className="text-lg font-semibold mb-2">Usuários Pendentes</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie solicitações de acesso. Aprove, rejeite e ajuste permissões
            de novos usuários que aguardam liberação no sistema.
          </p>
        </Card>

        {/* Campeonatos */}
        <Card
          className="p-6 cursor-pointer hover:bg-accent transition"
          onClick={() => router.push("/admin/campeonatos")}
        >
          <h2 className="text-lg font-semibold mb-2">Campeonatos</h2>
          <p className="text-sm text-muted-foreground">
            Crie, edite e acompanhe campeonatos esportivos. Controle equipes,
            pontuações, partidas e classificações em tempo real.
          </p>
        </Card>

        {/* Notícias */}
        <Card
          className="p-6 cursor-pointer hover:bg-accent transition"
          onClick={() => router.push("/admin/noticia")}
        >
          <h2 className="text-lg font-semibold mb-2">Notícias</h2>
          <p className="text-sm text-muted-foreground">
            Publique novidades e comunicados oficiais. Gerencie manchetes,
            descrições, imagens e visibilidade das notícias no portal.
          </p>
        </Card>

        {/* Treinos CORRIGIDO */}
        <Card
          className="p-6 cursor-pointer hover:bg-accent transition" 
          onClick={() => router.push("/admin/treino")} 
        >
          <h2 className="text-lg font-semibold mb-2">Cadastro de Treinos</h2>
          <p className="text-sm text-muted-foreground">
            Adicione e gerencie treinos esportivos no sistema, definindo séries,
            duração e grupos de alunos específicos.
          </p>
        </Card>

        {/* Projetos */}
        <Card
          className="p-6 cursor-pointer hover:bg-accent transition"
          onClick={() => router.push("/admin/projetos")}
        >
          <h2 className="text-lg font-semibold mb-2">Projetos</h2>
          <p className="text-sm text-muted-foreground">
            Administre projetos e programas esportivos. Controle participantes,
            cronogramas, metas e materiais relacionados.
          </p>
        </Card>

        {/* Notificações */}
        <Card
          className="p-6 cursor-pointer hover:bg-accent transition"
          onClick={() => router.push("/admin/notificacoes")}
        >
          <h2 className="text-lg font-semibold mb-2">Notificações</h2>
          <p className="text-sm text-muted-foreground">
            Envie comunicados para os usuários da plataforma.
          </p>
        </Card>

      </div>
    </section>
  );
}