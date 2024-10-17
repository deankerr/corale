import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) {
    auth().protect()
  }

  const response = NextResponse.next()
  response.headers.set(
    'Content-Security-Policy',
    "object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;",
  )
  return response
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
