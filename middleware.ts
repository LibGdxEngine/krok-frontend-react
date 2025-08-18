import { NextResponse } from "next/server";

export function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/api/auth")) {
        return NextResponse.redirect(new URL("/auth", req.url));
    }
}
