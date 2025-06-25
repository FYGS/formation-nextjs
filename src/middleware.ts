export { auth as middleware } from "@/lib/auth"

export const config = {
  // Assurez-vous que le matcher inclut /login pour que le callback authorized s'exécute
  // aussi quand l'utilisateur est sur /login, afin de pouvoir le rediriger s'il est connecté.
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)', '/dashboard/:path*', '/login', '/signup'],
};