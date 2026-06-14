import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "workout_app_session";

export async function isPasswordValid(input: string, configured: string | undefined) {
  if (!configured || !input) return false;

  const inputBuffer = Buffer.from(input);
  const configuredBuffer = Buffer.from(configured);

  if (inputBuffer.length !== configuredBuffer.length) return false;

  return timingSafeEqual(inputBuffer, configuredBuffer);
}

function sign(value: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is required");

  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionValue() {
  const payload = "single-user";
  return `${payload}.${sign(payload)}`;
}

export function isSessionValueValid(value: string | undefined) {
  if (!value) return false;

  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;

  return sign(payload) === signature;
}

export async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;

  if (!isSessionValueValid(session)) {
    redirect("/login");
  }
}

export async function setAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, createSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}
