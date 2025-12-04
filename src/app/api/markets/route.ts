import { handleError, success } from "@/lib/api-response";
import { AppError } from "@/lib/errors";
import { getSessionFromRequest } from "@/lib/session";
import { parseBody, parseSearchParams } from "@/lib/validation";
import { createMarket, listMarkets } from "@/modules/markets/service";
import { createMarketSchema, listMarketsSchema } from "@/modules/markets/schema";

export async function GET(request: Request) {
  try {
    const filters = parseSearchParams(new URL(request.url).searchParams, listMarketsSchema);
    const session = await getSessionFromRequest();
    const markets = await listMarkets(filters, session || undefined);
    return success({ markets });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest();
    if (!session) throw new AppError("UNAUTHORIZED", "Login required", 401);
    const data = await parseBody(request, createMarketSchema);
    const market = await createMarket(data, session);
    return success({ market }, 201);
  } catch (error) {
    return handleError(error);
  }
}
