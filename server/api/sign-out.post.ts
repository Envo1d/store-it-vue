import { createClientSession } from "~/server/utils/createClientSession";

export default defineEventHandler(async (event) => {
  const session = getCookie(event, "appwrite-session") || null;

  if (!session) {
    throw createError({
      status: 404,
      message: "User not found",
    });
  }

  const { account } = await createClientSession(session);

  try {
    await account.deleteSession("current");
    deleteCookie(event, "appwrite-session");
    return { status: 200 };
  } catch {
    throw createError({
      status: 403,
      message: "Failed to sign out user",
    });
  }
});
