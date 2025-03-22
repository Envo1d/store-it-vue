import type { Models } from "node-appwrite";
import { Query } from "node-appwrite";

export const createQueries = (
  currentUser: Models.Document,
  type: string,
  search: string,
  sort: string,
  limit: number | undefined,
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (type) {
    if (type === "documents") queries.push(Query.equal("type", ["document"]));
    if (type === "images") queries.push(Query.equal("type", ["image"]));
    if (type === "media") queries.push(Query.equal("type", ["video", "audio"]));
    if (type === "others") queries.push(Query.equal("type", ["other"]));
  }

  if (search) queries.push(Query.contains("name", search));
  if (limit) queries.push(Query.limit(limit));

  const [] = sort.split("-");

  return queries;
};
