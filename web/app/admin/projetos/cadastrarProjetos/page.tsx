"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NovoProjetoPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    local: "",
    modalidade: "",
    responsavel: "",
    vagasTotais: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.vagasTotais || Number(form.vagasTotais) <= 0) {
      alert("O número de vagas deve ser maior que zero.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/projetos", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          vagasTotais: Number(form.vagasTotais),
        }),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar projeto");

      alert("Projeto cadastrado com sucesso!");
      router.push("/admin/projetos");
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar projeto.");
    }
  };

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ">
     
      <header className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl border border-[#E5E7F0] px-4 sm:px-6 py-4 sm:py-5">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#14539A]">
              Cadastrar Novo Projeto
            </h1>
            <p className="text-xs sm:text-sm text-[#7C8698]">
              Preencha as informações abaixo para adicionar um novo projeto ao sistema.
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

    
      <div className="flex justify-center">
        <Card className="max-w-2xl w-full bg-white border border-[#E5E7F0] rounded-2xl shadow-sm px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-7">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
   
            <div className="flex flex-col gap-1">
              <label className="block text-xs sm:text-sm font-medium text-[#14539A]">
                Nome do Projeto
              </label>
              <Input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Projeto Futsal 2025"
                required
                className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-xs sm:text-sm font-medium text-[#14539A]">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva brevemente o projeto..."
                className="w-full rounded-xl border border-[#E0E3EB] bg-white p-2.5 sm:p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#14539A]/10"
                required
              />
            </div>

     
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col gap-1">
                <label className="block text-xs sm:text-sm font-medium text-[#14539A]">
                  Data de Início
                </label>
                <Input
                  type="date"
                  name="dataInicio"
                  value={form.dataInicio}
                  onChange={handleChange}
                  required
                  className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="block text-xs sm:text-sm font-medium text-[#14539A]">
                  Data de Término
                </label>
                <Input
                  type="date"
                  name="dataFim"
                  value={form.dataFim}
                  onChange={handleChange}
                  required
                  className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col gap-1">
                <label className="block text-xs sm:text-sm font-medium text-[#14539A]">
                  Local
                </label>
                <Input
                  name="local"
                  value={form.local}
                  onChange={handleChange}
                  placeholder="Ex: Ginásio Principal"
                  required
                  className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="block text-xs sm:text-sm font-medium text-[#14539A]">
                  Modalidade
                </label>
                <Input
                  name="modalidade"
                  value={form.modalidade}
                  onChange={handleChange}
                  placeholder="Ex: Futsal"
                  required
                  className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
                />
              </div>
            </div>


            <div className="flex flex-col gap-1">
              <label className="block text-xs sm:text-sm font-medium text-[#14539A]">
                Responsável
              </label>
              <Input
                name="responsavel"
                value={form.responsavel}
                onChange={handleChange}
                placeholder="Nome do responsável"
                required
                className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
              />
            </div>


            <div className="flex flex-col gap-1">
              <label className="block text-xs sm:text-sm font-medium text-[#14539A]">
                Número de Vagas
              </label>
              <Input
                type="number"
                name="vagasTotais"
                value={form.vagasTotais}
                onChange={handleChange}
                placeholder="Ex: 20"
                required
                min={1}
                className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                className="w-full sm:flex-1 bg-[#FFC94B] hover:bg-[#ffbf24] text-[#1B3C6D] font-semibold rounded-full h-10 sm:h-11 text-sm"
              >
                Adicionar Projeto
              </Button>

            </div>
          </form>

          <footer className="text-center text-[11px] sm:text-xs text-[#A0A7B8] pt-4">
            © 2025 CE Sports - CEFET-MG
          </footer>
        </Card>
      </div>
    </div>
  );
}
