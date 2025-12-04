import { z } from "zod";
import { AppError } from "./errors";

export async function parseBody<T>(request: Request, schema: z.ZodSchema<T>) {
  const json = await request.json().catch(() => {
    throw new AppError("VALIDATION_ERROR", "Invalid JSON body", 400);
  });
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid input", 400, parsed.error.flatten());
  }
  return parsed.data;
}

export function parseSearchParams<T>(params: URLSearchParams, schema: z.ZodSchema<T>): T {
  const obj = Object.fromEntries(params.entries());
  const parsed = schema.safeParse(obj);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid query params", 400, parsed.error.flatten());
  }
  return parsed.data;
}
