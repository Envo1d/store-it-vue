import { z } from "zod";
import { createAdminClient } from "~/server/utils/createAdminClient";
import { parseStringify } from "~/server/utils/parseStringify";

const renameFileSchema = z.object({
  fileId: z.string(),
  name: z.string(),
  extension: z.string(),
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

  const { databases } = await createAdminClient();
  const config = useRuntimeConfig();

  try {
    const newName = `${requestBody.data.name}.${requestBody.data.extension}`;
    const updatedFile = await databases.updateDocument(
      config.public.appwriteDatabase,
      config.public.appwriteFilesCollection,
      requestBody.data.fileId,
      {
        name: newName,
      },
    );
    return parseStringify(updatedFile);
  } catch {
    throw createError({
      status: 404,
      message: "File not found",
    });
  }
});
