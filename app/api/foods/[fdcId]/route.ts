import { getFoodById } from "@/lib/usda/client";
import {
  handleRouteError,
  handleValidationError,
  parsePositiveInt,
  ValidationError,
} from "@/lib/utils/errors";

interface RouteContext {
  params: Promise<{ fdcId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { fdcId: fdcIdParam } = await context.params;
    const fdcId = parsePositiveInt(fdcIdParam, "fdcId");
    const result = await getFoodById(fdcId);
    return Response.json(result);
  } catch (error) {
    if (error instanceof ValidationError) return handleValidationError(error);
    return handleRouteError(error);
  }
}
