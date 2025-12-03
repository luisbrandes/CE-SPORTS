"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function EditarProjetoPage() {
  const router = useRouter();
  const { id } = useParams();

  const [initialData, setInitialData] = useState<any>(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    modalidade: "",
    local: "",
    dataInicio: "",
    dataFim: "",
    responsavel: "",
    vagasTotais: "",
  });

  const onChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===============================
  // BUSCAR PROJETO
  // ===============================
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
          nome: data.nome,
          descricao: data.descricao,
          modalidade: data.modalidade,
          local: data.local,
          dataInicio: data.dataInicio,
          dataFim: data.dataFim,
          responsavel: data.responsavel,
          vagasTotais: data.vagasTotais,
        });

      } catch (err) {
        console.error(err);
        alert("Erro ao carregar dados do projeto");
      }
    }

    loadProjeto();
  }, [id]);

  // ===============================
  // RESETAR FORM
  // ===============================
  function resetarCampos() {
    if (!initialData) return;

    setForm({
      nome: initialData.nome,
      descricao: initialData.descricao,
      modalidade: initialData.modalidade,
      local: initialData.local,
      dataInicio: initialData.dataInicio,
      dataFim: initialData.dataFim,
      responsavel: initialData.responsavel,
      vagasTotais: initialData.vagasTotais,
    });
  }


  async function salvarAlteracoes(e: React.FormEvent) {
    e.preventDefault();
    if (!initialData) return;

    const payload: any = {};

    Object.keys(form).forEach((key) => {
      if (String((form as any)[key]) !== String(initialData[key])) {
        payload[key] = (form as any)[key];
      }
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

      alert("✓ Projeto atualizado!");
      router.push("/admin/projetos");
      router.refresh();

    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações.");
    }
  }

  if (!initialData)
    return <p className="text-center mt-10 text-gray-600">Carregando...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-xl p-8 flex flex-col gap-6">

        <h1 className="text-3xl font-bold text-center text-black">
          Editar Projeto
        </h1>

        <p className="text-sm text-muted-foreground text-center -mt-4">
          Atualize somente o que desejar. Os demais campos ficam iguais.
        </p>

        <form onSubmit={salvarAlteracoes} className="flex flex-col gap-4">

          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input name="nome" value={form.nome} onChange={onChange} />
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={onChange}
              className="w-full border rounded-md p-2 h-24 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Modalidade</label>
            <Input name="modalidade" value={form.modalidade} onChange={onChange} />
          </div>

          <div>
            <label className="text-sm font-medium">Local</label>
            <Input name="local" value={form.local} onChange={onChange} />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Data início</label>
              <Input
                type="date"
                name="dataInicio"
                value={form.dataInicio}
                onChange={onChange}
              />
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium">Data fim</label>
              <Input
                type="date"
                name="dataFim"
                value={form.dataFim}
                onChange={onChange}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Responsável</label>
            <Input name="responsavel" value={form.responsavel} onChange={onChange} />
          </div>

          <div>
            <label className="text-sm font-medium">Vagas totais</label>
            <Input
              type="number"
              name="vagasTotais"
              value={form.vagasTotais}
              onChange={onChange}
            />
          </div>

          <div className="flex gap-4 mt-4">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Salvar Alterações
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={resetarCampos}
            >
              Resetar
            </Button>
          </div>
        </form>

        <button
          onClick={() => router.push("/admin/projetos")}
          className="text-blue-600 hover:underline text-center font-medium"
        >
          ← Voltar para Projetos
        </button>

      </Card>
    </div>
  );
}
