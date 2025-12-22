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

export default function TreinosAdminPage() {
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
      if (!res.ok) throw new Error("Falha ao buscar treinos");
      const data: Treino[] = await res.json();
      setTreinos(data);
    } catch (err) {
      console.error("Erro ao buscar treinos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTreinos();
  }, []);


  const treinosFiltrados = useMemo(() => {
    return treinos.filter((t) => {
      const matchTexto = t.professor.toLowerCase().includes(filtroTexto.toLowerCase()) || 
                         t.local.toLowerCase().includes(filtroTexto.toLowerCase());
      const matchModalidade = filtroModalidade === "" || 
                              t.modalidade.toLowerCase().includes(filtroModalidade.toLowerCase());
      return matchTexto && matchModalidade;
    });
  }, [treinos, filtroTexto, filtroModalidade]);

  const handleRemoverTreino = async (id: number) => {
    if (!confirm("Deseja realmente remover este treino?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/treinos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao remover treino");
      setTreinos(treinos.filter((treino) => treino.id !== id));
      alert("Treino removido com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao remover treino.");
    }
  };

  const formatarData = (data: string) => new Date(data).toLocaleDateString("pt-BR");
  const formatarHorario = (horario: string) => horario?.substring(0, 5) || "";

  const formatarDiasSemana = (dias: string[] | undefined) => {
    if (!dias || dias.length === 0) return "";
    const diasMap: Record<string, string> = {
      "MONDAY": "Seg", "TUESDAY": "Ter", "WEDNESDAY": "Qua",
      "THURSDAY": "Qui", "FRIDAY": "Sex", "SATURDAY": "Sáb", "SUNDAY": "Dom"
    };
    return dias.map(dia => diasMap[dia] || dia).join(", ");
  };

  return (
    <main className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin")} className="rounded-full bg-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Dumbbell className="text-blue-600" /> Treinos Cadastrados
            </h1>
            {filtroModalidade && (
              <p className="text-sm text-blue-600 font-medium">
                Filtrando por modalidade: <span className="bg-blue-100 px-2 py-0.5 rounded">{filtroModalidade}</span>
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

    
      <Card className="p-4 border-slate-200 shadow-sm bg-white rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative col-span-1 md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Professor ou local..." 
              className="pl-9 rounded-lg border-slate-200" 
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center col-span-1 md:col-span-2">
            <Input 
              placeholder="Modalidade..." 
              className="rounded-lg border-slate-200 max-w-[200px]" 
              value={filtroModalidade}
              onChange={(e) => setFiltroModalidade(e.target.value)}
            />
            {(filtroModalidade || filtroTexto) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setFiltroModalidade(""); setFiltroTexto(""); }}
                className="text-slate-500 hover:text-red-500"
              >
                <X className="w-4 h-4 mr-1" /> Limpar
              </Button>
            )}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="text-slate-400 font-medium italic">Buscando cronograma...</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treinosFiltrados.length > 0 ? (
            treinosFiltrados.map((treino) => (
              <Card key={treino.id} className="flex flex-col border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all group">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase border border-blue-100">
                      {treino.modalidade}
                    </span>
                    <div className="flex flex-col gap-1 items-end">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        treino.vagasDisponiveis > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {treino.vagasDisponiveis} / {treino.vagasTotais} vagas
                      </span>
                      {treino.recorrente && (
                        <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" /> Recorrente
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">
                    {treino.recorrente ? "Treino Periódico" : "Treino Avulso"}
                  </h3>
                  
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-4 h-4 text-slate-400" />
                      {treino.recorrente ? (
                        <span>{formatarData(treino.dataInicio!)} - {formatarData(treino.dataFim!)}</span>
                      ) : (
                        <span>{formatarData(treino.data)}</span>
                      )}
                    </div>

                    {treino.recorrente && (
                      <div className="text-xs text-blue-600 font-medium pl-7">
                        Dias: {formatarDiasSemana(treino.diasDaSemana)}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{formatarHorario(treino.horaInicio)} às {formatarHorario(treino.horaFim)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{treino.local}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-700">{treino.professor}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-slate-200 text-xs font-bold"
                    onClick={() => router.push(`/admin/treino/editar/${treino.id}`)}
                  >
                    <Pencil className="w-3 h-3 mr-2 text-slate-400" /> Editar
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-xs font-bold"
                    onClick={() => handleRemoverTreino(treino.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-2" /> Remover
                  </Button>
                  
                  <Button variant="secondary" size="sm" className="col-span-2 text-xs font-bold bg-white border border-slate-200 text-slate-600">
                    Ver Inscritos
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">Nenhum treino encontrado para estes filtros.</p>
              <Button 
                variant="ghost" 
                onClick={() => { setFiltroModalidade(""); setFiltroTexto(""); }}
                className="text-blue-600 mt-2"
              >
                Limpar todos os filtros
              </Button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}