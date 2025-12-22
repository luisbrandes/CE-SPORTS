"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dumbbell,
  CalendarDays,
  Clock,
  MapPin,
  Search,
  X,
  ArrowLeft,
  Users,
  Trash2,
  Pencil,
  RotateCcw
} from "lucide-react";

interface Treino {
  id: number;
  modalidade: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  local: string;
  professor: string;
  vagasTotais: number;
  vagasDisponiveis: number;
  recorrente: boolean;
  dataInicio?: string;
  dataFim?: string;
  diasDaSemana?: string[];
}

export default function TreinosAdminClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const modalidadeInicial = searchParams.get("modalidade") || "";

  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroModalidade, setFiltroModalidade] = useState(modalidadeInicial);

  const carregarTreinos = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/treinos", {
        credentials: "include"
      });
      if (!res.ok) throw new Error();
      const data: Treino[] = await res.json();
      setTreinos(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTreinos();
  }, []);

  const treinosFiltrados = useMemo(() => {
    return treinos.filter((t) => {
      const matchTexto =
        t.professor.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        t.local.toLowerCase().includes(filtroTexto.toLowerCase());

      const matchModalidade =
        filtroModalidade === "" ||
        t.modalidade.toLowerCase().includes(filtroModalidade.toLowerCase());

      return matchTexto && matchModalidade;
    });
  }, [treinos, filtroTexto, filtroModalidade]);

  const handleRemoverTreino = async (id: number) => {
    if (!confirm("Deseja realmente remover este treino?")) return;

    const res = await fetch(`http://localhost:8080/api/treinos/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (res.ok) {
      setTreinos((prev) => prev.filter((t) => t.id !== id));
      alert("Treino removido com sucesso!");
    } else {
      alert("Erro ao remover treino.");
    }
  };

  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString("pt-BR");

  const formatarHorario = (horario: string) =>
    horario?.substring(0, 5) || "";

  const formatarDiasSemana = (dias?: string[]) => {
    if (!dias || dias.length === 0) return "";
    const map: Record<string, string> = {
      MONDAY: "Seg",
      TUESDAY: "Ter",
      WEDNESDAY: "Qua",
      THURSDAY: "Qui",
      FRIDAY: "Sex",
      SATURDAY: "Sáb",
      SUNDAY: "Dom"
    };
    return dias.map((d) => map[d] || d).join(", ");
  };

  return (
    <main className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin")}
            className="rounded-full bg-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Dumbbell className="text-blue-600" /> Treinos Cadastrados
            </h1>
            {filtroModalidade && (
              <p className="text-sm text-blue-600 font-medium">
                Filtrando por modalidade:
                <span className="bg-blue-100 px-2 py-0.5 rounded ml-1">
                  {filtroModalidade}
                </span>
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={() => router.push("/admin/treino/cadastrotreino")}
          className="bg-[#14539A] hover:bg-[#0e3a6d] text-white font-bold rounded-xl"
        >
          ＋ Novo Treino
        </Button>
      </header>

      <Card className="p-4 bg-white rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Professor ou local..."
              className="pl-9"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>

          <div className="flex gap-2 md:col-span-2">
            <Input
              placeholder="Modalidade..."
              className="max-w-[200px]"
              value={filtroModalidade}
              onChange={(e) => setFiltroModalidade(e.target.value)}
            />

            {(filtroModalidade || filtroTexto) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFiltroModalidade("");
                  setFiltroTexto("");
                }}
              >
                <X className="w-4 h-4 mr-1" /> Limpar
              </Button>
            )}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treinosFiltrados.map((treino) => (
            <Card key={treino.id} className="rounded-2xl overflow-hidden">
              <div className="p-5 space-y-3">
                <span className="text-xs font-bold text-blue-700">
                  {treino.modalidade}
                </span>

                <h3 className="font-bold text-lg">
                  {treino.recorrente ? "Treino Periódico" : "Treino Avulso"}
                </h3>

                <div className="text-sm space-y-1">
                  <div>{formatarData(treino.data)}</div>
                  <div>
                    {formatarHorario(treino.horaInicio)} às{" "}
                    {formatarHorario(treino.horaFim)}
                  </div>
                  <div>{treino.local}</div>
                  <div>{treino.professor}</div>
                  {treino.recorrente && (
                    <div>{formatarDiasSemana(treino.diasDaSemana)}</div>
                  )}
                </div>
              </div>

              <div className="p-4 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/admin/treino/editar/${treino.id}`)
                  }
                >
                  <Pencil className="w-3 h-3 mr-2" /> Editar
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoverTreino(treino.id)}
                >
                  <Trash2 className="w-3 h-3 mr-2" /> Remover
                </Button>
              </div>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}
