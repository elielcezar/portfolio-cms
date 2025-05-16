import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Verificar se há um token ou cookie de autenticação
  const session = request.cookies.get("auth-session");

  // Se não houver sessão e o usuário estiver tentando acessar o dashboard
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    // Redireciona para a página de login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se houver sessão e o usuário estiver tentando acessar páginas de auth
  if (session && (
    request.nextUrl.pathname.startsWith("/login") || 
    request.nextUrl.pathname.startsWith("/register")
  )) {
    // Redireciona para o dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register"
  ]
}; 