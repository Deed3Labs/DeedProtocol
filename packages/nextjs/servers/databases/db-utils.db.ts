import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.NEXT_MANGODB_CONNECTION_STRING!;
const dbName = "Deed3";

export const dbClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const deedDB = dbClient.db(dbName);
