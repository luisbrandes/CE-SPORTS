"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Proposta {
  id: number;
  nome: string;
  descricao: string;
  modalidade: string;
  local: string;
  status: string;
}

export default function Page() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);

  useEffect(() => {
    const alunoId = localStorage.getItem("alunoId");

    fetch(`http://localhost:8080/api/propostas/minhas/${alunoId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setPropostas);
  }, []);

  async function salvar(p: Proposta) {
    const alunoId = localStorage.getItem("alunoId");

    await fetch(`http://localhost:8080/api/propostas/${p.id}/${alunoId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });

    alert("Proposta atualizada");
  }

  return (
    <main className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Minhas Propostas</h1>

      <section className="grid md:grid-cols-2 gap-6">
        {propostas.map((p) => (
          <Card key={p.id} className="p-6 space-y-3">
            <span className="text-xs font-bold text-gray-500">{p.status}</span>

            <Input
              value={p.nome}
              disabled={p.status !== "PENDENTE"}
              onChange={(e) =>
                setPropostas((prev) =>
                  prev.map((x) =>
                    x.id === p.id ? { ...x, nome: e.target.value } : x
                  )
                )
              }
            />

            <Input
              value={p.descricao}
              disabled={p.status !== "PENDENTE"}
              onChange={(e) =>
                setPropostas((prev) =>
                  prev.map((x) =>
                    x.id === p.id ? { ...x, descricao: e.target.value } : x
                  )
                )
              }
            />

            {p.status === "PENDENTE" && (
              <Button onClick={() => salvar(p)}>Salvar</Button>
            )}
          </Card>
        ))}
      </section>
    </main>
  );
}
