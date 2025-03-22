import { Query } from "node-appwrite";
import { createAdminClient } from "~/server/utils/createAdminClient";

export const getUserByEmail = async (email: string) => {
  const config = useRuntimeConfig();
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    config.public.appwriteDatabase,
    config.public.appwriteUsersCollection,
    [Query.equal("email", [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};
