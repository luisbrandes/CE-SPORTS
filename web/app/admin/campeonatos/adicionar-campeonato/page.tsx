"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdicionarCampeonatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    equipes: "",
    pontosVitoria: "",
    pontosDerrota: "",
    pontosEmpate: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nome: formData.nome,
      equipes: formData.equipes.split(",").map((e) => e.trim()),
      vitoria: Number(formData.pontosVitoria),
      derrota: Number(formData.pontosDerrota),
      empate: Number(formData.pontosEmpate),
    };

    const res = await fetch("http://localhost:8080/api/campeonato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      alert("Erro ao adicionar campeonato");
      return;
    }

    alert("Campeonato criado com sucesso!");
    router.push("/admin/campeonatos");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-md p-8 flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">
            Adicionar Campeonato
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Preencha os dados abaixo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            name="nome"
            placeholder="Nome do campeonato"
            required
            value={formData.nome}
            onChange={handleChange}
          />

          <Input
            name="equipes"
            placeholder="Equipes participantes (separadas por vírgula)"
            required
            value={formData.equipes}
            onChange={handleChange}
          />

          <Input
            name="pontosVitoria"
            type="number"
            placeholder="Pontos por vitória"
            required
            value={formData.pontosVitoria}
            onChange={handleChange}
          />

          <Input
            name="pontosDerrota"
            type="number"
            placeholder="Pontos por derrota"
            required
            value={formData.pontosDerrota}
            onChange={handleChange}
          />

          <Input
            name="pontosEmpate"
            type="number"
            placeholder="Pontos por empate"
            required
            value={formData.pontosEmpate}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Adicionar
          </Button>
        </form>

        <Link
          href="/admin/campeonatos"
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          ← Voltar para Campeonatos
        </Link>
      </Card>
    </div>
  );
}
