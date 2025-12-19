"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Check, X, Star } from "lucide-react";

interface Proposta {
    id: number;
    nome: string;
    descricao: string;
    modalidade: string;
    local: string;
    alunoNome: string;
    mediaAvaliacoes: number;
}


export default function PropostasPage() {
    const [propostas, setPropostas] = useState<Proposta[]>([]);
    const [loading, setLoading] = useState(true);

    const carregarPropostas = async () => {
        const res = await fetch("http://localhost:8080/api/propostas", {
            credentials: "include",
        });

        const data = await res.json();
        setPropostas(data);
        setLoading(false);
    };

    useEffect(() => {
        carregarPropostas();
    }, []);

    const aprovar = async (id: number) => {
        if (!confirm("Deseja aprovar esta proposta?")) return;

        const res = await fetch(`http://localhost:8080/api/propostas/${id}/aprovar`, {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) {
            const msg = await res.text();
            alert(msg);
            return;
        }

        setPropostas((prev) => prev.filter((p) => p.id !== id));
    };



    const rejeitar = async (id: number) => {
        if (!confirm("Deseja rejeitar esta proposta?")) return;

        await fetch(`http://localhost:8080/api/propostas/${id}/rejeitar`, {
            method: "POST",
            credentials: "include",
        });

        setPropostas((prev) => prev.filter((p) => p.id !== id));
    };

    if (loading) {
        return <p className="text-center mt-10">Carregando propostas...</p>;
    }

    return (
        <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-[#14539A] mb-6">
                📄 Propostas de Projetos
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {propostas.map((p) => (
                    <Card
                        key={p.id}
                        className="border border-[#E5E7F0] rounded-2xl bg-white flex flex-col justify-between"
                    >
                        <div className="p-5 space-y-3">
                            <h3 className="text-lg font-semibold text-[#14539A]">
                                {p.nome}
                            </h3>

                            <p className="text-sm text-[#7C8698]">{p.descricao}</p>

                            <div className="text-sm text-[#14539A]">
                                <strong>Modalidade:</strong> {p.modalidade}
                            </div>

                            <div className="text-sm text-[#14539A]">
                                <strong>Local:</strong> {p.local}
                            </div>

                            <div className="text-sm text-[#14539A]">
                                <strong>Proponente:</strong> {p.alunoNome}
                            </div>

                            <div className="flex items-center gap-1 text-sm">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="font-semibold">
                                    Média: {p.mediaAvaliacoes !== undefined
                                        ? p.mediaAvaliacoes.toFixed(1)
                                        : "0.0"}
                                </span>
                            </div>
                        </div>

                        <div className="border-t px-5 py-4 flex gap-2">
                            <Button
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                                onClick={() => aprovar(p.id)}
                            >
                                <Check className="w-4 h-4 mr-1" />
                                Aprovar
                            </Button>

                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={() => rejeitar(p.id)}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Rejeitar
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
