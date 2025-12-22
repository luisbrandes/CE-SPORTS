import { Suspense } from "react";
import TreinosAdminClient from "./TreinosAdminClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Carregando...</div>}>
      <TreinosAdminClient />
    </Suspense>
  );
}
