// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que exigem login
const protectedRoutes = ["/admin", "/aluno"];

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("JSESSIONID");
  const pathname = request.nextUrl.pathname;

  // Se for rota protegida e não tiver cookie, redireciona para /login
  if (protectedRoutes.some(path => pathname.startsWith(path))) {
    if (!cookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Senão, segue normalmente
  return NextResponse.next();
}

export const config = {
  matcher: ["/adm/:path*", "/aluno/:path*"], // Middleware só nessas rotas
};
