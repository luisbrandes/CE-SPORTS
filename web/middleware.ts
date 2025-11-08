import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("JSESSIONID")

  // Se o usuário tentar acessar /admin ou /aluno sem cookie de sessão → redireciona
  if (!sessionCookie && (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/aluno"))) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/aluno/:path*"],
}
