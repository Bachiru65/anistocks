import { handleError, success } from "@/lib/api-response";
import { AppError } from "@/lib/errors";
import { getSessionFromRequest } from "@/lib/session";
import { parseBody } from "@/lib/validation";
import { placeBet } from "@/modules/trading/service";
import { placeBetSchema } from "@/modules/trading/schema";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getSessionFromRequest();
    if (!session) throw new AppError("UNAUTHORIZED", "Login required", 401);
    const { id } = await params;
    if (!id) throw new AppError("VALIDATION_ERROR", "Missing market id", 400);
    const data = await parseBody(request, placeBetSchema);
    const bet = await placeBet(id, data, session);
    return success({ bet }, 201);
  } catch (error) {
    return handleError(error);
  }
}
