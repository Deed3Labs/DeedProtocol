import { DbBase } from "./db-utils.db";
import { DeedDb } from "./deeds.db";
import { FeesModel } from "~~/models/fees.model";

export class FeesnDb extends DbBase {
  private static collection = this.deedDB.collection("Fees");

  static async getFees(): Promise<FeesModel> {
    const result = await this.collection
      .find(
        {
          chainId: DeedDb.getChainId(),
        },
        {},
      )
      .sort({ createdOn: -1 })
      .limit(1)
      .toArray();
    return (result[0] as FeesModel) ?? {};
  }

  static async saveFees(fees: FeesModel) {
    // @ts-ignore
    delete fees._id;
    await this.collection.insertOne({
      ...fees,
      chainId: DeedDb.getChainId(),
      createdOn: new Date(),
    });
  }
}
