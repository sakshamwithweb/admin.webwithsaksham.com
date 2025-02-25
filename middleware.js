import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const allRateLimits = {
    "/api/adminDetails": { requestsPerDuration: 10, durationInMinute: 5 },
    "/api/adminLogin": { requestsPerDuration: 1, durationInMinute: 10 },
    "/api/checkSession": { requestsPerDuration: 20, durationInMinute: 5 },
    "/api/fetchCategories": { requestsPerDuration: 5, durationInMinute: 5 },
    "/api/post": { requestsPerDuration: 5, durationInMinute: 5 },
    "/api/question": { requestsPerDuration: 5, durationInMinute: 5 },
    "default": { requestsPerDuration: 5, durationInMinute: 5 },
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
        const response = success ? NextResponse.next() : new NextResponse(`Too many requests`, { status: 429 });
        response.headers.set("X-RateLimit-Limit", limit);
        response.headers.set("X-RateLimit-Remaining", remaining);
        response.headers.set("X-RateLimit-Reset", reset);
        return response
    }
}