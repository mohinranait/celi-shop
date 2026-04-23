import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { JWT_SECRET } from './lib/envSecret';
 
const jwtSecret = JWT_SECRET as string;
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  const token = request.cookies.get('access_token')?.value;
  const {pathname} = request.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    const {payload} = await jwtVerify(token, new TextEncoder().encode(jwtSecret));
    console.log({payload});
    const role = payload.role;

     // Protect admin route
    if (pathname.startsWith('/admin') && role !== 'Admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url)) 
    }

    // Protect dashboard route
    if (pathname.startsWith('/dashboard') && !role) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url))
  }

 
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}