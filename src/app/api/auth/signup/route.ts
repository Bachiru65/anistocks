import { handleError, success } from "@/lib/api-response";
import { setSessionCookie } from "@/lib/session";
import { parseBody } from "@/lib/validation";
import { signup } from "@/modules/auth/service";
import { signupSchema } from "@/modules/auth/schema";

export async function POST(request: Request) {
  try {
    const data = await parseBody(request, signupSchema);
    const { user, token } = await signup(data);
    await setSessionCookie(token);
    return success({ user: { id: user.id, email: user.email, username: user.username, role: user.role }, token }, 201);
  } catch (error) {
    return handleError(error);
  }
}
