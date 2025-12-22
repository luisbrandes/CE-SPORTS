"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Proposta {
  id: number;
  nome: string;
  descricao: string;
  modalidade: string;
  local: string;
  dataInicio: string;
  dataFim: string;
  status: string;
}

export default function MinhasPropostasPage() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvandoId, setSalvandoId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/propostas/minhas", {
        credentials: "include",
      });
      const data = await res.json();
      setPropostas(Array.isArray(data) ? data : []);
    } catch {
      setPropostas([]);
    } finally {
      setLoading(false);
    }
  }

  function atualizarCampo(id: number, campo: keyof Proposta, valor: string) {
    setPropostas((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [campo]: valor } : p
      )
    );
  }

  async function salvar(p: Proposta) {
    setSalvandoId(p.id);
    try {
      const payload = {
        nome: p.nome,
        descricao: p.descricao,
        modalidade: p.modalidade,
        local: p.local,
        dataInicio: p.dataInicio || null,
        dataFim: p.dataFim || null,
      };

      const res = await fetch(`http://localhost:8080/api/propostas/${p.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

   
      const successToast = document.createElement("div");
      successToast.className = "fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 bg-green-500 text-white flex items-center gap-3 animate-in slide-in-from-right-2 fade-in duration-300";
      successToast.innerHTML = `
        <div class="w-5 h-5">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <span class="font-medium">Proposta atualizada com sucesso!</span>
      `;
      document.body.appendChild(successToast);
      
      setTimeout(() => {
        successToast.remove();
      }, 3000);

      carregar(); 
    } catch {
      alert("Erro ao salvar proposta");
    } finally {
      setSalvandoId(null);
    }
  }

  async function excluir(id: number) {
    if (!confirm("Deseja realmente excluir esta proposta? Esta ação não pode ser desfeita.")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/propostas/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      setPropostas((prev) => prev.filter((p) => p.id !== id));
      
      
      const successToast = document.createElement("div");
      successToast.className = "fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 bg-red-500 text-white flex items-center gap-3 animate-in slide-in-from-right-2 fade-in duration-300";
      successToast.innerHTML = `
        <div class="w-5 h-5">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1zm1 4a1 1 0 100 2h6a1 1 0 100-2H8z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <span class="font-medium">Proposta excluída com sucesso!</span>
      `;
      document.body.appendChild(successToast);
      
      setTimeout(() => {
        successToast.remove();
      }, 3000);
    } catch {
      alert("Erro ao excluir proposta");
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return { bg: "bg-yellow-100", text: "text-yellow-800", };
      case "APROVADA":
        return { bg: "bg-green-100", text: "text-green-800",  };
      case "REJEITADA":
        return { bg: "bg-red-100", text: "text-red-800", };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800",};
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-6 py-12 min-h-screen ">
        <p className="text-center text-gray-500 text-xl mt-20">Carregando propostas...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-8 min-h-screen ">

      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 hover:bg-gray-100 p-2 rounded-xl w-fit"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <h1 className="text-4xl font-extrabold text-blue-700 select-none">
              Minhas Propostas
            </h1>
          </div>
          
        </div>
      </div>

      {propostas.length === 0 ? (
        <Card className="max-w-2xl mx-auto p-12 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="text-6xl mb-6 text-gray-300">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Nenhuma proposta</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Você ainda não propôs nenhum projeto. 
            <br />
            <Button 
              
              onClick={() => router.push("/projetos/propostas/novas")}
              className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold"
            >
              Clique aqui para propor o primeiro!
            </Button>
          </p>
        </Card>
      ) : (
        <section className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propostas.map((p) => {
            const editavel = p.status === "PENDENTE";
            const statusConfig = getStatusConfig(p.status);

            return (
              <Card
                key={p.id}
                className={cn(
                  "p-6 bg-white border shadow-md hover:shadow-lg transition-all rounded-xl relative overflow-hidden group",
                  editavel ? "hover:shadow-xl hover:-translate-y-1 border-blue-200" : "border-gray-200"
                )}
              >
                <div className="absolute top-4 right-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1",
                    statusConfig.bg, statusConfig.text
                  )}>
                    {p.status}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-blue-700 mb-6 pb-6 border-b border-gray-100 select-text truncate group-hover:text-blue-800 transition-colors">
                  {p.nome}
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1 select-none">Modalidade</label>
                    <Input
                      disabled={!editavel}
                      value={p.modalidade}
                      onChange={(e) => atualizarCampo(p.id, "modalidade", e.target.value)}
                      className={cn(
                        "h-11",
                        editavel ? "hover:border-blue-300 focus:border-blue-500" : "bg-gray-50"
                      )}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1 select-none">Local</label>
                    <Input
                      disabled={!editavel}
                      value={p.local}
                      onChange={(e) => atualizarCampo(p.id, "local", e.target.value)}
                      className={cn(
                        "h-11",
                        editavel ? "hover:border-blue-300 focus:border-blue-500" : "bg-gray-50"
                      )}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1 select-none">Descrição</label>
                    <Input
                      disabled={!editavel}
                      value={p.descricao}
                      onChange={(e) => atualizarCampo(p.id, "descricao", e.target.value)}
                      className={cn(
                        "h-20",
                        editavel ? "hover:border-blue-300 focus:border-blue-500" : "bg-gray-50"
                      )}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-2 select-none">Período</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Input
                          type="date"
                          disabled={!editavel}
                          value={p.dataInicio || ""}
                          onChange={(e) => atualizarCampo(p.id, "dataInicio", e.target.value)}
                          className={cn("h-11", editavel ? "hover:border-blue-300" : "bg-gray-50")}
                        />
                      </div>
                      <div>
                        <Input
                          type="date"
                          disabled={!editavel}
                          value={p.dataFim || ""}
                          onChange={(e) => atualizarCampo(p.id, "dataFim", e.target.value)}
                          className={cn("h-11", editavel ? "hover:border-blue-300" : "bg-gray-50")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {editavel ? (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => salvar(p)}
                      disabled={salvandoId === p.id}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 h-12 font-semibold"
                    >
                      {salvandoId === p.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Salvar 
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => excluir(p.id)}
                      className="flex-1 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 shadow-sm h-12 font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                      {p.status === "APROVADA" ? "✅ Proposta aprovada e em andamento!" : "❌ Proposta rejeitada"}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </section>
      )}
    </main>
  );
}