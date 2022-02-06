import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    const { pathname } = req.nextUrl

    if (pathname.startsWith("/api")) return NextResponse.next()

    if (pathname !== "/coming-soon" && process.env.IS_UNDER_CONTRUCTION === "1") {
        return NextResponse.redirect('/coming-soon')
    }

    else if (pathname === "/coming-soon" && process.env.IS_UNDER_CONTRUCTION !== "1") {
        return NextResponse.redirect('/')
    }

    return NextResponse.next()
}