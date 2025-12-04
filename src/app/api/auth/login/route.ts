import { handleError, success } from "@/lib/api-response";
import { setSessionCookie } from "@/lib/session";
import { parseBody } from "@/lib/validation";
import { loginSchema } from "@/modules/auth/schema";
import { login } from "@/modules/auth/service";

export async function POST(request: Request) {
  try {
    const data = await parseBody(request, loginSchema);
    const { user, token } = await login(data);
    await setSessionCookie(token);
    return success({ user: { id: user.id, email: user.email, username: user.username, role: user.role }, token });
  } catch (error) {
    return handleError(error);
  }
}
