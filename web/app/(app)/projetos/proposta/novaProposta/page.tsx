"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NovaPropostaPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    modalidade: "",
    local: "",
    dataInicio: "",
    dataFim: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvar() {
    const alunoId = localStorage.getItem("alunoId");

    const res = await fetch(`http://localhost:8080/api/proposta/${alunoId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Erro ao criar proposta");
      return;
    }

    alert("Proposta enviada para avaliação!");
    router.push("/projetos");
  }

  return (
    <main className="container mx-auto px-6 py-10 max-w-2xl">
      <Card className="p-8 space-y-6 shadow-lg">
        <h1 className="text-3xl font-bold text-blue-700">
          Nova Proposta de Projeto
        </h1>

        <Input name="nome" placeholder="Nome do Projeto" onChange={handleChange} />
        <Input name="modalidade" placeholder="Modalidade" onChange={handleChange} />
        <Input name="local" placeholder="Local" onChange={handleChange} />
        <Input type="date" name="dataInicio" onChange={handleChange} />
        <Input type="date" name="dataFim" onChange={handleChange} />

        <textarea
          name="descricao"
          placeholder="Descrição do projeto"
          onChange={handleChange}
          className="w-full min-h-[120px] border rounded-md p-3"
        />

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>

          <Button onClick={salvar} className="bg-green-600 text-white">
            Enviar Proposta
          </Button>
        </div>
      </Card>
    </main>
  );
}
