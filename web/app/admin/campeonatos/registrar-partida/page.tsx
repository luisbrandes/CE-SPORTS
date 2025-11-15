"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistrarPartidaPage() {
  const [formData, setFormData] = useState({
    campeonato: "",
    equipe1: "",
    equipe2: "",
    pontuacao1: "",
    pontuacao2: "",
    data: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataSelecionada = new Date(formData.data + "T00:00:00");
    dataSelecionada.setHours(0, 0, 0, 0);

    const umAnoAtras = new Date();
    umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);
    umAnoAtras.setHours(0, 0, 0, 0);

    if (dataSelecionada > hoje) {
      alert("A data da partida não pode ser no futuro!");
      return;
    }

    if (dataSelecionada < umAnoAtras) {
      alert("A data da partida não pode ser superior a 1 ano atrás!");
      return;
    }

    await fetch("http://localhost:8080/api/partida", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .catch((err) => window.alert(err))
      .then(() => {
        window.alert("Partida registrada com sucesso");
        router.push("/admin/campeonatos/historico-partidas");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-md p-8 flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">Registrar Partida</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Preencha os dados abaixo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            name="campeonato"
            placeholder="Nome do campeonato"
            required
            value={formData.campeonato}
            onChange={handleChange}
          />
          <Input
            name="equipe1"
            placeholder="Equipe 1"
            required
            value={formData.equipe1}
            onChange={handleChange}
          />
          <Input
            name="equipe2"
            placeholder="Equipe 2"
            required
            value={formData.equipe2}
            onChange={handleChange}
          />
          <Input
            name="pontuacao1"
            type="number"
            placeholder="Pontuação da Equipe 1"
            required
            value={formData.pontuacao1}
            onChange={handleChange}
          />
          <Input
            name="pontuacao2"
            type="number"
            placeholder="Pontuação da Equipe 2"
            required
            value={formData.pontuacao2}
            onChange={handleChange}
          />
          <Input
            name="data"
            type="date"
            required
            className="text-black [&::-webkit-datetime-edit]:text-black"
            value={formData.data}
            onChange={(e) => {
              const value = e.target.value;
              const today = new Date();
              const selected = new Date(value);

              const oneYearAgo = new Date();
              oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

              e.target.setCustomValidity("");

              if (selected > today) {
                e.target.setCustomValidity("A data não pode ser no futuro.");
              } else if (selected < oneYearAgo) {
                e.target.setCustomValidity(
                  "A data não pode ser de mais de 1 ano atrás."
                );
              }

              setFormData({ ...formData, data: value });
            }}
            onInvalid={(e) => {
              const value = (e.target as HTMLInputElement).value;
              if (!value) {
                (e.target as HTMLInputElement).setCustomValidity(
                  "A data é obrigatória."
                );
                return;
              }
            }}
          />

          <Button variant="primary" type="submit" className="w-full">
            Registrar
          </Button>
        </form>

        <Link
          href="/admin/campeonatos/historico-partidas"
          className="text-accent text-blue-600 hover:underline text-sm"
        >
          ← Voltar para histórico
        </Link>
      </Card>
    </div>
  );
}
