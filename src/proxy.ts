import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const session = request.cookies.get('auth_session')?.value
  
  // If user is accessing protected routes without session
  if (!session && (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/employee'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (session) {
    try {
      const parsedSession = JSON.parse(session)
      
      // Prevent admin from accessing employee routes and vice versa
      if (request.nextUrl.pathname.startsWith('/admin') && parsedSession.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/employee/home', request.url))
      }
      if (request.nextUrl.pathname.startsWith('/employee') && parsedSession.role !== 'KARYAWAN') {
        return NextResponse.redirect(new URL('/admin/home', request.url))
      }

      // If user is already logged in and tries to access login page, redirect to their home
      if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL(parsedSession.role === 'ADMIN' ? '/admin/home' : '/employee/home', request.url))
      }
    } catch (e) {
      // invalid session format
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.delete('auth_session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
