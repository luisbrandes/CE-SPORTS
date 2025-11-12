// app/api/noticias.ts
export async function getNoticias() {
  const response = await fetch("http://localhost:8080/api/noticias")
  if (!response.ok) throw new Error("Erro ao buscar notícias")
  return response.json()
}

export async function getNoticiaById(id: string) {
  const response = await fetch("http://localhost:8080/api/noticias/${id}")
  if (!response.ok) throw new Error("Erro ao buscar notícia")
  return response.json()
}