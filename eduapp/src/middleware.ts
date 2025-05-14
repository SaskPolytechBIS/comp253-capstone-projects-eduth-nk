import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const teacherId = request.cookies.get("teacherId")?.value;
    const studentId = request.cookies.get("studentId")?.value;

    if (pathname.startsWith("/teacherBoard") && !teacherId) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/studentBoard") && !studentId) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/teacherBoard/:path*', '/studentBoard/:path*'],
};
