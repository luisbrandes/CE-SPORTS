"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Noticia {
  id: number;
  titulo: string;
  conteudo: string;
  esporte: string;
  autorId: number;
  autorNome: string;
  criadaEm: string;
}

interface NotificacoesState {
  ativado: boolean;
  loading: boolean;
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificacoes, setNotificacoes] = useState<NotificacoesState>({
    ativado: false,
    loading: true,
  });
  const router = useRouter();

  const [filtroTitulo, setFiltroTitulo] = useState("");
  const [filtroAutor, setFiltroAutor] = useState("");
  const [filtroEsporte, setFiltroEsporte] = useState("");

  useEffect(() => {
    async function loadPreferencia() {
      try {
        const res = await fetch("http://localhost:8080/api/notificacoes/status", {
          credentials: "include",
        });

        const json = await res.json();

        setNotificacoes({
          ativado: json.ativado,
          loading: false,
        });

        localStorage.setItem(
          "notificacoes_ativadas",
          JSON.stringify(json.ativado)
        );
      } catch {
        const cache = localStorage.getItem("notificacoes_ativadas");
        setNotificacoes({
          ativado: cache ? JSON.parse(cache) : false,
          loading: false,
        });
      }
    }

    loadPreferencia();
  }, []);

  useEffect(() => {
    async function loadNoticias() {
      try {
        const res = await fetch("http://localhost:8080/api/noticias", {
          credentials: "include",
        });

        const data = await res.json();

        let noticiasData: Noticia[] = [];

        if (Array.isArray(data)) noticiasData = data;
        else if (data?.content) noticiasData = data.content;
        else if (data?.data) noticiasData = data.data;

        const ordenadas = noticiasData
          .sort(
            (a, b) =>
              new Date(b.criadaEm).getTime() - new Date(a.criadaEm).getTime()
          )
          .slice(0, 10);

        setNoticias(ordenadas);
      } catch {
      } finally {
        setLoading(false);
      }
    }

    loadNoticias();
  }, []);

  const noticiasFiltradas = useMemo(() => {
    return noticias.filter((n) => {
      const t = n.titulo.toLowerCase().includes(filtroTitulo.toLowerCase());
      const a = n.autorNome.toLowerCase().includes(filtroAutor.toLowerCase());
      const e =
        !filtroEsporte ||
        n.esporte.toLowerCase().includes(filtroEsporte.toLowerCase());
      return t && a && e;
    });
  }, [noticias, filtroTitulo, filtroAutor, filtroEsporte]);

  const limparFiltros = () => {
    setFiltroTitulo("");
    setFiltroAutor("");
    setFiltroEsporte("");
  };

  const formatarData = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLerMais = (id: number) => {
    router.push(`/noticias/${id}`);
  };

  async function toggleNotificacoes() {
    setNotificacoes((prev) => ({ ...prev, loading: true }));

    try {
      const novo = !notificacoes.ativado;
      const endpoint = novo ? "ativar" : "desativar";

      const res = await fetch(
        `http://localhost:8080/api/notificacoes/${endpoint}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error();

      setNotificacoes({
        ativado: novo,
        loading: false,
      });

      localStorage.setItem("notificacoes_ativadas", JSON.stringify(novo));
    } catch {
      setNotificacoes((prev) => ({ ...prev, loading: false }));
    }
  }

  if (loading || notificacoes.loading) {
    return (
      <main className="container mx-auto px-6 py-12 min-h-screen bg-gray-50">
        <p className="text-center text-gray-500 text-xl mt-20">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-8 min-h-screen ">
      {/* Cabeçalho */}
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4 select-none">
          Últimas Notícias
        </h1>
        <p className="text-xl text-gray-600">
          Fique por dentro de tudo que acontece no mundo do esporte do CEFET-MG
        </p>
      </div>

      {/* Card de Notificações */}
      <div className="max-w-4xl mx-auto mb-10">
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border">
                {notificacoes.ativado ? (
                  <Bell className="w-7 h-7 text-blue-600" />
                ) : (
                  <BellOff className="w-7 h-7 text-gray-400" />
                )}
              </div>

              <div>
                <h3 className="font-bold text-xl text-gray-800 select-none">
                  Receber notificações por email
                </h3>
                <p className="text-sm text-gray-600">
                  {notificacoes.ativado
                    ? "Você receberá avisos de novas notícias"
                    : "Clique para ativar as notificações"}
                </p>
              </div>
            </div>

            <Button
              onClick={toggleNotificacoes}
              disabled={notificacoes.loading}
              className={cn(
                "px-8 py-3 text-lg rounded-xl font-semibold shadow-md transition-all flex items-center gap-2",
                notificacoes.loading
                  ? "bg-gray-300 text-gray-600 cursor-wait"
                  : notificacoes.ativado
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/50 hover:shadow-red-500/75"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-green-500/50 hover:shadow-green-500/75"
              )}
            >
              {notificacoes.loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    />
                  </svg>
                  Salvando...
                </>
              ) : notificacoes.ativado ? (
                <>
                  <BellOff className="w-5 h-5" />
                  Desativar
                </>
              ) : (
                <>
                  <Bell className="w-5 h-5" />
                  Ativar
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-6 mb-10 bg-white border border-gray-300 shadow-md rounded-xl space-y-6 max-w-4xl mx-auto">
        <h2 className="font-semibold text-xl text-gray-800 select-none">Filtrar Notícias</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 select-none">
              Título
            </label>
            <Input
              value={filtroTitulo}
              onChange={(e) => setFiltroTitulo(e.target.value)}
              placeholder="Ex: Futsal, Copa Caloura..."
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 select-none">
              Autor
            </label>
            <Input
              value={filtroAutor}
              onChange={(e) => setFiltroAutor(e.target.value)}
              placeholder="Ex: João Silva..."
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 select-none">
              Esporte
            </label>
            <Input
              value={filtroEsporte}
              onChange={(e) => setFiltroEsporte(e.target.value)}
              placeholder="Ex: Futsal, Vôlei..."
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600 select-text">
            Mostrando {noticiasFiltradas.length} de {noticias.length} notícias
          </p>
          <Button variant="outline" onClick={limparFiltros} className="hover:bg-gray-100">
            Limpar filtros
          </Button>
        </div>
      </Card>

      {/* Lista de Notícias */}
      <section className="space-y-6 max-w-4xl mx-auto">
        {noticiasFiltradas.length === 0 ? (
          <Card className="p-12 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
            <p className="text-gray-500 text-lg select-text mb-6">
              Nenhuma notícia encontrada com os filtros aplicados.
            </p>
            <Button onClick={limparFiltros} variant="outline" className="hover:bg-gray-100">
              Ver todas as notícias
            </Button>
          </Card>
        ) : (
          noticiasFiltradas.map((noticia) => (
            <Card
              key={noticia.id}
              className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-300 cursor-pointer group hover:-translate-y-1"
              onClick={() => handleLerMais(noticia.id)}
            >
              <div className="flex items-start justify-between mb-4">
                {noticia.esporte && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full select-none">
                    {noticia.esporte}
                  </span>
                )}
                <span className="text-sm text-gray-500 font-medium">
                  {formatarData(noticia.criadaEm)}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-blue-700 mb-4 leading-tight group-hover:text-blue-800 transition-colors select-text">
                {noticia.titulo}
              </h2>

              <p className="text-gray-700 mb-6 leading-relaxed line-clamp-3 select-text">
                {noticia.conteudo}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 font-medium">
                  Por {noticia.autorNome}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-blue-50 border-blue-300 text-blue-700 hover:text-blue-900 transition-colors"
                >
                  Ler mais →
                </Button>
              </div>
            </Card>
          ))
        )}
      </section>
    </main>
  );
}
