import { createAdminClient } from "~/server/utils/createAdminClient";
import { createQueries } from "~/server/utils/createQueries";
import { parseStringify } from "~/server/utils/parseStringify";
import { z } from "zod";

const filesSchema = z.object({
  type: z.string(),
  search: z.string(),
  sort: z.string(),
  limit: z.number().optional(),
});

export default defineEventHandler(async (event) => {
  const { databases } = await createAdminClient();
  const config = useRuntimeConfig();

  const query = await getValidatedQuery(event, filesSchema.safeParse);

  const currentUser = await event.$fetch("/api/current-user", {
    method: "GET",
  });

  if (currentUser === undefined) {
    createError({
      status: 404,
      message: "User not found",
    });
  }

  const queries = createQueries(
    currentUser,
    query.data?.type,
    query.data?.search,
    query.data?.sort,
    query.data?.limit,
  );

  const files = await databases.listDocuments(
    config.public.appwriteDatabase,
    config.public.appwriteFilesCollection,
    queries,
  );

  if (!files) {
    createError({
      status: 404,
      message: "Failed to get files",
    });
  }

  return parseStringify(files);
});
