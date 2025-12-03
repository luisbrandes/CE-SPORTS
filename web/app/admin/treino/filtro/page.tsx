"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Filter } from "lucide-react"

interface Props {
  onChange: (filtros: { modalidade: string; professor: string }) => void
}

export default function FiltrosTreino({ onChange }: Props) {
  const [showModalidade, setShowModalidade] = useState(false)
  const [showProfessor, setShowProfessor] = useState(false)
  const [modalidade, setModalidade] = useState("")
  const [professor, setProfessor] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({ modalidade, professor })
    }, 250)
    return () => clearTimeout(timeout)
  }, [modalidade, professor, onChange])

  return (
    <div className="flex gap-4 items-center">
      <div>
        <Button variant="outline" onClick={() => setShowModalidade(v => !v)}>
          <Filter className="w-4 h-4 mr-2" /> Modalidade
        </Button>
        {showModalidade && (
          <Card className="p-2 mt-2">
            <Input
              placeholder="Digite o esporte"
              value={modalidade}
              onChange={e => setModalidade(e.target.value)}
            />
          </Card>
        )}
      </div>

      <div>
        <Button variant="outline" onClick={() => setShowProfessor(v => !v)}>
          <Filter className="w-4 h-4 mr-2" /> Professor
        </Button>
        {showProfessor && (
          <Card className="p-2 mt-2">
            <Input
              placeholder="Digite o nome"
              value={professor}
              onChange={e => setProfessor(e.target.value)}
            />
          </Card>
        )}
      </div>
    </div>
  )
}
