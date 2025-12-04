import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { comparePassword, hashPassword } from "@/lib/password";
import {
  SessionPayload,
  createSessionToken,
} from "@/lib/session";
import type { LoginInput, SignupInput } from "./schema";

const defaultStartingBalance = () => {
  const envValue = process.env.SEED_STARTING_BALANCE;
  const parsed = envValue ? Number(envValue) : 10000;
  return Number.isFinite(parsed) ? parsed : 10000;
};

const buildSession = (user: { id: string; email: string; username: string; role: "USER" | "ADMIN" }) =>
  ({
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  } satisfies SessionPayload);

export const signup = async (input: SignupInput) => {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { username: input.username }] },
  });
  if (existing) {
    throw new AppError("USER_EXISTS", "Email or username already registered", 409);
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      passwordHash,
      wallet: {
        create: { balanceTokens: defaultStartingBalance() },
      },
    },
    include: { wallet: true },
  });

  const token = await createSessionToken(buildSession(user));
  return { user, token };
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { wallet: true },
  });
  if (!user) {
    throw new AppError("INVALID_CREDENTIALS", "Invalid email or password", 401);
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError("INVALID_CREDENTIALS", "Invalid email or password", 401);
  }

  const token = await createSessionToken(buildSession(user));
  return { user, token };
};

export const getProfile = async (session: SessionPayload) => {
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      wallet: true,
    },
  });
  if (!user) throw new AppError("NOT_FOUND", "User not found", 404);
  return user;
};
