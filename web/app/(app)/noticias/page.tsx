"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, CheckCircle, XCircle } from "lucide-react";
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
    loading: false,
  });
  const router = useRouter();
  
  const [filtroTitulo, setFiltroTitulo] = useState("");
  const [filtroAutor, setFiltroAutor] = useState("");
  const [filtroEsporte, setFiltroEsporte] = useState("");

  // Carrega preferência de notificações do localStorage
  useEffect(() => {
    const preferencia = localStorage.getItem("notificacoes_ativadas");
    if (preferencia !== null) {
      setNotificacoes({
        ativado: JSON.parse(preferencia),
        loading: false,
      });
    }
  }, []);

  useEffect(() => {
    async function loadNoticias() {
      try {
        const res = await fetch("http://localhost:8080/api/noticias", {
          credentials: "include",
        });
        
        const data = await res.json();
        
        let noticiasData: Noticia[] = [];
        if (Array.isArray(data)) {
          noticiasData = data;
        } else if (data && typeof data === "object") {
          if (Array.isArray((data as any).content)) noticiasData = (data as any).content;
          else if (Array.isArray((data as any).data)) noticiasData = (data as any).data;
        }
        
        const noticiasOrdenadas = noticiasData
          .filter((n: any) => n && n.titulo)
          .sort((a: any, b: any) => 
            new Date(b.criadaEm).getTime() - new Date(a.criadaEm).getTime()
          )
          .slice(0, 10);
        
        setNoticias(noticiasOrdenadas);
      } catch (err) {
        console.error("Erro ao carregar notícias:", err);
        setNoticias([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadNoticias();
  }, []);

  const noticiasFiltradas = useMemo(() => {
    return noticias.filter((n) => {
      const matchTitulo = (n.titulo || "").toLowerCase().includes(filtroTitulo.toLowerCase());
      const matchAutor = (n.autorNome || "").toLowerCase().includes(filtroAutor.toLowerCase());
      const matchEsporte = !filtroEsporte || 
        (n.esporte || "").toLowerCase().includes(filtroEsporte.toLowerCase());
      
      return matchTitulo && matchAutor && matchEsporte;
    });
  }, [noticias, filtroTitulo, filtroAutor, filtroEsporte]);

  const limparFiltros = () => {
    setFiltroTitulo("");
    setFiltroAutor("");
    setFiltroEsporte("");
  };

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Data inválida";
    }
  };

  const handleLerMais = (id: number) => {
    router.push(`/noticias/${id}`);
  };

  const toggleNotificacoes = async () => {
    setNotificacoes(prev => ({ ...prev, loading: true }));
    
    try {
      const novoEstado = !notificacoes.ativado;
      
      // Salva no localStorage (frontend)
      localStorage.setItem("notificacoes_ativadas", JSON.stringify(novoEstado));
      
      // Chama API para ativar/desativar (quando backend estiver pronto)
      // Por enquanto só atualiza estado local
      if (novoEstado) {
        // Simula ativação - no futuro chamará /api/notificacoes/ativar
        console.log("Notificações ativadas - pronto para receber emails");
      } else {
        // Simula desativação - no futuro chamará /api/notificacoes/desativar
        console.log("Notificações desativadas");
      }
      
      setNotificacoes({ ativado: novoEstado, loading: false });
      
      
      const toast = document.createElement("div");
      toast.className = "fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 flex items-center gap-3 transition-all duration-300";
      toast.innerHTML = `
        <div class="w-5 h-5 rounded-full ${novoEstado ? 'bg-green-500' : 'bg-gray-500'} flex items-center justify-center">
          ${novoEstado ? '<CheckCircle class="w-3 h-3 text-white"/>' : '<XCircle class="w-3 h-3 text-white"/>'}
        </div>
        <span class="font-medium text-white">${novoEstado ? 'Notificações ativadas!' : 'Notificações desativadas'}</span>
      `;
      if (novoEstado) {
        Object.assign(toast.style, {
          background: 'linear-gradient(135deg, #10b981, #059669)',
        });
      } else {
        Object.assign(toast.style, {
          background: 'linear-gradient(135deg, #6b7280, #4b5563)',
        });
      }
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add("translate-x-full");
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
      
    } catch (err) {
      console.error("Erro ao alternar notificações:", err);
      setNotificacoes(prev => ({ ...prev, loading: false }));
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-6 py-12 min-h-screen ">
        <p className="text-center text-gray-500 text-xl mt-20">Carregando notícias...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-8 min-h-screen ">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4 select-none">
          Últimas Notícias
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Fique por dentro de tudo que acontece no mundo do esporte do CEFET-MG
        </p>
      </div>

      {/* Botão de Notificações */}
      <div className="max-w-4xl mx-auto mb-8">
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm border">
                {notificacoes.ativado ? (
                  <Bell className="w-6 h-6 text-blue-600" />
                ) : (
                  <BellOff className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  Receber notificações por email
                </h3>
                <p className="text-sm text-gray-600">
                  {notificacoes.ativado 
                    ? "Você receberá emails sobre novas notícias importantes" 
                    : "Ative para receber notificações das últimas notícias"
                  }
                </p>
              </div>
            </div>
            
            <Button
              onClick={toggleNotificacoes}
              disabled={notificacoes.loading}
              className={cn(
                "px-6 py-2 font-semibold rounded-xl shadow-lg transition-all duration-300",
                notificacoes.ativado 
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-green-500/50 hover:shadow-green-500/75" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:shadow-md"
              )}
            >
              {notificacoes.loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </span>
              ) : notificacoes.ativado ? (
                "Ativo"
              ) : (
                "Ativar"
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-6 mb-10 bg-white border border-gray-300 shadow-md rounded-xl space-y-6">
        <h2 className="font-semibold text-xl text-gray-800 select-none">Filtrar Notícias</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 select-none">Título</label>
            <Input
              value={filtroTitulo}
              onChange={(e) => setFiltroTitulo(e.target.value)}
              placeholder="Ex: Futsal, Copa Caloura..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 select-none">Autor</label>
            <Input
              value={filtroAutor}
              onChange={(e) => setFiltroAutor(e.target.value)}
              placeholder="Ex: João Silva..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2 select-none">Esporte</label>
            <Input
              value={filtroEsporte}
              onChange={(e) => setFiltroEsporte(e.target.value)}
              placeholder="Ex: Futsal, Vôlei..."
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando {noticiasFiltradas.length} de {noticias.length} notícias
          </p>
          <Button variant="outline" onClick={limparFiltros}>
            Limpar filtros
          </Button>
        </div>
      </Card>

      {/* Lista de Notícias */}
      <section className="space-y-6 max-w-4xl mx-auto">
        {noticiasFiltradas.length === 0 ? (
          <Card className="p-12 text-center bg-white border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">Nenhuma notícia encontrada.</p>
            <Button onClick={limparFiltros} variant="outline" className="mt-4">
              Ver todas as notícias
            </Button>
          </Card>
        ) : (
          noticiasFiltradas.map((noticia) => (
            <Card
              key={noticia.id}
              className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-300 cursor-pointer group"
              onClick={() => handleLerMais(noticia.id)}
            >
              <div className="flex items-start justify-between mb-4">
                {noticia.esporte && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {noticia.esporte}
                  </span>
                )}
                <span className="text-sm text-gray-500 font-medium">
                  {formatarData(noticia.criadaEm)}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-blue-700 mb-4 leading-tight group-hover:text-blue-800">
                {noticia.titulo}
              </h2>

              <p className="text-gray-700 mb-6 leading-relaxed line-clamp-3">
                {noticia.conteudo}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 font-medium">
                  Por {noticia.autorNome}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-blue-50 border-blue-300 text-blue-700"
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
