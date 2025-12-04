import { handleError, success } from "@/lib/api-response";
import { AppError } from "@/lib/errors";
import { getSessionFromRequest } from "@/lib/session";
import { resolveMarket } from "@/modules/trading/service";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getSessionFromRequest();
    if (!session) throw new AppError("UNAUTHORIZED", "Login required", 401);
    const { id } = await params;
    if (!id) throw new AppError("VALIDATION_ERROR", "Missing market id", 400);
    const body = await request.json();
    const result = await resolveMarket(id, body, session);
    return success({ result });
  } catch (error) {
    return handleError(error);
  }
}
