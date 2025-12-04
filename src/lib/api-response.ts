import { NextResponse } from "next/server";
import { toErrorResponse } from "./errors";

export const success = <T>(data: T, status = 200) =>
  NextResponse.json({ data }, { status });

export const handleError = (error: unknown) => {
  const { status, body } = toErrorResponse(error);
  return NextResponse.json(body, { status });
};
