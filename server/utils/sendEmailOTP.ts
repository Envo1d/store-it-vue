import { ID } from "node-appwrite";
import { handleError } from "~/server/utils/handleError";
import { createAdminClient } from "~/server/utils/createAdminClient";

export const sendEmailOTP = async (email: string) => {
  const { account } = await createAdminClient();

  try {
    const sessions = await account.createEmailToken(ID.unique(), email);

    return sessions.userId;
  } catch (e) {
    handleError(e, "Failed to send email OTP");
  }
};
