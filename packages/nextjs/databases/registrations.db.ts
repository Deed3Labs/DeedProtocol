import { DbBase } from "./db-utils.db";
import { ObjectId } from "mongodb";
import { DeedInfoModel } from "~~/models/deed-info.model";

export class RegistrationDb extends DbBase {
  private static collection = this.deedDB.collection("Registrations");

  static async saveRegistration(registration: DeedInfoModel) {
    if (registration.id === undefined) {
      const result = await this.collection.insertOne(registration);
      return result.insertedId.toString().replaceAll('"', "");
    } else {
      await this.collection.updateOne({ id: registration.id }, registration);
      return registration.id;
    }
  }

  static async getRegistration(id: string): Promise<DeedInfoModel | null> {
    const result = await this.collection.findOne({ _id: new ObjectId(id) });
    return result as unknown as DeedInfoModel;
  }

  static async getAllRegistrations(): Promise<DeedInfoModel[]> {
    const result = await this.collection.find().toArray();
    return result as unknown as DeedInfoModel[];
  }
}
