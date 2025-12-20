"use client";

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

type FormState = {
  modalidade: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  local: string;
  professor: string;
  vagasTotais: string;
  dataInicio: string;
  dataFim: string;
  diasDaSemana: string[];
}

export default function EditarTreinoPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [recorrente, setRecorrente] = useState(false)

  const [form, setForm] = useState<FormState>({
    modalidade: "",
    data: "",
    horaInicio: "",
    horaFim: "",
    local: "",
    professor: "",
    vagasTotais: "",
    dataInicio: "",
    dataFim: "",
    diasDaSemana: [],
  })

  useEffect(() => {
    async function carregarTreino() {
      try {
        const res = await fetch(`http://localhost:8080/api/treinos/${id}`, {
          credentials: "include",
        })

        if (!res.ok) throw new Error()

        const treino = await res.json()

        setRecorrente(treino.recorrente === true)

        setForm({
          modalidade: treino.modalidade || "",
          data: treino.data || "",
          horaInicio: treino.horaInicio || "",
          horaFim: treino.horaFim || "",
          local: treino.local || "",
          professor: treino.professor || "",
          vagasTotais: treino.vagasTotais?.toString() || "",
          dataInicio: treino.dataInicio || "",
          dataFim: treino.dataFim || "",
          diasDaSemana: treino.diasDaSemana || [],
        })
      } catch (err) {
        alert("Erro ao carregar treino.")
      } finally {
        setLoading(false)
      }
    }

    carregarTreino()
  }, [id])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleDiaSemana = (dia: string) => {
    setForm(prev => {
      const atuais = Array.isArray(prev.diasDaSemana) ? prev.diasDaSemana : []
      const novo = atuais.includes(dia)
        ? atuais.filter(d => d !== dia)
        : [...atuais, dia]

      return { ...prev, diasDaSemana: novo }
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSalvando(true)

    try {
      const vagas = parseInt(form.vagasTotais)
      if (isNaN(vagas) || vagas <= 0) {
        alert("Número de vagas inválido")
        setSalvando(false)
        return
      }

      const payload: any = {
        modalidade: form.modalidade,
        horaInicio: form.horaInicio,
        horaFim: form.horaFim,
        local: form.local,
        professor: form.professor,
        vagasTotais: vagas,
      }

      if (recorrente) {
        payload.dataInicio = form.dataInicio
        payload.dataFim = form.dataFim
        payload.diasDaSemana = form.diasDaSemana
      } else {
        payload.data = form.data
      }

      const res = await fetch(`http://localhost:8080/api/treinos/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(await res.text())

      alert("Treino atualizado com sucesso!")
      router.push("/admin/treino")
      
    } catch (err: any) {
      alert("Erro: " + err.message)
    } finally {
      setSalvando(false)
    }
  }

  if (loading) {
    return (
      <p className="text-center p-6 text-muted-foreground">
        Carregando dados do treino...
      </p>
    )
  }

  return (
    <section className="p-6">
      <div className="mb-6">
        <Link href="/admin/treino" className="text-sm text-primary hover:underline">
          ← Voltar para Treinos
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-2">Editar Treino #{id}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            name="modalidade"
            value={form.modalidade}
            onChange={handleChange}
            required
            placeholder="Modalidade"
          />

          {!recorrente && (
            <Input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              required
            />
          )}

          {recorrente && (
            <>
              <Input
                type="date"
                name="dataInicio"
                value={form.dataInicio}
                onChange={handleChange}
                required
              />

              <Input
                type="date"
                name="dataFim"
                value={form.dataFim}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-3 gap-2">
                {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].map(dia => (
                  <Button
                    type="button"
                    key={dia}
                    variant={form.diasDaSemana.includes(dia) ? "default" : "outline"}
                    onClick={() => toggleDiaSemana(dia)}
                  >
                    {dia.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </>
          )}

          <Input
            type="time"
            name="horaInicio"
            value={form.horaInicio}
            onChange={handleChange}
            required
          />

          <Input
            type="time"
            name="horaFim"
            value={form.horaFim}
            onChange={handleChange}
            required
          />

          <Input
            name="local"
            value={form.local}
            onChange={handleChange}
            required
            placeholder="Local"
          />

          <Input
            name="professor"
            value={form.professor}
            onChange={handleChange}
            required
            placeholder="Professor"
          />

          <Input
            type="number"
            name="vagasTotais"
            value={form.vagasTotais}
            onChange={handleChange}
            min={1}
            required
          />

          <Button type="submit" disabled={salvando} className="w-full">
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Card>
    </section>
  )
}
