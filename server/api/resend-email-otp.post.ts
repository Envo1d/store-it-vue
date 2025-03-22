import { z } from "zod";
import { parseStringify } from "~/server/utils/parseStringify";
import { sendEmailOTP } from "~/server/utils/sendEmailOTP";

const resendOTPSchema = z.object({
  email: z.string().email(),
});

export default defineEventHandler(async (event) => {
  const requestBody = await readValidatedBody(event, (body) =>
    resendOTPSchema.safeParse(body),
  );

  if (!requestBody.success)
    throw createError({
      status: 403,
      message: parseStringify(requestBody.error.issues),
    });

  await sendEmailOTP(requestBody.data.email);

  return { status: 200 };
});
