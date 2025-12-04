import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { AppError } from "./errors";

export type SessionPayload = {
  userId: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
};

export const SESSION_COOKIE = "om_session";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

const getSecret = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new AppError("CONFIG_ERROR", "AUTH_SECRET is not set", 500);
  }
  return new TextEncoder().encode(secret);
};

export const createSessionToken = async (payload: SessionPayload) => {
  const secret = getSecret();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(secret);
};

export const verifySessionToken = async (token: string): Promise<SessionPayload> => {
  const secret = getSecret();
  const { payload } = await jwtVerify<SessionPayload>(token, secret);
  return payload;
};

export const setSessionCookie = async (token: string) => {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL,
    path: "/",
  });
};

export const clearSessionCookie = async () => {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    maxAge: 0,
    path: "/",
  });
};

export const getSessionFromRequest = async (): Promise<SessionPayload | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifySessionToken(token);
  } catch (err) {
    console.warn("Invalid session token", err);
    return null;
  }
};
