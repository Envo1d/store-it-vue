import type { Models } from "node-appwrite";
import { constructUrl } from "~/utils/utilities";

interface GetFilesProps {
  type?: string | undefined;
  searchText?: string;
  sort?: string;
  limit?: number;
}
export const getFiles = async ({
  type,
  searchText,
  sort,
  limit,
}: GetFilesProps) => {
  let query = "api/get-files";
  if (type) query += `/?type=${type}`;
  if (searchText) query += `&search=${searchText}`;
  if (sort) query += `&sort=${sort}`;
  if (limit) query += `&limit=${limit}`;

  return await $fetch<Models.Document>(constructUrl(query), {
    method: "GET",
  });
};

export const renameFile = async (
  newFileName: string,
  fileId: string,
  fileExtension: string,
) => {
  return await $fetch("/api/rename-file", {
    method: "POST",
    body: {
      fileId: fileId,
      name: newFileName,
      extension: fileExtension,
    },
  });
};

export const shareFile = async (fileId: string, emails: string[]) => {
  return await $fetch("/api/update-file-users", {
    method: "POST",
    body: {
      fileId: fileId,
      emails: emails,
    },
  });
};

export const deleteFile = async (fileId: string, bucketFileId: string) => {
  return await $fetch(`/api/delete-file`, {
    method: "POST",
    body: {
      fileId: fileId,
      bucketFileId: bucketFileId,
    },
  });
};
