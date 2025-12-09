"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CadastrarNoticiaPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [esporte, setEsporte] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !conteudo) {
      alert("Preencha título e conteúdo.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/noticias", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          conteudo,
          esporte,
        }),
      });

      if (res.status === 201) {
        alert("Notícia cadastrada com sucesso!");
        router.push("/admin/noticia");
      } else {
        const text = await res.text();
        throw new Error(text || "Erro ao cadastrar notícia");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar notícia. Veja o console.");
    }
  };

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ">
      <header className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl border border-[#E5E7F0] px-4 sm:px-6 py-4 sm:py-5">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#14539A]">
              Cadastrar Nova Notícia
            </h1>
            <p className="text-xs sm:text-sm text-[#7C8698]">
              Preencha as informações para publicar uma nova notícia.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/noticia")}
            className="w-full sm:w-auto border-[#D2D7E5] text-[#14539A] hover:bg-[#F2F4FB] rounded-full h-9 sm:h-10 px-4 text-xs sm:text-sm font-medium"
          >
            ← Voltar para Notícias
          </Button>
        </div>
      </header>

      <div className="flex justify-center">
        <Card className="max-w-2xl w-full bg-white border border-[#E5E7F0] rounded-2xl shadow-sm px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-7">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="flex flex-col gap-1">
              <label className="block text-xs sm:text-sm font-medium text-[#14539A]">Título</label>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-xs sm:text-sm font-medium text-[#14539A]">Conteúdo</label>
              <textarea
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                rows={8}
                required
                className="w-full rounded-xl border border-[#E0E3EB] p-2.5 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-xs sm:text-sm font-medium text-[#14539A]">Esporte / Tag</label>
              <Input
                value={esporte}
                onChange={(e) => setEsporte(e.target.value)}
                className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1 bg-[#FFC94B] hover:bg-[#ffbf24] text-[#1B3C6D] font-semibold rounded-full h-10 sm:h-11 text-sm"
              >
                Publicar Notícia
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/noticia")}
                className="flex-1 border-[#D2D7E5] text-[#14539A] hover:bg-[#F2F4FB] rounded-full h-10 sm:h-11 text-sm"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
