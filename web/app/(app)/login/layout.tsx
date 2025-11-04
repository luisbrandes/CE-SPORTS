export const metadata = {
  title: "Login - CE Sports",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-500">
        {children}
      </body>
    </html>
  )
}
