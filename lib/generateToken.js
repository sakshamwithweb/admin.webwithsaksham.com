"use server";
import { v4 as uuidv4 } from "uuid";
import * as jose from 'jose' // replaced from jsonwebtoken as jsonwebtken doesn't work in browser but jose does.

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

export const generateToken = async () => {
    const id = uuidv4();
    const payload = { id };
    const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1m')
        .sign(secret)
    // Later you could store id in radis and verify.
    return { token, id };
};

export const validateJWT = async (token, id) => {
    try {
        const { payload } = await jose.jwtVerify(token, secret)
        if (!payload || payload?.id != id) throw new Error("Invalid");
        return { valid: true };
    } catch (error) {
        return { valid: false, message: error.message };
    }
};