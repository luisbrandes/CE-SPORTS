"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EnviarNotificacaoPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: null, message: "" });

    try {
      const res = await fetch(
        "http://localhost:8080/api/admin/notification/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ titulo, mensagem }),
        }
      );

      if (!res.ok) throw new Error("Erro ao enviar notificação");

      setFeedback({
        type: "success",
        message: "Notificação enviada com sucesso!",
      });

      setTitulo("");
      setMensagem("");
    } catch {
      setFeedback({
        type: "error",
        message: "Não foi possível enviar a notificação.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 bg-[#F6F7FB]">
      {/* HEADER */}
      <header className="mb-6 lg:mb-8">
        <Card className="bg-white border border-[#E5E7F0] rounded-2xl shadow-sm px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#14539A]">
                Enviar Notificações
              </h1>
              <p className="text-xs sm:text-sm text-[#7C8698]">
                Envie avisos e comunicados para os usuários da plataforma por email.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin")}
              className="w-full sm:w-auto border-[#D2D7E5] text-[#14539A] hover:bg-[#F2F4FB] rounded-full h-9 sm:h-10 px-4 text-xs sm:text-sm font-medium"
            >
              ← Voltar ao Dashboard
            </Button>
          </div>
        </Card>
      </header>

      {/* FORMULÁRIO */}
      <div className="flex justify-center">
        <Card className="w-full max-w-xl bg-white border border-[#E5E7F0] rounded-2xl shadow-sm px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-7">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm font-medium text-[#14539A]">
                Título
              </label>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Aviso importante"
                required
                className="h-10 sm:h-11 text-sm border-[#E0E3EB] rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm font-medium text-[#14539A]">
                Mensagem
              </label>
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Digite a mensagem"
                required
                rows={4}
                className="w-full rounded-xl border border-[#E0E3EB] bg-white p-2.5 sm:p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#14539A]/10"
              />
            </div>

            {feedback.type && (
              <div
                className={`text-xs sm:text-sm p-2.5 rounded-xl font-medium ${
                  feedback.type === "success"
                    ? "bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]"
                    : "bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 bg-[#FFC94B] hover:bg-[#ffbf24] text-[#1B3C6D] font-semibold rounded-full h-10 sm:h-11 text-sm disabled:opacity-70"
              >
                {loading ? "Enviando..." : "Enviar Notificação"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setTitulo("");
                  setMensagem("");
                  setFeedback({ type: null, message: "" });
                }}
                className="w-full sm:flex-1 border-[#D2D7E5] text-[#14539A] hover:bg-[#F2F4FB] rounded-full h-10 sm:h-11 text-sm font-semibold"
              >
                Limpar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
