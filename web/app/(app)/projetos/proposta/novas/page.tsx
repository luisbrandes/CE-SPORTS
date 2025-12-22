"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProporProjetoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    modalidade: "",
    local: "",
    dataInicio: "",
    dataFim: "",
    vagasTotais: 0,
  });

  const formularioValido = useMemo(() => {
    return (
      form.nome.trim() !== "" &&
      form.descricao.trim() !== "" &&
      form.modalidade.trim() !== "" &&
      form.local.trim() !== "" &&
      form.dataInicio.trim() !== "" &&
      form.dataFim.trim() !== "" &&
      form.vagasTotais > 0
    );
  }, [form]);

  async function enviar() {
    if (!formularioValido) {
      setErro("Preencha todos os campos e informe a quantidade de vagas.");
      return;
    }

    try {
      setErro("");
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/propostas", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      router.push("/projetos");
    } catch {
      setErro("Erro ao enviar proposta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container mx-auto px-6 py-8 min-h-screen">
   
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
          Propor Novo Projeto
        </h1>
        <p className="text-xl text-gray-600">
          Preencha o formulário abaixo para sugerir um NNNNNovo projeto esportivo
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="p-8 bg-white border border-gray-200 shadow-xl rounded-2xl space-y-6">
         
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-fit hover:bg-gray-100 p-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar aos projetos
          </Button>

          <div className="space-y-6">
   
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Nome do Projeto *
              </label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="h-12"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Modalidade *
              </label>
              <Input
                value={form.modalidade}
                onChange={(e) =>
                  setForm({ ...form, modalidade: e.target.value })
                }
                className="h-12"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Local *
              </label>
              <Input
                value={form.local}
                onChange={(e) => setForm({ ...form, local: e.target.value })}
                className="h-12"
              />
            </div>

    
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Quantidade de Vagas *
              </label>
              <Input
                type="number"
                min={1}
                value={form.vagasTotais}
                onChange={(e) =>
                  setForm({
                    ...form,
                    vagasTotais: Number(e.target.value),
                  })
                }
                className="h-12"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Descrição *
              </label>
              <Input
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
                className="h-24"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-4 block">
                Período *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={form.dataInicio}
                  onChange={(e) =>
                    setForm({ ...form, dataInicio: e.target.value })
                  }
                  className="h-12"
                />
                <Input
                  type="date"
                  value={form.dataFim}
                  onChange={(e) =>
                    setForm({ ...form, dataFim: e.target.value })
                  }
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {erro && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{erro}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                formularioValido
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              {formularioValido ? "✓ Completo" : "⚠ Incompleto"}
            </span>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              onClick={enviar}
              disabled={loading || !formularioValido}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Enviando..." : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Proposta
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
