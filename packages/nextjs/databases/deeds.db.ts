import { DbBase } from "./db-utils.db";
import { ObjectId } from "mongodb";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { PropertiesFilterModel } from "~~/models/properties-filter.model";

export class DeedDb extends DbBase {
  private static collection = this.deedDB.collection("Registrations");

  static {
    (async () => {
      // Create index if not exists
      if (!(await this.collection.listIndexes().toArray()).some(x => x.name === "search")) {
        try {
          this.collection.createIndex(
            {
              "propertyDetails.propertyState": "text",
              "propertyDetails.propertyCity": "text",
              "propertyDetails.propertyAddress": "text",
            },
            { name: "search" },
          );
        } catch (error: any) {
          // If duplicated
          if (error.codeName !== "IndexOptionsConflict") throw error;
        }
      }
    })();
  }

  static async saveDeed(registration: DeedInfoModel) {
    if (registration.isValidated == null) {
      registration.isValidated = false;
    }
    const entry = {
      ...registration,
      lastModified: new Date(),
      chainId: DeedDb.getChainId(),
    } as any;
    if (registration.id === undefined) {
      entry.createdOn = new Date();
    } else {
      delete entry._id;
    }

    const id =
      (
        await this.collection.updateOne(
          { _id: new ObjectId(registration.id) },
          { $set: entry },
          {
            upsert: true, // Create if not exists
          },
        )
      ).upsertedId
        ?.toString()
        .replaceAll('"', "") ?? registration.id;

    return id;
  }

  static async getDeed(id: string): Promise<DeedInfoModel | null> {
    const result = await this.collection.findOne({ _id: new ObjectId(id) });
    if (result) {
      result.id = result._id.toString().replaceAll('"', "");
    }
    return result as unknown as DeedInfoModel;
  }

  static async listDeeds(
    filter: PropertiesFilterModel,
    currentPage: number,
    pageSize: number,
    allMineAndPublic = false,
  ): Promise<DeedInfoModel[]> {
    const dbFilter: any = { chainId: DeedDb.getChainId() };
    if (!allMineAndPublic && filter.validated && filter.validated !== "all")
      dbFilter.isValidated = filter.validated === "true";
    if (!allMineAndPublic && filter.ownerWallet) dbFilter.owner = filter.ownerWallet;
    if (filter.propertyType && filter.propertyType != "All")
      dbFilter["propertyDetails.propertyType"] = filter.propertyType;
    if (filter.propertySize) dbFilter["propertyDetails.propertySize"] = { $regex: filter };
    if (filter.search) dbFilter.$text = { $search: filter.search + "*" };

    if (allMineAndPublic)
      dbFilter.$or = [{ isValidated: true }, { owner: filter.ownerWallet ?? "" }];

    const result = await this.collection
      .find(dbFilter, { skip: pageSize * currentPage, limit: pageSize })
      .toArray();
    return result.map(x => {
      x.id = x._id.toString().replaceAll('"', "");
      return x;
    }) as unknown as DeedInfoModel[];
  }
}
