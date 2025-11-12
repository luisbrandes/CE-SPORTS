"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Noticia {
  id: number
  titulo: string
  autorNome: string
  criadaEm: string
  conteudo: string
}

export default function NoticiasPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const redirectToLogin = (type: "aluno" | "admin") => {
    router.push(`/login?type=${type}`)
    closeModal()
  }

  useEffect(() => {
    let cancelado = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
  const res = await fetch("http://localhost:8080/api/noticias", { credentials: "include" })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: Noticia[] = await res.json()
        if (!cancelado) setNoticias(data)
      } catch (e: any) {
        if (!cancelado) setError(e?.message ?? "Erro ao carregar notícias")
      } finally {
        if (!cancelado) setLoading(false)
      }
    }
    load()
    return () => { cancelado = true }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-500 text-white">
      <section className="container mx-auto py-12 px-6">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="mb-6 text-white border-white hover:bg-white/10"
        >
          ← Voltar à Home
        </Button>

        <h1 className="text-4xl font-bold mb-10 text-center text-yellow-300">
          Últimas Notícias
        </h1>

        {/* Lista de notícias */}
        {loading && <p className="text-center">Carregando...</p>}
        {error && <p className="text-center text-red-200">Erro: {error}</p>}

        {!loading && !error && noticias.length === 0 && (
          <p className="text-center opacity-80">Nenhuma notícia cadastrada ainda.</p>
        )}

        {!loading && !error && noticias.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
            {noticias.map((n) => (
              <Card
                key={n.id}
                className="bg-white/95 text-blue-900 p-6 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold line-clamp-2">{n.titulo}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Por {n.autorNome} — {new Date(n.criadaEm).toLocaleDateString("pt-BR")}
                </p>

                <div className="mt-4">
                  <Link href={`/noticia/${n.id}`}>
                    <Button className="bg-yellow-400 text-blue-900 hover:bg-yellow-500">
                      Ler mais
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Botão central “Cadastrar Notícia” */}
      <div className="flex justify-center pb-12">
        <Button
          className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 px-8 py-6 text-lg font-semibold"
          onClick={() => router.push("/noticia/cadastrarNoticia")}
        >
          Cadastrar Notícia
        </Button>
      </div>
    </main>
  )
}
