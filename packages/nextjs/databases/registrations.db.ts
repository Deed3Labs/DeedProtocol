import { DbBase } from "./db-utils.db";
import { ObjectId } from "mongodb";
import { DeedInfoModel } from "~~/models/deed-info.model";

export class RegistrationDb extends DbBase {
  private static collection = this.deedDB.collection("Registrations");

  static async saveRegistration(registration: DeedInfoModel) {
    const entry = { ...registration, lastModified: new Date() } as any;
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

  static async getRegistration(id: string): Promise<DeedInfoModel | null> {
    const result = await this.collection.findOne({ _id: new ObjectId(id) });
    if (result) {
      result.id = result._id.toString().replaceAll('"', "");
      result.registrationId = result.id;
    }
    return result as unknown as DeedInfoModel;
  }

  static async getAllRegistrations(): Promise<DeedInfoModel[]> {
    const result = await this.collection.find().toArray();
    return result.map(x => {
      x.id = x._id.toString().replaceAll('"', "");
      return x;
    }) as unknown as DeedInfoModel[];
  }
}
