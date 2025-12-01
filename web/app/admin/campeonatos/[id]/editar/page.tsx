"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function EditarCampeonatoPage() {
    const router = useRouter();
    const { id } = useParams();

    const [initialData, setInitialData] = useState<any>(null);

    const [nome, setNome] = useState("");
    const [vitoria, setVitoria] = useState<number>(0);
    const [derrota, setDerrota] = useState<number>(0);
    const [empate, setEmpate] = useState<number>(0);

    const [numEquipes, setNumEquipes] = useState(0);
    const [equipesArr, setEquipesArr] = useState<string[]>([]);

    useEffect(() => {
        async function fetchDados() {
            try {
                const res = await fetch(`http://localhost:8080/api/campeonato/${id}`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error(`Erro ${res.status}: não foi possível carregar o campeonato`);
                }

                const data = await res.json();
                setInitialData(data);

                setNome(data.nome);
                setVitoria(Number(data.vitoria));
                setDerrota(Number(data.derrota));
                setEmpate(Number(data.empate));

                const equipesNomes = data.equipes.map((e: any) => e.nome);
                setEquipesArr(equipesNomes);
                setNumEquipes(equipesNomes.length);

            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                alert("Erro ao carregar dados do campeonato. Verifique o console.");
            }
        }

        fetchDados();
    }, [id]);

    async function salvarAlteracoes(e: React.FormEvent) {
        e.preventDefault();

        if (!initialData) return;

        const payload: any = {};

        if (nome !== initialData.nome) payload.nome = nome;
        if (vitoria !== initialData.vitoria) payload.vitoria = vitoria;
        if (derrota !== initialData.derrota) payload.derrota = derrota;
        if (empate !== initialData.empate) payload.empate = empate;

        const equipesValidas = equipesArr.filter((e) => e.trim() !== "");
        const equipesIniciais = initialData.equipes.map((x: any) => x.nome);

        if (JSON.stringify(equipesValidas) !== JSON.stringify(equipesIniciais)) {
            payload.equipes = equipesValidas;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/campeonato/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            });

            if (!res.ok) {
                const errorMsg = await res.text();
                alert("Erro ao salvar: " + errorMsg);
                return;
            }

            alert("Campeonato atualizado com sucesso!");

            setTimeout(() => {
                router.push("/admin/campeonatos");
                router.refresh();
            }, 150);

        } catch (err) {
            console.error(err);
            alert("Erro inesperado ao salvar. Verifique o console.");
        }
    }


    function resetarCampos() {
        if (!initialData) return;

        setNome(initialData.nome);
        setVitoria(initialData.vitoria);
        setDerrota(initialData.derrota);
        setEmpate(initialData.empate);

        const equipesNomes = initialData.equipes.map((e: any) => e.nome);
        setEquipesArr(equipesNomes);
        setNumEquipes(equipesNomes.length);
    }



    if (!initialData) {
        return <p className="text-center mt-10 text-gray-600">Carregando dados...</p>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <Card className="w-full max-w-lg p-8 flex flex-col gap-6">

                <h1 className="text-3xl font-bold text-black text-center">
                    Editar Campeonato
                </h1>
                <p className="text-muted-foreground text-center text-sm -mt-4">
                    Atualize somente o que desejar. Os demais campos permanecerão iguais.
                </p>

                <form onSubmit={salvarAlteracoes} className="w-full flex flex-col gap-4">

                    {/* Nome */}
                    <Input
                        placeholder="Nome do campeonato"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    {/* Número de equipes */}
                    <Input
                        type="number"
                        value={numEquipes}
                        min={1}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            setNumEquipes(val);

                            if (val > equipesArr.length) {
                                setEquipesArr([...equipesArr, ...Array(val - equipesArr.length).fill("")]);
                            } else {
                                setEquipesArr(equipesArr.slice(0, val));
                            }
                        }}
                        placeholder="Quantidade de equipes"
                    />

                    {/* Inputs das equipes */}
                    {Array.from({ length: numEquipes }).map((_, i) => (
                        <Input
                            key={i}
                            value={equipesArr[i]}
                            onChange={(e) => {
                                const newArr = [...equipesArr];
                                newArr[i] = e.target.value;
                                setEquipesArr(newArr);
                            }}
                            placeholder={`Equipe ${i + 1}`}
                        />
                    ))}

                    {/* Sistema de Pontuação */}
                    <div className="space-y-3 border-t pt-4">
                        <h3 className="font-medium text-black">Sistema de Pontuação</h3>

                        <Input
                            type="number"
                            value={vitoria}
                            onChange={(e) => setVitoria(Number(e.target.value))}
                            placeholder="Pontos por vitória"
                        />

                        <Input
                            type="number"
                            value={derrota}
                            onChange={(e) => setDerrota(Number(e.target.value))}
                            placeholder="Pontos por derrota"
                        />

                        <Input
                            type="number"
                            value={empate}
                            onChange={(e) => setEmpate(Number(e.target.value))}
                            placeholder="Pontos por empate"
                        />
                    </div>

                    <div className="flex gap-4 mt-4">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" type="submit">
                            Salvar Alterações
                        </Button>

                        <Button className="flex-1" variant="outline" type="button" onClick={resetarCampos}>
                            Resetar
                        </Button>
                    </div>
                </form>

                <Link
                    href="/admin/campeonatos"
                    className="text-blue-600 hover:underline font-medium text-center"
                >
                    ← Voltar para Campeonatos
                </Link>
            </Card>
        </div>
    );
}
