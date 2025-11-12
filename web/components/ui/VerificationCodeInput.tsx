"use client"

import { useEffect, useRef, useState } from "react"

interface Props {
  length?: number
  isDisabled?: boolean
  onChange: (code: string) => void
}

export default function VerificationCodeInput({
  length = 6,
  isDisabled = false,
  onChange,
}: Props) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""))
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    onChange(values.join(""))
  }, [values, onChange])

  const handleChange = (index: number, value: string) => {
    if (/[^a-zA-Z0-9]/.test(value)) return
    const updated = [...values]
    updated[index] = value.toUpperCase()
    setValues(updated)
    if (value && index < length - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").slice(0, length).split("")
    const updated = [...values]
    pasted.forEach((char, i) => {
      if (i < length) updated[i] = char.toUpperCase()
    })
    setValues(updated)
    refs.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div
      onPaste={handlePaste}
      className="flex justify-center items-center gap-3 mt-4"
    >
      {values.map((char, index) => (
        <input
          key={index}
          ref={(el) => {
  refs.current[index] = el
}}
          type="text"
          maxLength={1}
          value={char}
          disabled={isDisabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`w-12 h-14 text-xl text-center font-semibold border-2 rounded-xl transition-all duration-150
            ${
              isDisabled
                ? "bg-gray-200 text-gray-400"
                : "bg-white border-blue-300 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            }`}
        />
      ))}
    </div>
  )
}
