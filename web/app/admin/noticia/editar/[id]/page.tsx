"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NoticiaForm {
  titulo: string;
  conteudo: string;
  esporte: string;
}

export default function EditarNoticiaPage() {
  const router = useRouter();
  const { id } = useParams();

  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<NoticiaForm>({
    titulo: "",
    conteudo: "",
    esporte: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    async function loadNoticia() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/noticias/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Erro ao carregar notícia");
        }

        const data = await res.json();
        setInitialData(data);

        setForm({
          titulo: data.titulo ?? "",
          conteudo: data.conteudo ?? "",
          esporte: data.esporte ?? "",
        });
      } catch (err) {
        console.error("Erro ao carregar notícia:", err);
        alert("Erro ao carregar notícia.");
        router.push("/admin/noticia");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadNoticia();
  }, [id, router]);

  function resetarCampos() {
    if (!initialData) return;

    setForm({
      titulo: initialData.titulo ?? "",
      conteudo: initialData.conteudo ?? "",
      esporte: initialData.esporte ?? "",
    });
  }

  async function salvarAlteracoes(e: React.FormEvent) {
    e.preventDefault();
    if (!initialData) return;

    const payload: any = {};

    if (form.titulo !== initialData.titulo) payload.titulo = form.titulo;
    if (form.conteudo !== initialData.conteudo) payload.conteudo = form.conteudo;
    if (form.esporte !== initialData.esporte) payload.esporte = form.esporte;

    if (Object.keys(payload).length === 0) {
      alert("Nenhuma alteração realizada.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/noticias/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Erro ao salvar alterações.");
        return;
      }

      alert("Notícia atualizada!");
      router.push("/admin/noticia");
      router.refresh();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar alterações.");
    }
  }

  if (loading || !initialData) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-[#7C8698]">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <header className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl border border-[#E5E7F0] px-4 sm:px-6 py-4 sm:py-5">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#14539A]">
              Editar Notícia
            </h1>
            <p className="text-xs sm:text-sm text-[#7C8698]">
              Atualize somente o que desejar.
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
        <Card className="w-full max-w-2xl bg-white border border-[#E5E7F0] rounded-2xl shadow-sm px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-7">
          <form onSubmit={salvarAlteracoes} className="flex flex-col gap-4 sm:gap-5">

            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm font-medium text-[#14539A]">Título</label>
              <Input
                name="titulo"
                value={form.titulo}
                onChange={onChange}
                className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm font-medium text-[#14539A]">Esporte</label>
              <Input
                name="esporte"
                value={form.esporte}
                onChange={onChange}
                className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm font-medium text-[#14539A]">Conteúdo</label>
              <textarea
                name="conteudo"
                value={form.conteudo}
                onChange={onChange}
                className="w-full border border-[#E0E3EB] rounded-xl p-2.5 h-40 text-sm resize-y"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1 bg-[#14539A] hover:bg-[#104177] text-white rounded-full h-10 sm:h-11 text-sm font-semibold"
              >
                Salvar alterações
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={resetarCampos}
                className="flex-1 border-[#D2D7E5] text-[#14539A] hover:bg-[#F2F4FB] rounded-full h-10 sm:h-11 text-sm font-semibold"
              >
                Resetar
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
}
