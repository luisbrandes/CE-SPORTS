"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Noticia {
  id: number;
  titulo: string;
  autorNome: string;
  criadaEm: string;
  conteudo: string;
  esporte?: string;
}

export default function VisualizarNoticiaPage() {
  const router = useRouter();
  const { id } = useParams();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/noticias/${id}`, { credentials: "include" });
        if (!res.ok) throw new Error("Notícia não encontrada");
        const data: Noticia = await res.json();
        setNoticia(data);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar notícia.");
        router.push("/admin/noticia");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading || !noticia) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] ">
        <p className="text-sm sm:text-base text-[#7C8698]">Carregando...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br text-white">
      <section className="container mx-auto py-12 px-6">
        <Card className="bg-white text-blue-900 p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-2">{noticia.titulo}</h1>
          <p className="text-sm text-gray-500 mb-6">Por {noticia.autorNome} — {new Date(noticia.criadaEm).toLocaleDateString("pt-BR")}</p>
          <div className="prose max-w-none text-gray-800">
            <p>{noticia.conteudo}</p>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => router.push("/admin/noticia")} className="border-[#D2D7E5] text-[#14539A] hover:bg-[#F2F4FB]">← Voltar</Button>
            <Button onClick={() => router.push(`/admin/noticia/editar/${noticia.id}`)} className="bg-[#FFC94B] hover:bg-[#ffbf24] text-[#1B3C6D]">Editar</Button>
          </div>
        </Card>
      </section>
    </main>
  );
}
