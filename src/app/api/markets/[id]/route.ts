import { handleError, success } from "@/lib/api-response";
import { AppError } from "@/lib/errors";
import { getSessionFromRequest } from "@/lib/session";
import { getMarketById } from "@/modules/markets/service";

type Params = { params: { id: string } };

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await getSessionFromRequest();
    if (!params.id) throw new AppError("VALIDATION_ERROR", "Missing market id", 400);
    const market = await getMarketById(params.id, session || undefined);
    return success({ market });
  } catch (error) {
    return handleError(error);
  }
}
