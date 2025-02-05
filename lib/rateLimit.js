import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
    points: 5, // 5 requests
    duration: 300, //seconds
});

export async function rateLimit(req) {
    try {
        await rateLimiter.consume(req.ip); 
    } catch (rejRes) {
        return false;
    }
    return true;
}
