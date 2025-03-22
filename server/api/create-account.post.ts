import { ID } from "node-appwrite";
import { z } from "zod";
import { createAdminClient } from "~/server/utils/createAdminClient";
import { getUserByEmail } from "~/server/utils/getUserByEmail";
import { parseStringify } from "~/server/utils/parseStringify";
import { sendEmailOTP } from "~/server/utils/sendEmailOTP";

const signUpSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email(),
});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const requestBody = await readValidatedBody(event, (body) =>
    signUpSchema.safeParse(body),
  );

  if (!requestBody.success)
    throw createError({
      status: 403,
      message: parseStringify(requestBody.error.issues),
    });

  const existingUser = await getUserByEmail(requestBody.data.email);

  const accountId = await sendEmailOTP(requestBody.data.email);

  if (!accountId)
    throw createError({
      status: 403,
      message: "Failed to send an OTP",
    });

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      config.public.appwriteDatabase,
      config.public.appwriteUsersCollection,
      ID.unique(),
      {
        fullName: requestBody.data.fullName,
        email: requestBody.data.email,
        avatar:
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
        accountId,
      },
    );
  }

  return parseStringify(accountId);
});
