"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdicionarCampeonatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    equipes: "",
    pontosVitoria: "3",
    pontosDerrota: "0",
    pontosEmpate: "1",
  });

  const router = useRouter();

  const [numEquipes, setNumEquipes] = useState(0);
  const [equipesArr, setEquipesArr] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "nome") {
      e.target.setCustomValidity("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nome: formData.nome,
      equipes: equipesArr,
      vitoria: Number(formData.pontosVitoria),
      derrota: Number(formData.pontosDerrota),
      empate: Number(formData.pontosEmpate),
    };

    const nomeInput = (e.target as HTMLFormElement).elements.namedItem(
      "nome"
    ) as HTMLInputElement;

    nomeInput.setCustomValidity("");

    const res = await fetch("http://localhost:8080/api/campeonato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 409) {
        nomeInput.setCustomValidity("Esse campeonato já existe.");
        nomeInput.reportValidity();
      } else {
        const errorText = await res.text();
        alert(`Erro ao adicionar campeonato: ${errorText}`);
      }
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
            Configure o sistema de pontuação do campeonato
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
            type="number"
            value={numEquipes}
            onChange={(e) => {
              const val = Number(e.target.value);
              setNumEquipes(val);
              setEquipesArr(Array(val).fill(""));
            }}
            placeholder="Quantidade de equipes"
            min="2"
          />

          {Array.from({ length: numEquipes }).map((_, idx) => (
            <Input
              key={idx}
              type="text"
              value={equipesArr[idx]}
              onChange={(e) => {
                const newArr = [...equipesArr];
                newArr[idx] = e.target.value;
                setEquipesArr(newArr);
              }}
              placeholder={`Equipe ${idx + 1}`}
              required
            />
          ))}

          <div className="space-y-3 border-t pt-4">
            <h3 className="font-medium text-black">Sistema de Pontuação</h3>
            <p className="text-sm text-gray-600">
              Defina quantos pontos cada resultado vale:
            </p>

            <Input
              name="pontosVitoria"
              type="number"
              placeholder="Pontos por vitória"
              required
              value={formData.pontosVitoria}
              onChange={handleChange}
              min="0"
            />

            <Input
              name="pontosDerrota"
              type="number"
              placeholder="Pontos por derrota"
              required
              value={formData.pontosDerrota}
              onChange={handleChange}
              min="0"
            />

            <Input
              name="pontosEmpate"
              type="number"
              placeholder="Pontos por empate"
              required
              value={formData.pontosEmpate}
              onChange={handleChange}
              min="0"
            />

            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              💡 <strong>Sugestões:</strong>
              <br />
              • Tradicional: 3 vitória, 1 empate, 0 derrota
              <br />
              • Vôlei: 3 vitória, 0 derrota (sem empates)
              <br />
              • Basquete: 2 vitória, 1 derrota (sem empates)
              <br />• Personalize conforme necessário!
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
          >
            Adicionar Campeonato
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
