"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function NovoTreinoAdminPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    modalidade: "",
    data: "",
    horaInicio: "",
    horaFim: "",
    local: "",
    professor: "",
    vagasTotais: "",
  })

  const [recorrente, setRecorrente] = useState(false)
  const [diasSemana, setDiasSemana] = useState<string[]>(["SEG", "QUA", "SEX"])
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")

  const [loading, setLoading] = useState(false)

  const diasOpcoes = [
    { id: "SEG", label: "Segunda" },
    { id: "TER", label: "Terça" },
    { id: "QUA", label: "Quarta" },
    { id: "QUI", label: "Quinta" },
    { id: "SEX", label: "Sexta" },
    { id: "SAB", label: "Sábado" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleDiaSemana = (dia: string) => {
    setDiasSemana(prev =>
      prev.includes(dia)
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const vagas = parseInt(form.vagasTotais)
      if (isNaN(vagas) || vagas <= 0) {
        alert("Número de vagas deve ser maior que zero")
        setLoading(false)
        return
      }

      if (recorrente) {
        if (!dataInicio || !dataFim) {
          alert("Para treino recorrente, informe data início e fim")
          setLoading(false)
          return
        }

        if (diasSemana.length === 0) {
          alert("Selecione pelo menos um dia da semana")
          setLoading(false)
          return
        }

        await enviarTreinoRecorrente(vagas)
      } else {
        await enviarTreinoUnico(vagas)
      }

      alert("✅ Treino(s) cadastrado(s) com sucesso!")
      router.push("/admin/treino")
    } catch (err: any) {
      console.error(err)
      alert("❌ " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const enviarTreinoUnico = async (vagas: number) => {
    const res = await fetch("http://localhost:8080/api/treinos", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        vagasTotais: vagas,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(error)
    }
  }

  const enviarTreinoRecorrente = async (vagas: number) => {

    const diasMapper: Record<string, string> = {
      SEG: "MONDAY",
      TER: "TUESDAY",
      QUA: "WEDNESDAY",
      QUI: "THURSDAY",
      SEX: "FRIDAY",
      SAB: "SATURDAY",
    }

    const treinoRecorrente = {
      modalidade: form.modalidade,
      local: form.local,
      professor: form.professor,
      horaInicio: form.horaInicio,
      horaFim: form.horaFim,
      vagasTotais: vagas,

      dataInicio,
      dataFim,

      diasDaSemana: diasSemana.map((d) => diasMapper[d]), // << AQUI É A MAGIA!
    }

    const res = await fetch("http://localhost:8080/api/treinos/recorrentes", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(treinoRecorrente),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(error)
    }
  }


  return (
    <section className="p-6">
      <div className="mb-6">
        <Link href="/admin/treino" className="text-sm text-primary hover:underline">
          ← Voltar para Treinos
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-2">🏋️‍♂️ Cadastrar Novo Treino</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Preencha as informações abaixo para adicionar um novo treino ao sistema.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Modalidade *</label>
            <Input
              name="modalidade"
              value={form.modalidade}
              onChange={handleChange}
              placeholder="Ex: Futebol, Vôlei, Basquete"
              required
            />
          </div>

          <div className="flex items-center space-x-2 pt-2 pb-4">
            <input
              type="checkbox"
              id="recorrente"
              checked={recorrente}
              onChange={(e) => setRecorrente(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="recorrente" className="text-sm font-medium">
              Este é um treino recorrente (semanal)
            </label>
          </div>

          {recorrente ? (
            <>
              <div className="space-y-4 border rounded p-4 bg-muted/10">
                <h3 className="font-semibold">📅 Configuração Recorrente</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Data Início *</label>
                    <Input
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Data Fim *</label>
                    <Input
                      type="date"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dias da Semana *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {diasOpcoes.map((dia) => (
                      <div key={dia.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`dia-${dia.id}`}
                          checked={diasSemana.includes(dia.id)}
                          onChange={() => toggleDiaSemana(dia.id)}
                          className="h-4 w-4"
                        />
                        <label htmlFor={`dia-${dia.id}`} className="text-sm">
                          {dia.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Hora Início *</label>
                    <Input
                      type="time"
                      name="horaInicio"
                      value={form.horaInicio}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hora Fim *</label>
                    <Input
                      type="time"
                      name="horaFim"
                      value={form.horaFim}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Data *</label>
                <Input
                  type="date"
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hora Início *</label>
                  <Input
                    type="time"
                    name="horaInicio"
                    value={form.horaInicio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hora Fim *</label>
                  <Input
                    type="time"
                    name="horaFim"
                    value={form.horaFim}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Local *</label>
              <Input
                name="local"
                value={form.local}
                onChange={handleChange}
                placeholder="Ex: Quadra Principal"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Professor *</label>
              <Input
                name="professor"
                value={form.professor}
                onChange={handleChange}
                placeholder="Ex: João Silva"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vagas Totais *</label>
            <Input
              type="number"
              name="vagasTotais"
              value={form.vagasTotais}
              onChange={handleChange}
              min={1}
              placeholder="Ex: 20"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading
                ? "Cadastrando..."
                : recorrente
                  ? "Cadastrar Treino Recorrente"
                  : "Cadastrar Treino Único"
              }
            </Button>
            <Link href="/admin/treino" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
          </div>

          {recorrente && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
              <p className="font-medium">ℹ️ Informação sobre treino recorrente:</p>
              <p className="mt-1">
                O sistema criará um treino para cada dia selecionado,
                dentro do período informado, sempre no mesmo horário.
              </p>
            </div>
          )}
        </form>
      </Card>
    </section>
  )
}
