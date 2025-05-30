import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import { validateJWT } from "./lib/generateToken";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const allRateLimits = {
    "/api/adminDetails": { requestsPerDuration: 50, durationInMinute: 5 },
    "/api/adminLogin": { requestsPerDuration: 10, durationInMinute: 10 },
    "/api/checkSession": { requestsPerDuration: 100, durationInMinute: 5 },
    "/api/fetchCategories": { requestsPerDuration: 20, durationInMinute: 5 },
    "/api/post": { requestsPerDuration: 20, durationInMinute: 5 },
    "/api/question": { requestsPerDuration: 20, durationInMinute: 5 },
    "default": { requestsPerDuration: 20, durationInMinute: 5 },
};

export async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith('/api')) { // for apis
        const currentRateLimit = allRateLimits[pathname] || allRateLimits['default']
        const ratelimit = new Ratelimit({
            redis: redis,
            limiter: Ratelimit.fixedWindow(currentRateLimit.requestsPerDuration, `${currentRateLimit.durationInMinute * 60} s`),
        });
        const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
        const rateLimitKey = `admin-${pathname}-${ip}`
        const { success, limit, remaining, reset } = await ratelimit.limit(rateLimitKey);
        if (!success) {
            const response = new NextResponse(`Too many requests`, { status: 429 });
            response.headers.set("X-RateLimit-Limit", limit);
            response.headers.set("X-RateLimit-Remaining", remaining);
            response.headers.set("X-RateLimit-Reset", reset);
            return response
        }
        // Now here write condition for jwt
        // In GET request we are fetching the param as: id=id, and in rest we are taking from body 
        let id;
        if (req.method == "GET") {
            const searchParams = req.nextUrl.searchParams;
            id = searchParams.get('id');
            if(!id) return NextResponse.json({ success: false, message: "Invalid id!" }, { status: 403 })  
        } else {
            const payload = await req.json()
            id = payload.id;
        }
        const token = req.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Didn't get Token" }, { status: 403 })
        const validateToken = await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Invalid token!" }, { status: 403 })
        const response = NextResponse.next();
        response.headers.set("X-RateLimit-Limit", limit);
        response.headers.set("X-RateLimit-Remaining", remaining);
        response.headers.set("X-RateLimit-Reset", reset);
        return response
    }
    const token = (await cookies()).get('sessionId')?.value
    if (token) {
        if (pathname == "/") {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    } else {
        if (pathname !== "/") {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }
}

export const config = {
    matcher: ["/api/:path*", "/dashboard", "/blogs/:path*", "/queries", "/"],
};
