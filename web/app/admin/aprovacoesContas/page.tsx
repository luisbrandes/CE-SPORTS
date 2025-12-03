"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface AdminPendentes {
  id: number;
  nome: string;
  email: string;
}

export default function AprovacoesPage() {
  const [admins, setAdmins] = useState<AdminPendentes[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const carregarPendentes = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/admin/pending-admins", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao carregar pendentes");
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err: any) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const aprovar = async (id: number) => {
    if (!confirm("Aprovar este administrador?")) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/approve-admin/${id}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("Erro ao aprovar administrador");
      alert("Administrador aprovado com sucesso!");
      await carregarPendentes();
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  const rejeitar = async (id: number) => {
    if (!confirm("Rejeitar e excluir este administrador?")) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/reject-admin/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("Erro ao rejeitar administrador");
      alert("Administrador rejeitado e removido!");
      await carregarPendentes();
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  const checkSession = async () => {
    const res = await fetch("http://localhost:8080/api/auth/me", {
      credentials: "include",
    });
    if (!res.ok) {
      alert("Você não está logado como administrador aprovado.");
      return router.push("/login");
    }
  };

  useEffect(() => {
    checkSession();
    carregarPendentes();
  }, []);

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ">
      {/* HEADER */}
      <header className="mb-6 lg:mb-8">
        <Card className="bg-white border border-[#E5E7F0] rounded-2xl shadow-sm px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#14539A]">
                Aprovação de Administradores
              </h1>
              <p className="text-xs sm:text-sm text-[#7C8698]">
                Aprove ou rejeite novos administradores pendentes de liberação.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin")}
              className="w-full sm:w-auto border-[#D2D7E5] text-[#14539A] hover:bg-[#F2F4FB] rounded-full h-9 sm:h-10 px-4 text-xs sm:text-sm font-medium"
            >
              ← Voltar ao Painel
            </Button>
          </div>
        </Card>
      </header>

      {/* LISTA DE PENDENTES */}
      <Card className="w-full bg-white border border-[#E5E7F0] rounded-2xl shadow-sm px-4 sm:px-6 py-5">
        {loading ? (
          <p className="text-center text-sm sm:text-base text-[#7C8698] py-8">
            Carregando...
          </p>
        ) : admins.length === 0 ? (
          <p className="text-center text-sm sm:text-base text-[#7C8698] py-8">
            Nenhum administrador pendente.
          </p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border border-[#E5E7F0] rounded-xl hover:bg-[#F8FAFF] transition-colors"
              >
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[#14539A]">
                    {admin.nome}
                  </p>
                  <p className="text-xs sm:text-sm text-[#7C8698]">
                    {admin.email}
                  </p>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <Button
                    onClick={() => aprovar(admin.id)}
                    className="bg-[#16A34A] hover:bg-[#15803d] text-white h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm rounded-full"
                  >
                    Aprovar
                  </Button>
                  <Button
                    onClick={() => rejeitar(admin.id)}
                    className="bg-[#EF4444] hover:bg-[#dc2626] text-white h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm rounded-full"
                  >
                    Rejeitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
