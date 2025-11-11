export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include", 
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  if (res.status === 401) {
    throw new Error("Sessão expirada. Faça login novamente.")
  }

  let data: any = null
  try {
    data = await res.json()
  } catch {
   
  }

  if (!res.ok) {
    throw new Error(data?.error || `Erro na requisição (${res.status})`)
  }

  return data
}
