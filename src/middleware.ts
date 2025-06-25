export { auth as middleware } from "@/lib/auth"

export const config = {
  // Ne pas exécuter le middleware sur les API, les images, ou les fichiers statiques.
  matcher: ['/((?!api|_next/static|public/|_next/image|.*\\.png$|favicon.ico|site.webmanifest).*)'],
};