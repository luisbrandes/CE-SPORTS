"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function CadastrarNoticiaPage() {
  const router = useRouter()

  const [titulo, setTitulo] = useState("")
  const [autor, setAutor] = useState("")
  const [dataPublicacao, setDataPublicacao] = useState("")
  const [descricao, setDescricao] = useState("")
  const [conteudo, setConteudo] = useState("")
  const [imagem, setImagem] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("titulo", titulo)
    formData.append("autor", autor)
    formData.append("dataPublicacao", dataPublicacao)
    formData.append("descricao", descricao)
    formData.append("conteudo", conteudo)
    if (imagem) formData.append("imagem", imagem)

    console.log("Notícia enviada:", {
      titulo,
      autor,
      dataPublicacao,
      descricao,
      conteudo,
      imagem,
    })

    alert("Notícia cadastrada com sucesso!")
    router.push("/noticias")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl bg-white text-blue-900 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-center">
          Publicar Nova Notícia
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Preencha as informações abaixo para adicionar uma nova notícia esportiva ao sistema.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          encType="multipart/form-data"
        >
        
          <div>
            <label htmlFor="titulo" className="block font-medium mb-1">
              Título da Notícia
            </label>
            <Input
              id="titulo"
              type="text"
              placeholder="Ex: CEFET vence torneio intercampi!"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

        
          <div>
            <label htmlFor="autor" className="block font-medium mb-1">
              Autor
            </label>
            <Input
              id="autor"
              type="text"
              placeholder="Ex: Mariana Oliveira"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="dataPublicacao" className="block font-medium mb-1">
              Data de Publicação
            </label>
            <Input
              id="dataPublicacao"
              type="date"
              value={dataPublicacao}
              onChange={(e) => setDataPublicacao(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="imagem" className="block font-medium mb-1">
              Imagem da Notícia
            </label>
            <Input
              id="imagem"
              type="file"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files?.[0] || null)}
            />
            <small className="text-gray-500 text-sm">
              Formatos aceitos: .jpg, .png, .jpeg
            </small>
          </div>

          <div>
            <label htmlFor="descricao" className="block font-medium mb-1">
              Resumo
            </label>
            <textarea
              id="descricao"
              rows={3}
              placeholder="Breve resumo do conteúdo da notícia..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="conteudo" className="block font-medium mb-1">
              Conteúdo Completo
            </label>
            <textarea
              id="conteudo"
              rows={7}
              placeholder="Digite aqui o texto completo da notícia..."
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between mt-4">
            <Button
              type="button"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-100"
              onClick={() => router.push("/noticias")}
            >
              ← Voltar
            </Button>

            <Button
              type="submit"
              className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 font-semibold"
            >
              Publicar Notícia
            </Button>
          </div>
        </form>
      </Card>
    </main>
  )
}
