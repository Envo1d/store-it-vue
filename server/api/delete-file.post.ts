import { z } from "zod";
import { createAdminClient } from "~/server/utils/createAdminClient";
import { parseStringify } from "~/server/utils/parseStringify";

const renameFileSchema = z.object({
  fileId: z.string(),
  bucketFileId: z.string(),
});

export default defineEventHandler(async (event) => {
  const requestBody = await readValidatedBody(event, (body) =>
    renameFileSchema.safeParse(body),
  );

  if (!requestBody.success)
    throw createError({
      status: 403,
      message: parseStringify(requestBody.error.message),
    });

  const { databases, storage } = await createAdminClient();
  const config = useRuntimeConfig();

  try {
    const deletedFile = await databases.deleteDocument(
      config.public.appwriteDatabase,
      config.public.appwriteFilesCollection,
      requestBody.data.fileId,
    );

    if (deletedFile) {
      await storage.deleteFile(
        config.public.appwriteBucket,
        requestBody.data.bucketFileId,
      );
    }

    return parseStringify({ status: "success" });
  } catch {
    throw createError({
      status: 404,
      message: "File not found",
    });
  }
});
