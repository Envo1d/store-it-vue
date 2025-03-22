import { z } from "zod";
import { getUserByEmail } from "~/server/utils/getUserByEmail";
import { parseStringify } from "~/server/utils/parseStringify";
import { sendEmailOTP } from "~/server/utils/sendEmailOTP";

const signUpSchema = z.object({
  email: z.string().email(),
});

export default defineEventHandler(async (event) => {
  const requestBody = await readValidatedBody(event, (body) =>
    signUpSchema.safeParse(body),
  );

  if (!requestBody.success)
    throw createError({
      status: 403,
      message: parseStringify(requestBody.error.issues),
    });

  const existingUser = await getUserByEmail(requestBody.data.email);

  if (existingUser) {
    return parseStringify(await sendEmailOTP(requestBody.data.email));
  }

  throw createError({
    status: 404,
    message: "User not found",
  });
});
