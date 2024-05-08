import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.NEXT_MANGODB_CONNECTION_STRING!;
const dbName = "Deed3";

export class DbBase {
  protected static dbClient = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    maxPoolSize: 50,
  });

  protected static deedDB = this.dbClient.db(dbName);
}
