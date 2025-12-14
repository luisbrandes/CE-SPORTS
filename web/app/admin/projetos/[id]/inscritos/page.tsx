"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Inscrito {
  id: number;
  nome: string;
  email: string;
  role: string;
}

export default function InscritosProjetoPage() {
  const params = useParams();
  const router = useRouter();
  const projetoId = params?.id;

  const [inscritos, setInscritos] = useState<Inscrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projetoId) return;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8080/api/projetos/${projetoId}/inscritos`,
          { credentials: "include" }
        );

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || "Erro ao buscar inscritos");
        }

        const data = await res.json();
        setInscritos(Array.isArray(data) ? data : []);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [projetoId]);

  function exportCSV() {
    if (!inscritos || inscritos.length === 0) return;

    const header = ["ID", "Nome", "Email", "Role"];
    const rows = inscritos.map((i) => [i.id, i.nome, i.email, i.role]);

    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inscritos_projeto_${projetoId}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 bg-[#F6F7FB]">
      {/* HEADER */}
      <header className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl border border-[#E5E7F0] px-4 sm:px-6 py-4 sm:py-5">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#14539A]">
              Inscritos do Projeto #{projetoId}
            </h1>
            <p className="text-xs sm:text-sm text-[#7C8698]">
              Visualize e exporte a lista de participantes deste projeto.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/projetos")}
              className="w-full sm:w-auto border-[#D2D7E5] text-[#14539A] hover:bg-[#F2F4FB] rounded-full h-9 sm:h-10 px-4 text-xs sm:text-sm font-medium"
            >
              ← Voltar para Projetos
            </Button>

            <Button
              onClick={exportCSV}
              disabled={inscritos.length === 0}
              className="w-full sm:w-auto bg-[#FFC94B] hover:bg-[#ffbf24] text-[#1B3C6D] font-semibold rounded-full h-9 sm:h-10 text-xs sm:text-sm disabled:opacity-60"
            >
              Exportar CSV
            </Button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <Card className="border border-[#E5E7F0] rounded-2xl shadow-sm bg-white px-4 sm:px-6 py-4 sm:py-5">
        {loading ? (
          <div className="py-10 text-center text-sm sm:text-base text-[#7C8698]">
            Carregando inscritos...
          </div>
        ) : error ? (
          <div className="py-10 text-center text-sm sm:text-base text-red-600">
            {error}
          </div>
        ) : inscritos.length === 0 ? (
          <div className="py-10 text-center text-sm sm:text-base text-[#7C8698]">
            Nenhum inscrito encontrado para este projeto.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#F6F7FB] text-[#7C8698]">
                  <th className="px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm font-semibold rounded-l-xl">
                    ID
                  </th>
                  <th className="px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm font-semibold">
                    Nome
                  </th>
                  <th className="px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm font-semibold rounded-r-xl">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {inscritos.map((i, index) => (
                  <tr
                    key={i.id}
                    className={`text-[#14539A] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#FDFDFE]"
                    }`}
                  >
                    <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border-t border-[#F0F1F6] first:rounded-l-xl">
                      {i.id}
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border-t border-[#F0F1F6]">
                      {i.nome}
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border-t border-[#F0F1F6]">
                      {i.email}
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border-t border-[#F0F1F6] last:rounded-r-xl">
                      {i.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
