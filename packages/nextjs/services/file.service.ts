import logger from "./logger.service";
import { cloneDeep } from "lodash-es";
import { FileClient } from "~~/clients/file.client";
import {
  DeedInfoModel,
  OtherInformationModel,
  OwnerInformationModel,
  PropertyDetailsModel,
} from "~~/models/deed-info.model";
import { FileModel } from "~~/models/file.model";
import { notification } from "~~/utils/scaffold-eth";

const fileClient = new FileClient();

export async function uploadFiles(
  authToken: string,
  data: DeedInfoModel,
  old?: DeedInfoModel,
  publish: boolean = false,
) {
  fileClient.authentify(authToken);

  const toBeUploaded = getSupportedFiles(data, old);

  const payload = cloneDeep(data);

  await Promise.all(
    toBeUploaded
      .filter(x => !!x.value && (!x.value.restricted || !publish))
      .map(async ({ key, label, value }) => {
        let fileId;
        if (publish) {
          fileId = await fileClient.publish(value, label);
        } else {
          fileId = await fileClient.uploadFile(value, label);
        }

        // @ts-ignore when array, key[2] is the index
        if (key[2] !== undefined) payload[key[0]][key[1]][key[2]] = fileId;
        // @ts-ignore
        else payload[key[0]][key[1]] = fileId;
      }),
  ).catch(error => {
    throw error;
  });

  return cleanObject(payload) as DeedInfoModel;
}

export async function fetchFileInfos(deedData: DeedInfoModel, authToken?: string) {
  const files = getSupportedFiles(deedData);
  await Promise.all(
    files.map(async ({ key, label, value }) => {
      try {
        const fileId = typeof value === "string" ? value : value.fileId;
        const info = await fileClient.authentify(authToken).getFileInfo(fileId);
        if (!info) throw new Error(`File ${label} not found`);
        // @ts-ignore when array, key[2] is the index
        if (key[2] !== undefined) deedData[key[0]][key[1]][key[2]] = info;
        // @ts-ignore
        else deedData[key[0]][key[1]] = info;
      } catch (error) {
        const message = "Error getting file info for " + label;
        notification.error(message);
        logger.error({ message: "Error getting file info for " + label, error });
      }
    }),
  );

  return deedData;
}

function getSupportedFiles(data: DeedInfoModel, old?: DeedInfoModel) {
  const files: {
    key: [
      keyof DeedInfoModel,
      keyof OwnerInformationModel | keyof PropertyDetailsModel | keyof OtherInformationModel,
      number?,
    ];
    label: string;
    value: FileModel;
  }[] = [];

  // Owner informations files
  if (
    data.ownerInformation.ids &&
    (!old || old.ownerInformation.ids !== data.ownerInformation.ids)
  ) {
    files.push({
      key: ["ownerInformation", "ids"],
      label: "ID or Passport",
      value: data.ownerInformation.ids,
    });
  }
  if (
    data.ownerInformation.proofBill &&
    (!old || old.ownerInformation.proofBill !== data.ownerInformation.proofBill)
  ) {
    files.push({
      key: ["ownerInformation", "proofBill"],
      label: "Utility Bill or Other Document",
      value: data.ownerInformation.proofBill,
    });
  }
  if (
    data.ownerInformation.articleIncorporation &&
    (!old ||
      old.ownerInformation.articleIncorporation !== data.ownerInformation.articleIncorporation)
  ) {
    files.push({
      key: ["ownerInformation", "articleIncorporation"],
      label: "Article of Incorporation",
      value: data.ownerInformation.articleIncorporation,
    });
  }

  if (
    data.ownerInformation.operatingAgreement &&
    (!old || old.ownerInformation.operatingAgreement !== data.ownerInformation.operatingAgreement)
  ) {
    files.push({
      key: ["ownerInformation", "operatingAgreement"],
      label: "Operating Agreement",
      value: data.ownerInformation.operatingAgreement,
    });
  }

  if (data.ownerInformation.supportingDoc?.length) {
    data.ownerInformation.supportingDoc.forEach((doc, index) => {
      if (!old || old.ownerInformation.supportingDoc?.[index] !== doc) {
        files.push({
          key: ["ownerInformation", "supportingDoc", index],
          label: "Any other Supporting Documents #" + index,
          value: doc,
        });
      }
    });
  }

  // Property details files
  if (data.propertyDetails.propertyImages?.length) {
    data.propertyDetails.propertyImages.forEach((image, index) => {
      if (!old || old.propertyDetails.propertyImages?.[index] !== image) {
        files.push({
          key: ["propertyDetails", "propertyImages", index],
          label: "Property Images #" + index,
          value: image,
        });
      }
    });
  }

  if (
    data.propertyDetails.propertyDeedOrTitle &&
    (!old || old.propertyDetails.propertyDeedOrTitle !== data.propertyDetails.propertyDeedOrTitle)
  )
    files.push({
      key: ["propertyDetails", "propertyDeedOrTitle"],
      label: "Deed or Title",
      value: data.propertyDetails.propertyDeedOrTitle,
    });

  if (
    data.propertyDetails.propertyPurchaseContract &&
    (!old ||
      old.propertyDetails.propertyPurchaseContract !==
        data.propertyDetails.propertyPurchaseContract)
  ) {
    files.push({
      key: ["propertyDetails", "propertyPurchaseContract"],
      label: "Purchase Contract",
      value: data.propertyDetails.propertyPurchaseContract,
    });
  }

  return files;
}

function cleanObject(obj: any) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === "object") cleanObject(obj[key]);
    else if (obj[key] === undefined) delete obj[key]; // or set to null
  });
  return obj;
}
