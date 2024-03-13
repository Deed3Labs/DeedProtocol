import { DbBase } from "./db-utils.db";
import { ObjectId } from "mongodb";
import { DeedInfoModel } from "~~/models/deed-info.model";

export class RegistrationDb extends DbBase {
  private static collection = this.deedDB.collection("Registrations");

  static async saveRegistration(registration: DeedInfoModel) {
    if (registration.id !== undefined) {
      await this.collection.deleteOne({ _id: new ObjectId(registration.id) });
      // @ts-ignore
      registration._id = new ObjectId(registration.id);
    }
    const result = await this.collection.insertOne({ ...registration, timestamp: new Date() });
    return result.insertedId.toString().replaceAll('"', "");
  }

  static async getRegistration(id: string): Promise<DeedInfoModel | null> {
    const result = await this.collection.findOne({ _id: new ObjectId(id) });
    // const result = JSON.parse(
    //   '{"_id":"65ede5e3444b57d53e2f412d","otherInformation":{"wrapper":"trust"},"ownerInformation":{"ownerType":"individual","ownerName":"Yardley Fitzpatrick","ownerSuffix":"Praesentium delectus","ids":{"fileName":"0_ids.jpg","restricted":true,"size":79507,"mimetype":"image/jpeg","metadata":{},"fileId":"65ede5e2444b57d53e2f4127"}},"propertyDetails":{"propertyType":"realEstate","propertyAddress":"123 main street, US 92401","propertyCity":"Montreal","propertySize":"50 Acres","propertyState":"PA","propertySubType":"appartement","propertyZoning":"mixed","propertyDeedOrTitle":{"fileName":"6_deed.pdf","restricted":true,"size":195472,"mimetype":"application/pdf","metadata":{},"fileId":"65ede5e2444b57d53e2f4128"},"propertyImages":[{"fileName":"4_other-document.jpg","restricted":true,"size":1662490,"mimetype":"image/jpeg","metadata":{},"fileId":"65edeb89444b57d53e2f412e"}]},"paymentInformation":{"paymentType":"crypto","stableCoin":"0x2B4987D22648CB0B7C062b03d91147478A95b52b"},"owner":"0x07AD02e0C1FA0b09fC945ff197E18e9C256838c6","timestamp":"2024-03-10T17:20:00.355Z","id":"65ede5e3444b57d53e2f412d"}',
    // );
    if (result) {
      result.id = result._id.toString().replaceAll('"', "");
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
