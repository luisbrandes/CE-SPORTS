"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VerificationCodeInput from "@/components/ui/VerificationCodeInput";

function VerifyContent() {
  const router = useRouter();
  const search = useSearchParams();
  const email = search.get("email") || "";

  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/login");
      } else {
        alert("❌ " + data.error);
      }
    } catch (err: any) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-500 p-6">
      <Card className="w-full max-w-md text-center bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">CE Sports</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Verificação de Conta
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Enviamos um código de 6 dígitos para <b>{email}</b>.
        </p>

        <VerificationCodeInput onChange={setCodigo} />

        <Button
          onClick={handleVerify}
          disabled={loading || codigo.length < 6}
          className="w-full mt-6 bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? "Verificando..." : "Verificar Código"}
        </Button>
      </Card>
    </div>
  );
}


export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Carregando...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
