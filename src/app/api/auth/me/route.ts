import { handleError, success } from "@/lib/api-response";
import { AppError } from "@/lib/errors";
import { getSessionFromRequest } from "@/lib/session";
import { getProfile } from "@/modules/auth/service";

export async function GET() {
  try {
    const session = await getSessionFromRequest();
    if (!session) throw new AppError("UNAUTHORIZED", "Not authenticated", 401);
    const user = await getProfile(session);
    return success({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        wallet: user.wallet,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
