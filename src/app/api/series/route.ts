import { handleError, success } from "@/lib/api-response";
import { AppError } from "@/lib/errors";
import { getSessionFromRequest } from "@/lib/session";
import { parseBody, parseSearchParams } from "@/lib/validation";
import { createSeries, createSeriesSchema, listSeries, listSeriesSchema } from "@/modules/markets/series";

export async function GET(request: Request) {
  try {
    const filters = parseSearchParams(new URL(request.url).searchParams, listSeriesSchema);
    const series = await listSeries(filters);
    return success({ series });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest();
    if (!session || session.role !== "ADMIN") throw new AppError("FORBIDDEN", "Admin only", 403);
    const data = await parseBody(request, createSeriesSchema);
    const created = await createSeries(data);
    return success({ series: created }, 201);
  } catch (error) {
    return handleError(error);
  }
}
