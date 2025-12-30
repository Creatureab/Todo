import { NextRequest, NextResponse } from "next/server";


function decodeJwt(token: string) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        // Base64Url to Base64
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload;
    } catch {
        return null;
    }
}

export function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    const user = token ? decodeJwt(token) : null;

    if (user && pathname === "/login") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (!user && pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login"],
};
