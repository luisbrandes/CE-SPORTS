"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/dist/client/components/navigation"

export default function AprovacoesPage() {
    const [admins, setAdmins] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const carregarPendentes = async () => {
        try {
            setLoading(true)
            const res = await fetch("http://localhost:8080/api/admin/pending-admins", {
                credentials: "include",
            })
            if (!res.ok) throw new Error("Erro ao carregar pendentes")
            const data = await res.json()
            setAdmins(data)
        } catch (err: any) {
            alert("Erro: " + err.message)
        } finally {
            setLoading(false)
        }
    }


    const aprovar = async (id: number) => {
        if (!confirm("Aprovar este administrador?")) return
        try {
            const res = await fetch(`http://localhost:8080/api/admin/approve-admin/${id}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
            if (!res.ok) throw new Error("Erro ao aprovar administrador")
            alert("✅ Administrador aprovado com sucesso!")
            await carregarPendentes()
        } catch (err: any) {
            alert("Erro: " + err.message)
        }
    }

    const rejeitar = async (id: number) => {
        if (!confirm("Rejeitar e excluir este administrador?")) return
        try {
            const res = await fetch(`http://localhost:8080/api/admin/reject-admin/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
            if (!res.ok) throw new Error("Erro ao rejeitar administrador")
            alert("❌ Administrador rejeitado e removido!")
            await carregarPendentes()
        } catch (err: any) {
            alert("Erro: " + err.message)
        }
    }

    const checkSession = async () => {
        const res = await fetch("http://localhost:8080/api/auth/me", {
            credentials: "include"
        })
        if (!res.ok) {
            alert("Você não está logado como administrador aprovado.")
            return router.push("/login")
        }
    }

    useEffect(() => {
        checkSession()
        carregarPendentes()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br  flex justify-center items-start p-8">
            <Card className="w-full max-w-3xl bg-white p-6 shadow-2xl">
                <h1 className="text-2xl font-bold text-blue-900 mb-4 text-center">
                    Aprovação de Administradores
                </h1>

                {loading ? (
                    <p className="text-center text-gray-600">Carregando...</p>
                ) : admins.length === 0 ? (
                    <p className="text-center text-gray-500">Nenhum administrador pendente.</p>
                ) : (
                    <div className="space-y-4">
                        {admins.map((admin) => (
                            <div
                                key={admin.id}
                                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800">{admin.nome}</p>
                                    <p className="text-sm text-gray-600">{admin.email}</p>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => aprovar(admin.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Aprovar
                                    </Button>
                                    <Button
                                        onClick={() => rejeitar(admin.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        Rejeitar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}
