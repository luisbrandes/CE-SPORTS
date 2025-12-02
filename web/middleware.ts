import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("JSESSIONID")
  const url = req.nextUrl.clone()

  if (!sessionCookie && url.pathname.startsWith("/aluno")) {
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

      // Mantém regra: aluno não acessa admin
      if (url.pathname.startsWith("/admin") && role !== "ROLE_ADMIN") {
        return NextResponse.redirect(new URL("/403", req.url))
      }

      // Mantém regra para área do aluno
      if (url.pathname.startsWith("/aluno") && role !== "ROLE_USER") {
        return NextResponse.redirect(new URL("/403", req.url))
      }

    } catch (e) {
      console.error("Erro no middleware:", e)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/aluno/:path*"],
}
