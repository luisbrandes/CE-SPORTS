"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NoticiaClientPage() {
  const { id } = useParams() as { id?: string }
  const [noticia, setNoticia] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    setLoading(true)

    fetch("http://localhost:8080/api/noticias", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        // Filtra a notícia com o id correspondente
        const noticiaEncontrada = data.find((item: any) => item.id === parseInt(id))
        setNoticia(noticiaEncontrada)
      })
      .catch((err) => console.error("Erro ao buscar notícia:", err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Carregando...</p>
  if (!noticia) return <p>Notícia não encontrada.</p>

  return (
    <main className="min-h-screen bg-gradient-to-br text-white p-8">
      <Link href="/admin/noticia">
        <Button variant="outline" className="mb-6 text-white border-white hover:bg-white/10">
          ← Voltar
        </Button>
      </Link>

      <article className="max-w-3xl mx-auto bg-white text-blue-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{noticia.titulo}</h1>
        <p className="text-sm text-gray-500 mb-6">
          Por {noticia.autorNome} — {new Date(noticia.criadaEm).toLocaleDateString()} — {noticia.esporte}
        </p>
        <p>{noticia.conteudo}</p>
      </article>
    </main>
  )
}