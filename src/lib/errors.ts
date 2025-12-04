export class AppError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(code: string, message: string, status = 400, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const toErrorResponse = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      status: error.status,
      body: { error: { code: error.code, message: error.message, details: error.details } },
    };
  }

  console.error(error);
  return {
    status: 500,
    body: { error: { code: "SERVER_ERROR", message: "Unexpected error" } },
  };
};
