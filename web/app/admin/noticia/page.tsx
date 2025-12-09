"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Pencil, Trash2 } from "lucide-react";

interface Noticia {
  id: number;
  titulo: string;
  autorNome: string;
  criadaEm: string;
  conteudo: string;
  esporte?: string;
}

export default function NoticiasListPage() {
  const router = useRouter();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  // NOVO: filtro por esporte/tag
  const [filtroTitulo, setFiltroTitulo] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [filtroEsporte, setFiltroEsporte] = useState("");

  const [error, setError] = useState<string | null>(null);

  const carregar = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:8080/api/noticias", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao carregar notícias");

      const data: Noticia[] = await res.json();
      setNoticias(data);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar notícias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const limparFiltros = () => {
    setFiltroTitulo("");
    setFiltroData("");
    setFiltroEsporte("");
  };

  const noticiasFiltradas = useMemo(() => {
    return noticias.filter((n) => {
      const tituloOk =
        filtroTitulo.trim() === "" ||
        (n.titulo || "")
          .toLowerCase()
          .includes(filtroTitulo.toLowerCase());

      const esporteOk =
        filtroEsporte.trim() === "" ||
        (n.esporte || "")
          .toLowerCase()
          .includes(filtroEsporte.toLowerCase());

      const dataIso = n.criadaEm
        ? new Date(n.criadaEm).toISOString().slice(0, 10)
        : "";

      const dataOk = filtroData === "" || dataIso === filtroData;

      return tituloOk && dataOk && esporteOk;
    });
  }, [noticias, filtroTitulo, filtroData, filtroEsporte]);

  const formatarData = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString("pt-BR") : "-";

  const handleRemover = async (id: number) => {
    if (!confirm("Deseja realmente remover esta notícia?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/noticias/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Erro ao remover notícia");
      }

      setNoticias((prev) => prev.filter((p) => p.id !== id));
      alert("Notícia removida!");
    } catch (err) {
      console.error(err);
      alert("Erro ao remover notícia. Veja o console.");
    }
  };

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      {/* Header */}
      <header className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white rounded-2xl border border-[#E5E7F0] px-4 sm:px-6 py-4 sm:py-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl">📰</span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#14539A]">
                Gerenciar Notícias
              </h1>
            </div>
            <p className="text-sm sm:text-base text-[#7C8698]">
              Crie, edite e exclua notícias do portal
            </p>
          </div>

          <Button
            onClick={() => router.push("/admin/noticia/cadastrar")}
            className="w-full sm:w-auto bg-[#FFC94B] hover:bg-[#ffbf24] text-[#1B3C6D] font-semibold shadow-sm rounded-full px-5 sm:px-6 py-2.5 h-auto"
          >
            + Cadastrar Notícia
          </Button>
        </div>
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
                Filtre por título, data ou tag/esporte
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm bg-[#FFF5CF] text-[#E2A01D] px-3 py-1.5 rounded-full font-semibold">
                {noticiasFiltradas.length} de {noticias.length} notícias
              </span>

              <Button
                variant="outline"
                onClick={limparFiltros}
                className="h-9 sm:h-10 rounded-full border-[#E5E7F0] text-[#14539A] hover:bg-[#F2F4FB] px-3 sm:px-4 text-xs sm:text-sm"
              >
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Buscar título */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B2BACB]" />
              <Input
                value={filtroTitulo}
                onChange={(e) => setFiltroTitulo(e.target.value)}
                placeholder="Pesquisar por título..."
                className="pl-9 h-11 rounded-xl border-[#E0E3EB] text-sm"
              />
            </div>

            {/* Buscar por data */}
            <Input
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="h-11 rounded-xl border-[#E0E3EB] text-sm"
            />

            {/* NOVO - Buscar por esporte/tag */}
            <Input
              value={filtroEsporte}
              onChange={(e) => setFiltroEsporte(e.target.value)}
              placeholder="Filtrar por esporte / tag..."
              className="h-11 rounded-xl border-[#E0E3EB] text-sm"
            />
          </div>
        </Card>
      </section>

      {/* LISTA */}
      {loading ? (
        <Card className="border border-[#E5E7F0] rounded-2xl shadow-sm bg-white py-16 text-center">
          <div className="mx-auto mb-4 h-8 w-8 border-2 border-[#14539A] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm sm:text-base text-[#7C8698]">Carregando...</p>
        </Card>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {noticiasFiltradas.length > 0 ? (
            noticiasFiltradas.map((n) => (
              <Card
                key={n.id}
                className="flex flex-col justify-between border border-[#E5E7F0] rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow"
              >
                <div className="p-4 sm:p-6 space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-[#14539A]">
                    {n.titulo}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7C8698] line-clamp-3">
                    {n.conteudo}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#A0A7B8]">
                    <span>Por {n.autorNome}</span>
                    <span>{formatarData(n.criadaEm)}</span>
                  </div>
                </div>

                <div className="border-t border-[#F0F1F6] px-4 sm:px-6 py-3 sm:py-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-9 sm:h-10"
                    onClick={() => router.push(`/admin/noticia/editar/${n.id}`)}
                  >
                    <Pencil className="w-4 h-4 mr-1.5" />
                    Editar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-9 sm:h-10"
                    onClick={() => router.push(`/admin/noticia/${n.id}`)}
                  >
                    Ler
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 h-9 sm:h-10"
                    onClick={() => handleRemover(n.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Remover
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="col-span-full border border-[#E5E7F0] rounded-2xl shadow-sm bg-white py-14 text-center">
              <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-[#F2F4FB] flex items-center justify-center">
                <Search className="w-5 h-5 text-[#B2BACB]" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[#14539A] mb-1">
                {noticias.length === 0
                  ? "Nenhuma notícia cadastrada ainda."
                  : "Nenhuma notícia encontrada."}
              </h3>
              <p className="text-xs sm:text-sm text-[#7C8698]">
                {noticias.length === 0
                  ? "Clique em “Cadastrar Notícia” para começar."
                  : "Tente ajustar ou limpar os filtros."}
              </p>
            </Card>
          )}
        </section>
      )}
    </div>
  );
}
