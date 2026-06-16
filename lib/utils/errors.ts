import { NextResponse } from "next/server";
import type { ApiError } from "@/types/api";
import { UsdaApiError } from "@/lib/usda/client";

export function apiErrorResponse(error: ApiError, status: number) {
  return NextResponse.json({ error }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof UsdaApiError) {
    return apiErrorResponse(
      { code: error.code, message: error.message },
      error.status,
    );
  }

  if (error instanceof DOMException && error.name === "TimeoutError") {
    return apiErrorResponse(
      {
        code: "UPSTREAM_TIMEOUT",
        message: "Request timed out. Please try again.",
      },
      504,
    );
  }

  if (error instanceof TypeError) {
    return apiErrorResponse(
      {
        code: "UPSTREAM_ERROR",
        message: "Unable to reach USDA service. Please try again.",
      },
      502,
    );
  }

  console.error("[API]", error);
  return apiErrorResponse(
    { code: "INTERNAL_ERROR", message: "Something went wrong." },
    500,
  );
}

export function parsePositiveInt(value: string, fieldName: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new ValidationError(`${fieldName} must be a positive integer`);
  }
  return parsed;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function handleValidationError(error: ValidationError) {
  return apiErrorResponse({ code: "VALIDATION_ERROR", message: error.message }, 400);
}

export async function parseApiError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (body?.error?.message) return body.error.message;
  } catch {
    // ignore parse failure
  }
  return "Something went wrong. Please try again.";
}
