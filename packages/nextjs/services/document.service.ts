import { cloneDeep } from "lodash-es";
import { FileClient } from "~~/clients/file.client";
import {
  DeedInfoModel,
  OtherInformationModel,
  OwnerInformationModel,
  PropertyDetailsModel,
} from "~~/models/deed-info.model";

const fileClient = new FileClient();

export async function uploadDocuments(
  authToken: string,
  data: DeedInfoModel,
  old?: DeedInfoModel,
  isDraft: boolean = false,
) {
  fileClient.authentify(authToken);

  const toBeUploaded: {
    key: [
      keyof DeedInfoModel,
      keyof OwnerInformationModel | keyof PropertyDetailsModel | keyof OtherInformationModel,
      number?,
    ];
    label: string;
    value: File;
    restricted?: boolean;
  }[] = [];

  // Owner informations files
  if (
    data.ownerInformation.ids &&
    (!old || old.ownerInformation.ids !== data.ownerInformation.ids)
  ) {
    toBeUploaded.push({
      key: ["ownerInformation", "ids"],
      label: "ID or Passport",
      value: data.ownerInformation.ids,
      restricted: true,
    });
  }
  if (
    data.ownerInformation.proofBill &&
    (!old || old.ownerInformation.proofBill !== data.ownerInformation.proofBill)
  ) {
    toBeUploaded.push({
      key: ["ownerInformation", "proofBill"],
      label: "Utility Bill or Other Document",
      value: data.ownerInformation.proofBill,
      restricted: true,
    });
  }
  if (
    !old ||
    old.ownerInformation.articleIncorporation !== data.ownerInformation.articleIncorporation
  ) {
    toBeUploaded.push({
      key: ["ownerInformation", "articleIncorporation"],
      label: "Article of Incorporation",
      value: data.ownerInformation.articleIncorporation,
      restricted: true,
    });
  }

  if (
    data.ownerInformation.operatingAgreement &&
    (!old || old.ownerInformation.operatingAgreement !== data.ownerInformation.operatingAgreement)
  ) {
    toBeUploaded.push({
      key: ["ownerInformation", "operatingAgreement"],
      label: "Operating Agreement",
      value: data.ownerInformation.operatingAgreement,
      restricted: true,
    });
  }
  if (data.ownerInformation.supportingDoc && data.ownerInformation.supportingDoc.length) {
    data.ownerInformation.supportingDoc.forEach((doc, index) => {
      if (!old || old.ownerInformation.supportingDoc?.[index] !== doc) {
        toBeUploaded.push({
          key: ["ownerInformation", "supportingDoc"],
          label: "Any other Supporting Documents #" + index,
          value: doc,
          restricted: true,
        });
      }
    });
  }

  // Property details files
  if (data.propertyDetails.propertyImages?.length) {
    data.propertyDetails.propertyImages.forEach((image, index) => {
      if (!old || old.propertyDetails.propertyImages?.[index] !== image) {
        toBeUploaded.push({
          key: ["propertyDetails", "propertyImages", index],
          label: "Property Images #" + index,
          value: image,
          restricted: isDraft,
        });
      }
    });
  }

  if (!old || old.propertyDetails.propertyDeedOrTitle !== data.propertyDetails.propertyDeedOrTitle)
    toBeUploaded.push({
      key: ["propertyDetails", "propertyDeedOrTitle"],
      label: "Deed or Title",
      value: data.propertyDetails.propertyDeedOrTitle,
      restricted: true,
    });

  if (
    data.propertyDetails.propertyPurchaseContract &&
    (!old ||
      old.propertyDetails.propertyPurchaseContract !==
        data.propertyDetails.propertyPurchaseContract)
  ) {
    toBeUploaded.push({
      key: ["propertyDetails", "propertyPurchaseContract"],
      label: "Purchase Contract",
      value: data.propertyDetails.propertyPurchaseContract,
      restricted: true,
    });
  }

  const payload = cloneDeep(data) as DeedInfoModel;

  await Promise.all(
    toBeUploaded
      .filter(x => !!x.value)
      .map(async ({ key, label, value, restricted }) => {
        const id = await fileClient.uploadFile(value, label, !!restricted);

        const newValue = {
          id,
          name: value.name,
          size: value.size,
          type: value.type,
          lastModified: value.lastModified,
          restricted,
        };
        // @ts-ignore
        if (key[2] !== undefined) payload[key[0]][key[1]][key[2]] = newValue;
        // @ts-ignore
        else payload[key[0]][key[1]] = newValue;
      }),
  );

  return cleanObject(payload);
}

function cleanObject(obj: any) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === "object") cleanObject(obj[key]);
    else if (obj[key] === undefined) delete obj[key]; // or set to null
  });
  return obj;
}
