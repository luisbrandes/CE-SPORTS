"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProjetoForm {
  nome: string;
  descricao: string;
  modalidade: string;
  local: string;
  dataInicio: string;
  dataFim: string;
  responsavel: string;
  vagasTotais: string | number;
}

export default function EditarProjetoPage() {
  const router = useRouter();
  const { id } = useParams();

  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<ProjetoForm>({
    nome: "",
    descricao: "",
    modalidade: "",
    local: "",
    dataInicio: "",
    dataFim: "",
    responsavel: "",
    vagasTotais: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    async function loadProjeto() {
      try {
        const res = await fetch(`http://localhost:8080/api/projetos/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erro ao carregar projeto");

        const data = await res.json();
        setInitialData(data);

        setForm({
          nome: data.nome ?? "",
          descricao: data.descricao ?? "",
          modalidade: data.modalidade ?? "",
          local: data.local ?? "",
          dataInicio: data.dataInicio ?? "",
          dataFim: data.dataFim ?? "",
          responsavel: data.responsavel ?? "",
          vagasTotais: data.vagasTotais ?? "",
        });
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar dados do projeto.");
      } finally {
        setLoading(false);
      }
    }

    loadProjeto();
  }, [id]);

  function resetarCampos() {
    if (!initialData) return;

    setForm({
      nome: initialData.nome ?? "",
      descricao: initialData.descricao ?? "",
      modalidade: initialData.modalidade ?? "",
      local: initialData.local ?? "",
      dataInicio: initialData.dataInicio ?? "",
      dataFim: initialData.dataFim ?? "",
      responsavel: initialData.responsavel ?? "",
      vagasTotais: initialData.vagasTotais ?? "",
    });
  }

  async function salvarAlteracoes(e: React.FormEvent) {
    e.preventDefault();
    if (!initialData) return;

    const payload: any = {};
    Object.keys(form).forEach((key) => {
      const novo = String((form as any)[key] ?? "");
      const antigo = String(initialData[key] ?? "");
      if (novo !== antigo) payload[key] = (form as any)[key];
    });

    if (Object.keys(payload).length === 0) {
      alert("Nenhuma alteração feita.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/projetos/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        alert("Erro ao salvar: " + msg);
        return;
      }

      alert("Projeto atualizado!");
      router.push("/admin/projetos");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações.");
    }
  }

  if (loading || !initialData) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] ">
        <p className="text-sm sm:text-base text-[#7C8698]">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ">
      {/* HEADER alinhado com o restante do painel */}
      <header className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl border border-[#E5E7F0] px-4 sm:px-6 py-4 sm:py-5">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#14539A]">
              Editar Projeto
            </h1>
            <p className="text-xs sm:text-sm text-[#7C8698]">
              Atualize somente o que desejar. Os demais campos permanecem iguais.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/projetos")}
            className="w-full sm:w-auto border-[#D2D7E5] text-[#14539A] hover:bg-[#F2F4FB] rounded-full h-9 sm:h-10 px-4 text-xs sm:text-sm font-medium"
          >
            ← Voltar para Projetos
          </Button>
        </div>
      </header>

      {/* FORMULÁRIO CENTRAL */}
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl bg-white border border-[#E5E7F0] rounded-2xl shadow-sm px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-7">
          <form
            onSubmit={salvarAlteracoes}
            className="flex flex-col gap-4 sm:gap-5"
          >
            {/* Nome */}
            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm font-medium text-[#14539A]">
                Nome
              </label>
              <Input
                name="nome"
                value={form.nome}
                onChange={onChange}
                className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
              />
            </div>

            {/* Descrição */}
            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm font-medium text-[#14539A]">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={onChange}
                className="w-full border border-[#E0E3EB] rounded-xl p-2.5 sm:p-3 h-24 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#14539A]/10"
              />
            </div>

            {/* Modalidade */}
            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm font-medium text-[#14539A]">
                Modalidade
              </label>
              <Input
                name="modalidade"
                value={form.modalidade}
                onChange={onChange}
                className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
              />
            </div>

            {/* Local */}
            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm font-medium text-[#14539A]">
                Local
              </label>
              <Input
                name="local"
                value={form.local}
                onChange={onChange}
                className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
              />
            </div>

            {/* Datas */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-xs sm:text-sm font-medium text-[#14539A]">
                  Data início
                </label>
                <Input
                  type="date"
                  name="dataInicio"
                  value={form.dataInicio}
                  onChange={onChange}
                  className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <label className="text-xs sm:text-sm font-medium text-[#14539A]">
                  Data fim
                </label>
                <Input
                  type="date"
                  name="dataFim"
                  value={form.dataFim}
                  onChange={onChange}
                  className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
                />
              </div>
            </div>

            {/* Responsável */}
            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm font-medium text-[#14539A]">
                Responsável
              </label>
              <Input
                name="responsavel"
                value={form.responsavel}
                onChange={onChange}
                className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
              />
            </div>

            {/* Vagas Totais */}
            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm font-medium text-[#14539A]">
                Vagas totais
              </label>
              <Input
                type="number"
                name="vagasTotais"
                value={form.vagasTotais}
                onChange={onChange}
                className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
              />
            </div>

            {/* Ações */}
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
