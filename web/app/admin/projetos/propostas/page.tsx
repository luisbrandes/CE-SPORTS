"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { Check, X, Star, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface Proposta {
  id: number;
  nome: string;
  descricao: string;
  modalidade: string;
  local: string;
  alunoNome: string;
  mediaAvaliacoes: number | null;
}

export default function PropostasPage() {
  const router = useRouter();

  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroModalidade, setFiltroModalidade] = useState("");
  const [filtroLocal, setFiltroLocal] = useState("");

  // ---------------------- CARREGAR ----------------------
  const carregarPropostas = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:8080/api/propostas", {
        credentials: "include",
        cache: "no-store",
      });

      if (res.status === 401 || res.status === 403) {
        alert("Sessão expirada ou acesso não autorizado.");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Erro ao carregar propostas");
      }

      const data: Proposta[] = await res.json();
      setPropostas(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erro ao carregar propostas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPropostas();
  }, []);

  // ---------------------- FILTROS ----------------------
  const limparFiltros = () => {
    setFiltroNome("");
    setFiltroModalidade("");
    setFiltroLocal("");
  };

  const propostasFiltradas = useMemo(() => {
    return propostas.filter((p) => {
      const nome = (p.nome || "").toLowerCase();
      const modalidade = (p.modalidade || "").toLowerCase();
      const local = (p.local || "").toLowerCase();

      const filtroNomeLower = filtroNome.toLowerCase();
      const filtroModalidadeLower = filtroModalidade.toLowerCase();
      const filtroLocalLower = filtroLocal.toLowerCase();

      const matchNome =
        filtroNomeLower === "" || nome.includes(filtroNomeLower);
      const matchModalidade =
        filtroModalidadeLower === "" ||
        modalidade.includes(filtroModalidadeLower);
      const matchLocal =
        filtroLocalLower === "" || local.includes(filtroLocalLower);

      return matchNome && matchModalidade && matchLocal;
    });
  }, [propostas, filtroNome, filtroModalidade, filtroLocal]);

  // ---------------------- APROVAR ----------------------
  const aprovar = async (id: number) => {
    if (!confirm("Deseja aprovar esta proposta?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/propostas/${id}/aprovar`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (res.status === 401 || res.status === 403) {
        alert("Você não tem permissão para aprovar propostas.");
        return;
      }

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "Erro ao aprovar proposta");
        return;
      }

      await carregarPropostas();
    } catch (err) {
      console.error(err);
      alert("Erro ao aprovar proposta");
    }
  };

  // ---------------------- REJEITAR ----------------------
  const rejeitar = async (id: number) => {
    if (!confirm("Deseja rejeitar esta proposta?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/propostas/${id}/rejeitar`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (res.status === 401 || res.status === 403) {
        alert("Você não tem permissão para rejeitar propostas.");
        return;
      }

      if (!res.ok) {
        alert("Erro ao rejeitar proposta");
        return;
      }

      await carregarPropostas();
    } catch (err) {
      console.error(err);
      alert("Erro ao rejeitar proposta");
    }
  };

  // ---------------------- VIEW ----------------------
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ">
      {/* HEADER */}
      <header className="mb-6 lg:mb-8">
        <Card className="bg-white border border-[#E5E7F0] rounded-2xl shadow-sm px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">📄</span>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#14539A]">
                  Propostas de Projetos
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#7C8698]">
                Analise, aprove ou rejeite propostas enviadas pelos alunos.
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

      {/* FILTROS */}
      <section className="mb-6 lg:mb-8">
        <Card className="border border-[#E5E7F0] rounded-2xl shadow-sm bg-white px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#14539A]">
                Filtros
              </h2>
              <p className="text-xs sm:text-sm text-[#7C8698]">
                Encontre propostas por nome, modalidade ou local.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm bg-[#FFF5CF] text-[#E2A01D] px-3 py-1.5 rounded-full font-semibold">
                {propostasFiltradas.length} de {propostas.length} propostas
              </span>

              <Button
                variant="outline"
                onClick={limparFiltros}
                className="h-9 sm:h-10 rounded-full border-[#E5E7F0] text-[#14539A] hover:bg-[#F2F4FB] px-3 sm:px-4 text-xs sm:text-sm"
              >
                <X className="w-4 h-4 mr-1" />
                Limpar filtros
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Nome do projeto */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B2BACB]" />
              <Input
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                placeholder="Pesquisar por nome..."
                className="pl-9 h-11 rounded-xl border-[#E0E3EB] text-sm"
              />
            </div>

            {/* Modalidade */}
            <Input
              value={filtroModalidade}
              onChange={(e) => setFiltroModalidade(e.target.value)}
              placeholder="Filtrar por modalidade..."
              className="h-11 rounded-xl border-[#E0E3EB] text-sm"
            />

            {/* Local */}
            <Input
              value={filtroLocal}
              onChange={(e) => setFiltroLocal(e.target.value)}
              placeholder="Filtrar por local..."
              className="h-11 rounded-xl border-[#E0E3EB] text-sm"
            />
          </div>
        </Card>
      </section>

      {/* LISTA / ESTADOS */}
      {loading ? (
        <Card className="border border-[#E5E7F0] rounded-2xl shadow-sm bg-white py-16 text-center">
          <div className="mx-auto mb-4 h-8 w-8 border-2 border-[#14539A] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm sm:text-base text-[#7C8698]">
            Carregando propostas...
          </p>
        </Card>
      ) : error ? (
        <Card className="border border-[#FCA5A5] rounded-2xl bg-[#FEF2F2] px-4 sm:px-6 py-6 text-center text-sm sm:text-base text-[#B91C1C]">
          {error}
        </Card>
      ) : propostasFiltradas.length === 0 ? (
        <Card className="border border-[#E5E7F0] rounded-2xl shadow-sm bg-white py-14 text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-[#F2F4FB] flex items-center justify-center">
            <Search className="w-5 h-5 text-[#B2BACB]" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[#14539A] mb-1">
            Nenhuma proposta encontrada.
          </h3>
          <p className="text-xs sm:text-sm text-[#7C8698]">
            Tente ajustar ou limpar os filtros.
          </p>
        </Card>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {propostasFiltradas.map((p) => (
            <Card
              key={p.id}
              className="border border-[#E5E7F0] rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="p-4 sm:p-6 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base sm:text-lg font-semibold text-[#14539A]">
                    {p.nome}
                  </h3>
                  <span className="text-[11px] uppercase tracking-wide text-[#FFC94B] font-semibold">
                    {p.modalidade}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#7C8698] leading-relaxed line-clamp-4">
                  {p.descricao}
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm text-[#14539A]">
                  <p>
                    <span className="font-semibold text-[#7C8698]">
                      Local:
                    </span>{" "}
                    {p.local}
                  </p>
                  <p>
                    <span className="font-semibold text-[#7C8698]">
                      Proponente:
                    </span>{" "}
                    {p.alunoNome}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-[#FACC15]" />
                    <span className="font-semibold text-[#14539A]">
                      Média:{" "}
                      {typeof p.mediaAvaliacoes === "number"
                        ? p.mediaAvaliacoes.toFixed(1)
                        : "0.0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* AÇÕES */}
              <div className="border-t border-[#F0F1F6] px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row gap-2">
                <Button
                  className="flex-1 h-9 sm:h-10 bg-emerald-500 hover:bg-emerald-600 text-xs sm:text-sm rounded-full"
                  onClick={() => aprovar(p.id)}
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Aprovar
                </Button>

                <Button
                  variant="destructive"
                  className="flex-1 h-9 sm:h-10 text-xs sm:text-sm rounded-full"
                  onClick={() => rejeitar(p.id)}
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Rejeitar
                </Button>
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
