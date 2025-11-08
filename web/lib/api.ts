export const API_URL = "http://localhost:8080/api"

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  if (res.status === 401) {
    throw new Error("Não autenticado")
  }

  let data
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    throw new Error(data?.error || "Erro na requisição")
  }

  return data
}
