import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("JSESSIONID")
  const url = req.nextUrl.clone()

  const isAlunoPage =
    url.pathname.startsWith("/campeonatos") ||
    url.pathname.startsWith("/equipes")

  const isAdminPage = url.pathname.startsWith("/admin")

  // 🔒 Páginas de aluno exigem login
  if (!sessionCookie && isAlunoPage) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (sessionCookie) {
    try {
      const res = await fetch("http://localhost:8080/api/auth/me", {
        headers: { Cookie: `JSESSIONID=${sessionCookie.value}` },
        credentials: "include",
      })

      if (res.status !== 200) {
        url.pathname = "/login"
        return NextResponse.redirect(url)
      }

      const data = await res.json()
      const role = data.user?.role

      // 🔐 ADMIN: acesso total
      if (isAdminPage && role !== "ROLE_ADMIN") {
        return NextResponse.redirect(new URL("/403", req.url))
      }

      // 🎓 Páginas de aluno:
      // USER, ALUNO e ADMIN podem acessar
      if (
        isAlunoPage &&
        !["ROLE_USER", "ROLE_ALUNO", "ROLE_ADMIN"].includes(role)
      ) {
        return NextResponse.redirect(new URL("/403", req.url))
      }

    } catch (e) {
      console.error("Erro no middleware:", e)
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/campeonatos/:path*", "/equipes/:path*"],
}
