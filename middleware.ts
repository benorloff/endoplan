import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

/**
 * Middleware for Supabase SSR session management
 * 
 * Note: Next.js shows a deprecation warning about middleware.ts, but this file
 * is still the recommended approach for Supabase SSR authentication. The warning
 * is about future Next.js changes, but middleware.ts continues to work correctly
 * in Next.js 16.1.1 and is required for Supabase SSR cookie-based auth.
 * 
 * This middleware refreshes expired auth tokens and manages session cookies
 * automatically. Protected routes should use requireAuth() from lib/auth/get-user.ts
 * rather than redirecting here.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
