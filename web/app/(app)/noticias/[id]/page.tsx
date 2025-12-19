"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Noticia {
  id: number;
  titulo: string;
  conteudo: string;
  esporte: string;
  autorId: number;
  autorNome: string;
  criadaEm: string;
}

export default function NoticiaDetalhePage() {
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function loadNoticia() {
      try {
        const id = params.id as string;
        const res = await fetch(`http://localhost:8080/api/noticias/${id}`, {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          setNoticia(data);
        } else {
          console.error("Notícia não encontrada");
        }
      } catch (err) {
        console.error("Erro ao carregar notícia:", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (params.id) {
      loadNoticia();
    }
  }, [params.id]);

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleString("pt-BR", {
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

  if (loading) {
    return (
      <main className="container mx-auto px-6 py-12 min-h-screen ">
        <p className="text-center text-gray-500 text-xl mt-20">Carregando notícia...</p>
      </main>
    );
  }

  if (!noticia) {
    return (
      <main className="container mx-auto px-6 py-12 min-h-screen ">
        <Card className="p-12 text-center max-w-2xl mx-auto bg-white border border-gray-200 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Notícia não encontrada</h1>
          <p className="text-gray-600 mb-6">A notícia que você procura não existe ou foi removida.</p>
          <Link href="/noticias">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              ← Voltar às notícias
            </Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-8 min-h-screen ">
      <div className="max-w-4xl mx-auto">
        {/* Botão voltar */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-8 hover:bg-gray-100"
        >
          ← Voltar às notícias
        </Button>

        <Card className="p-10 bg-white border border-gray-300 shadow-xl rounded-2xl">
          {/* Header da notícia */}
          <div className="flex items-start justify-between mb-6">
            {noticia.esporte && (
              <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
                {noticia.esporte}
              </span>
            )}
            <span className="text-sm text-gray-500 font-medium">
              {formatarData(noticia.criadaEm)}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-extrabold text-blue-700 mb-8 leading-tight">
            {noticia.titulo}
          </h1>

          {/* Conteúdo completo */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            <p className="whitespace-pre-wrap">{noticia.conteudo}</p>
          </div>

          {/* Footer com autor */}
          <div className="flex items-center justify-between pt-8 mt-12 border-t border-gray-200">
            <div>
              <span className="text-sm text-gray-500">Por</span>
              <span className="text-lg font-semibold text-gray-900 ml-2">
                {noticia.autorNome}
              </span>
            </div>
            <Link href="/noticias" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Ver todas as notícias
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
