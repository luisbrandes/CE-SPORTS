"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Projeto {
    id: number;
    nome: string;
    descricao: string;
    modalidade: string;
    local: string;
    dataInicio: string;
    dataFim: string;
    responsavel: string;
    vagasTotais: number;
    vagasPreenchidas: number;
}

export default function ProjetosPage() {
    const [projetos, setProjetos] = useState<Projeto[]>([]);
    const [inscritos, setInscritos] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [filtroNome, setFiltroNome] = useState("");
    const [filtroModalidade, setFiltroModalidade] = useState("");
    const [filtroLocal, setFiltroLocal] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("http://localhost:8080/api/projetos", {
                    credentials: "include",
                });

                const data = await res.json();

                // Normaliza resposta: aceita array direto ou vários formatos comuns
                let projetosData: any[] = [];
                if (Array.isArray(data)) {
                    projetosData = data;
                } else if (data && typeof data === "object") {
                    if (Array.isArray((data as any).content)) projetosData = (data as any).content;
                    else if (Array.isArray((data as any).data)) projetosData = (data as any).data;
                    else if (Array.isArray((data as any).projetos)) projetosData = (data as any).projetos;
                    else projetosData = [];
                }

                if (!Array.isArray(projetosData)) projetosData = [];
                setProjetos(projetosData);

                const inscrRes = await fetch("http://localhost:8080/api/projetos/inscritos", {
                    credentials: "include",
                });

                const inscrData = await inscrRes.json();
                setInscritos(Array.isArray(inscrData) ? inscrData : []);
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const projetosFiltrados = useMemo(() => {
        const lista = Array.isArray(projetos) ? projetos : [];
        return lista.filter((p) => {
            const matchNome = (p.nome || "").toLowerCase().includes(filtroNome.toLowerCase());
            const matchModalidade = (p.modalidade || "").toLowerCase().includes(filtroModalidade.toLowerCase());
            const matchLocal = (p.local || "").toLowerCase().includes(filtroLocal.toLowerCase());

            return matchNome && matchModalidade && matchLocal;
        });
    }, [filtroNome, filtroModalidade, filtroLocal, projetos]);

    const limparFiltros = () => {
        setFiltroNome("");
        setFiltroModalidade("");
        setFiltroLocal("");
    };

    async function inscrever(id: number) {
        try {
            const res = await fetch(`http://localhost:8080/api/projetos/${id}/inscrever`, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Erro ao se inscrever");

            setInscritos((prev) => [...prev, id]);
            setProjetos((prev) =>
                prev.map((p) => (p.id === id ? { ...p, vagasPreenchidas: p.vagasPreenchidas + 1 } : p))
            );
        } catch (err) {
            alert("Erro ao inscrever");
        }
    }

    async function cancelar(id: number) {
        try {
            const res = await fetch(`http://localhost:8080/api/projetos/${id}/cancelar`, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Erro ao cancelar");

            setInscritos((prev) => prev.filter((x) => x !== id));
            setProjetos((prev) =>
                prev.map((p) => (p.id === id ? { ...p, vagasPreenchidas: p.vagasPreenchidas - 1 } : p))
            );
        } catch (err) {
            alert("Erro ao cancelar inscrição");
        }
    }

    if (loading)
        return <p className="text-center text-gray-500 mt-10">Carregando projetos...</p>;

    return (
        <main className="container mx-auto px-4 py-8">
            
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">Projetos</h1>

                <Button
                    onClick={() => router.push("/projetos/meus-projetos")}
                    className="bg-blue-600 text-white shadow-md hover:shadow-lg transition"
                >
                    Minhas Inscrições
                </Button>
            </div>

            {/* Filtros */}
            <Card className="p-6 mb-8 space-y-4 bg-gray-50 border border-gray-200 shadow-sm">
                <h2 className="font-semibold text-lg">Filtros</h2>

                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium">Nome</label>
                        <Input value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} placeholder="Pesquisar..." />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Modalidade</label>
                        <Input value={filtroModalidade} onChange={(e) => setFiltroModalidade(e.target.value)} placeholder="Ex: Futsal" />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Local</label>
                        <Input value={filtroLocal} onChange={(e) => setFiltroLocal(e.target.value)} placeholder="Ex: Quadra A" />
                    </div>
                </div>

                <div className="flex justify-between pt-1">
                    <p className="text-sm text-gray-600">
                        Mostrando {projetosFiltrados.length} de {projetos.length} projetos
                    </p>

                    <Button variant="outline" onClick={limparFiltros}>
                        Limpar filtros
                    </Button>
                </div>
            </Card>

            {/* Cards */}
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projetosFiltrados.map((p) => {
                    const vagasRestantes = p.vagasTotais - p.vagasPreenchidas;
                    const estaInscrito = inscritos.includes(p.id);

                    return (
                        <Card
                            key={p.id}
                            className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-200 relative"
                        >
                            {/* BADGE INSCRITO */}
                            {estaInscrito && (
                                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    INSCRITO
                                </span>
                            )}

                            <h2 className="text-xl font-bold text-blue-700">{p.nome}</h2>

                            <p><strong>Modalidade:</strong> {p.modalidade}</p>
                            <p><strong>Local:</strong> {p.local}</p>
                            <p><strong>Responsável:</strong> {p.responsavel}</p>

                            <p className="mt-3 text-sm text-gray-600">{p.descricao}</p>

                            <p className="mt-3 text-sm font-semibold">
                                Vagas: {p.vagasPreenchidas}/{p.vagasTotais}
                            </p>

                            <div className="mt-4">
                                {!estaInscrito ? (
                                    <Button
                                        disabled={vagasRestantes <= 0}
                                        onClick={() => inscrever(p.id)}
                                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        {vagasRestantes > 0 ? "Inscrever-se" : "Sem vagas"}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => cancelar(p.id)}
                                        className="w-full border-red-500 text-red-500 hover:bg-red-50"
                                    >
                                        Cancelar inscrição
                                    </Button>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </section>
        </main>
    );
}
