import { Client, Account, Databases, Query } from "node-appwrite";

export const createClientSession = async (session: string) => {
  const config = useRuntimeConfig();

  const client = new Client();
  client
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProject);

  client.setSession(session);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    Query,
  };
};
