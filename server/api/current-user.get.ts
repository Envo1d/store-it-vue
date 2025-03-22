import { Query } from "node-appwrite";
import { createClientSession } from "~/server/utils/createClientSession";
import { parseStringify } from "~/server/utils/parseStringify";

export default defineEventHandler(async (event) => {
  const session = getCookie(event, "appwrite-session") || null;
  const config = useRuntimeConfig();

  if (!session) {
    throw createError({
      status: 404,
      message: "User not found",
    });
  }

  const { databases, account } = await createClientSession(session);

  const result = await account.get();

  const user = await databases.listDocuments(
    config.public.appwriteDatabase,
    config.public.appwriteUsersCollection,
    [Query.equal("accountId", [result.$id])],
  );

  return user.total <= 0 ? null : parseStringify(user.documents[0]);
});
