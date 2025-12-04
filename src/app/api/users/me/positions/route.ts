import { handleError, success } from "@/lib/api-response";
import { AppError } from "@/lib/errors";
import { getSessionFromRequest } from "@/lib/session";
import { getUserPositions } from "@/modules/users/service";

export async function GET() {
  try {
    const session = await getSessionFromRequest();
    if (!session) throw new AppError("UNAUTHORIZED", "Login required", 401);
    const positions = await getUserPositions(session.userId);
    return success({ positions });
  } catch (error) {
    return handleError(error);
  }
}
