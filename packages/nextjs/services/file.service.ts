import { cloneDeep } from "lodash-es";
import { FileClient } from "~~/clients/file.client";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { FileKeyValueLabel } from "~~/models/file.model";

const fileClient = new FileClient();

export async function uploadFiles(
  authToken: string,
  data: DeedInfoModel,
  old?: DeedInfoModel,
  publish: boolean = false,
  isDraft: boolean = false,
) {
  fileClient.authentify(authToken);

  const toBeUploaded = getSupportedFiles(data, old, publish, isDraft);

  const payload = cloneDeep(data);

  await Promise.all(
    toBeUploaded
      .filter(x => !!x.value && (!x.restricted || !publish))
      .map(async ({ key, label, value: files }) => {
        return Promise.all(
          files.map(async fileDatum => {
            let fileId;
            if (publish) {
              fileId = await fileClient.publish(fileDatum, label);
            } else {
              fileId = await fileClient.uploadFile(fileDatum, label);
            }

            // @ts-ignore when array, key[2] is the index
            if (key[2] !== undefined) payload[key[0]][key[1]][key[2]].fileId = fileId;
            // @ts-ignore
            else payload[key[0]][key[1]].fileId = fileId;
          }),
        );
      }),
  ).catch(error => {
    throw error;
  });

  return cleanObject(payload) as DeedInfoModel;
}

// export async function fetchFileInfos(deedData: DeedInfoModel, authToken?: string) {
//   const files = getSupportedFiles(deedData);
//   await Promise.all(
//     files.map(async ({ key, label, value }) => {
//       try {
//         const fileId = typeof value === "string" ? value : value.fileId;
//         const info = await fileClient.authentify(authToken).getFileInfo(fileId);
//         if (!info) throw new Error(`File ${label} not found`);
//         // @ts-ignore when array, key[2] is the index
//         if (key[2] !== undefined) deedData[key[0]][key[1]][key[2]] = info;
//         // @ts-ignore
//         else deedData[key[0]][key[1]] = info;
//       } catch (error) {
//         const message = "Error getting file info for " + label;
//         notification.error(message);
//         logger.error({ message: "Error getting file info for " + label, error });
//       }
//     }),
//   );

//   return deedData;
// }

export function getSupportedFiles(
  data: DeedInfoModel,
  old?: DeedInfoModel,
  publish: boolean = false,
  isDraft: boolean = false,
): FileKeyValueLabel[] {
  const files: FileKeyValueLabel[] = [];

  // Owner informations files
  if (
    data.ownerInformation.ids &&
    (!old || old.ownerInformation.ids !== data.ownerInformation.ids)
  ) {
    files.push({
      key: ["ownerInformation", "ids"],
      label: "ID or Passport",
      value: [data.ownerInformation.ids],
      restricted: true,
    });
  }
  if (
    data.ownerInformation.proofBill &&
    (!old || old.ownerInformation.proofBill !== data.ownerInformation.proofBill)
  ) {
    files.push({
      key: ["ownerInformation", "proofBill"],
      label: "Utility Bill or Other Document",
      value: [data.ownerInformation.proofBill],
      restricted: true,
    });
  }

  if (data.ownerInformation.ownerType === "legal") {
    if (
      data.ownerInformation.articleIncorporation &&
      (!old ||
        old.ownerInformation.articleIncorporation !== data.ownerInformation.articleIncorporation)
    ) {
      files.push({
        key: ["ownerInformation", "articleIncorporation"],
        label: "Article of Incorporation",
        value: [data.ownerInformation.articleIncorporation],
        restricted: true,
      });
    }

    if (
      data.ownerInformation.operatingAgreement &&
      (!old || old.ownerInformation.operatingAgreement !== data.ownerInformation.operatingAgreement)
    ) {
      files.push({
        key: ["ownerInformation", "operatingAgreement"],
        label: "Operating Agreement",
        value: [data.ownerInformation.operatingAgreement],
        restricted: true,
      });
    }

    if (
      data.ownerInformation.supportingDoc?.length &&
      (data.ownerInformation.supportingDoc.find(x => !x.fileId) || !old)
    ) {
      files.push({
        key: ["ownerInformation", "supportingDoc"],
        label: "Any other Supporting Documents",
        value: data.ownerInformation.supportingDoc,
        restricted: true,
      });
    }
  }

  // Property details files
  if (
    data.propertyDetails.propertyImages?.length &&
    (data.propertyDetails.propertyImages.find(x => !x.fileId) || !old)
  ) {
    files.push({
      key: ["propertyDetails", "propertyImages"],
      label: "Property Images",
      value: data.propertyDetails.propertyImages,
      restricted: publish ? false : isDraft,
    });
  }

  if (
    data.propertyDetails.propertyDeedOrTitle &&
    (!old || old.propertyDetails.propertyDeedOrTitle !== data.propertyDetails.propertyDeedOrTitle)
  )
    files.push({
      key: ["propertyDetails", "propertyDeedOrTitle"],
      label: "Deed or Title",
      value: [data.propertyDetails.propertyDeedOrTitle],
      restricted: true,
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
      value: [data.propertyDetails.propertyPurchaseContract],
      restricted: true,
    });
  }

  if (
    data.propertyDetails.stateFillings &&
    data.propertyDetails.stateFillings.find(x => x.fileId)
  ) {
    files.push({
      key: ["propertyDetails", "stateFillings"],
      label: "State & County Fillings",
      value: data.propertyDetails.stateFillings,
      restricted: true,
    });
  }

  if (data.agreement && (!old || old.agreement !== data.agreement)) {
    files.push({
      key: ["agreement", undefined],
      label: "Agreement",
      value: [data.agreement],
      restricted: true,
    });
  }

  if (data.process && (!old || old.process !== data.process)) {
    files.push({
      key: ["process", undefined],
      label: "Process",
      value: [data.process],
      restricted: true,
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
