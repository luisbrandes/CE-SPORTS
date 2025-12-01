"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Campeonato {
  id: number;
  nome: string;
  equipes: { id: number; nome: string }[];
}

export default function RegistrarPartidaPage() {
  const [formData, setFormData] = useState({
    campeonato: "",
    equipe1: "",
    equipe2: "",
    pontuacao1: "",
    pontuacao2: "",
    data: "",
  });

  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [loading, setLoading] = useState(false);
  const [equipesDisponiveis, setEquipesDisponiveis] = useState<
    { id: number; nome: string }[]
  >([]);
  const router = useRouter();

  const equipe1Ref = useRef<HTMLInputElement>(null);
  const equipe2Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchCampeonatos() {
      try {
        const res = await fetch("http://localhost:8080/api/campeonato", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setCampeonatos(data);
        }
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      }
    }
    fetchCampeonatos();
  }, []);

  useEffect(() => {
    if (formData.campeonato) {
      const campeonatoSelecionado = campeonatos.find(
        (c) => c.nome === formData.campeonato
      );
      if (campeonatoSelecionado) {
        setEquipesDisponiveis(campeonatoSelecionado.equipes);
        // Resetar seleção de equipes quando mudar o campeonato
        setFormData((prev) => ({ ...prev, equipe1: "", equipe2: "" }));
      }
    } else {
      setEquipesDisponiveis([]);
    }
  }, [formData.campeonato, campeonatos]);

  const showFieldError = (
    ref: React.RefObject<HTMLInputElement | null>,
    message: string
  ) => {
    if (ref.current) {
      ref.current.setCustomValidity(message);
      ref.current.reportValidity();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.setCustomValidity("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpar erros de validação
    if (name === "equipe1" || name === "equipe2") {
      if (equipe1Ref.current) equipe1Ref.current.setCustomValidity("");
      if (equipe2Ref.current) equipe2Ref.current.setCustomValidity("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.equipe1 === formData.equipe2 && formData.equipe1 !== "") {
      alert("Uma equipe não pode jogar contra ela mesma!");
      return;
    }

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

    try {
      const response = await fetch("http://localhost:8080/api/partida", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();

        if (errorText.includes("Uma equipe não pode jogar contra ela mesma")) {
          alert("Uma equipe não pode jogar contra ela mesma!");
        } else if (errorText.includes("não existem")) {
          alert("Uma ou ambas as equipes não existem!");
        } else if (errorText.includes("parte do campeonato")) {
          alert("As equipes precisam fazer parte do campeonato selecionado!");
        } else {
          alert(`Erro: ${errorText}`);
        }

        return;
      }

      alert("Partida registrada com sucesso");
      router.push("/admin/campeonatos/historico-partidas");
    } catch (err) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-md p-8 flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">Registrar Partida</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Selecione o campeonato e as equipes participantes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campeonato *
            </label>
            <Select
              value={formData.campeonato}
              onValueChange={(value) => handleSelectChange("campeonato", value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um campeonato" />
              </SelectTrigger>
              <SelectContent className="select-content bg-white border border-gray-300 shadow-lg">
                {campeonatos.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Nenhum campeonato disponível
                  </SelectItem>
                ) : (
                  campeonatos.map((camp) => (
                    <SelectItem key={camp.id} value={camp.nome}>
                      {camp.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Selects de Equipes (apenas aparecem quando um campeonato é selecionado) */}
          {formData.campeonato && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipe 1 *
                </label>
                <Select
                  value={formData.equipe1}
                  onValueChange={(value) =>
                    handleSelectChange("equipe1", value)
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a equipe 1" />
                  </SelectTrigger>
                  <SelectContent className="select-content bg-white border border-gray-300 shadow-lg">
                    {equipesDisponiveis.map((equipe) => (
                      <SelectItem
                        key={equipe.id}
                        value={equipe.nome}
                        disabled={equipe.nome === formData.equipe2}
                      >
                        {equipe.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipe 2 *
                </label>
                <Select
                  value={formData.equipe2}
                  onValueChange={(value) =>
                    handleSelectChange("equipe2", value)
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a equipe 2" />
                  </SelectTrigger>
                  <SelectContent className="select-content bg-white border border-gray-300 shadow-lg">
                    {equipesDisponiveis.map((equipe) => (
                      <SelectItem
                        key={equipe.id}
                        value={equipe.nome}
                        disabled={equipe.nome === formData.equipe1}
                      >
                        {equipe.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pontuação Equipe 1 *
              </label>
              <Input
                name="pontuacao1"
                type="number"
                placeholder="Pontos"
                required
                value={formData.pontuacao1}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pontuação Equipe 2 *
              </label>
              <Input
                name="pontuacao2"
                type="number"
                placeholder="Pontos"
                required
                value={formData.pontuacao2}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data da Partida *
            </label>
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
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-full mt-2"
            disabled={!formData.campeonato}
          >
            Registrar Partida
          </Button>
        </form>

        <Link
          href="/admin/campeonatos/historico-partidas"
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          ← Voltar para histórico
        </Link>
      </Card>
    </div>
  );
}
