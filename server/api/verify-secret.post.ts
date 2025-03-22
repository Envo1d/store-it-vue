import { setCookie } from "h3";
import { z } from "zod";
import { createAdminClient } from "~/server/utils/createAdminClient";
import { parseStringify } from "~/server/utils/parseStringify";

const verifyOTPSchema = z.object({
  accountId: z.string().min(2).max(50),
  password: z.string().min(6).max(6),
});

export default defineEventHandler(async (event) => {
  const requestBody = await readValidatedBody(event, (body) =>
    verifyOTPSchema.safeParse(body),
  );

  if (!requestBody.success)
    throw createError({
      status: 403,
      message: parseStringify(requestBody.error.issues),
    });

  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(
      requestBody.data.accountId,
      requestBody.data.password,
    );

    setCookie(event, "appwrite-session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
    });

    return parseStringify({ sessionId: session.$id });
  } catch {
    throw createError({
      status: 403,
      message: "Failed to verify OTP",
    });
  }
});
