import { MongoClient, ServerApiVersion } from "mongodb";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

const uri = process.env.NEXT_PUBLIC_OFFLINE
  ? "mongodb://localhost:27017"
  : process.env.NEXT_MANGODB_CONNECTION_STRING!;
const dbName = "Deed3";

export class DbBase {
  protected static dbClient = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    },
    maxPoolSize: 50,
  });

  protected static getChainId() {
    return getTargetNetwork().id;
  }

  protected static deedDB = this.dbClient.db(dbName);
}
