import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {

  const loginToken = request.cookies.get("token")?.value;
  
    if (!loginToken) {
  
        return NextResponse.redirect(new URL('/', request.url))
    }
 
    // return NextResponse.json({message:"hellow this is a simple json"})
      return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*'],
}
