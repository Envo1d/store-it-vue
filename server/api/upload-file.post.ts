import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { createAdminClient } from "~/server/utils/createAdminClient";
import { parseStringify } from "~/server/utils/parseStringify";
import { constructFileUrl, getFileType } from "~/server/utils/utilities";

enum DataName {
  FILE = "file",
  OWNER_ID = "ownerId",
  ACCOUNT_ID = "accountId",
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { storage, databases } = await createAdminClient();

  try {
    const files = await readMultipartFormData(event);

    let inputFile;
    let ownerId: string = "";
    let accountId: string = "";

    files?.forEach((file) => {
      if (file.name === DataName.FILE) {
        inputFile = InputFile.fromBuffer(file.data, file.filename || file.name);
      }
      if (file.name === DataName.OWNER_ID) {
        ownerId = file.data.toString();
      }
      if (file.name === DataName.ACCOUNT_ID) {
        accountId = file.data.toString();
      }
    });

    if (inputFile && ownerId && accountId) {
      const bucketFile = await storage.createFile(
        config.public.appwriteBucket,
        ID.unique(),
        inputFile as File,
      );

      const fileDocument = {
        type: getFileType(bucketFile.name).type,
        name: bucketFile.name,
        url: constructFileUrl(bucketFile.$id),
        extension: getFileType(bucketFile.name).extension,
        size: bucketFile.sizeOriginal,
        owner: ownerId,
        accountId,
        users: [],
        bucketFileId: bucketFile.$id,
      };

      const newFile = await databases
        .createDocument(
          config.public.appwriteDatabase,
          config.public.appwriteFilesCollection,
          ID.unique(),
          fileDocument,
        )
        .catch(async () => {
          await storage.deleteFile(
            config.public.appwriteBucket,
            bucketFile.$id,
          );
          throw createError({
            status: 403,
            message: "Failed to upload file",
          });
        });

      return parseStringify(newFile);
    }
  } catch {
    throw createError({
      status: 403,
      message: "Failed to upload file",
    });
  }
});
