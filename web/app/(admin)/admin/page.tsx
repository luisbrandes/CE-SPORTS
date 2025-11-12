"use client"

import { useAuth } from "@/app/hook/useAuth"
import { Card } from "@/components/ui"

export default function AdminDashboardPage() {

  

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Painel Administrativo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Usuários</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie alunos, administradores e permissões de acesso.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Programas</h2>
          <p className="text-sm text-muted-foreground">
            Controle as modalidades esportivas e inscrições.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Relatórios</h2>
          <p className="text-sm text-muted-foreground">
            Visualize métricas e estatísticas de desempenho.
          </p>
        </Card>
      </div>
    </section>
  )
}
