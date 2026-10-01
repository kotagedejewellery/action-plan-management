export class AppError extends Error {
  constructor(message: string, public readonly code: "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "VALIDATION") {
    super(message);
  }
}
