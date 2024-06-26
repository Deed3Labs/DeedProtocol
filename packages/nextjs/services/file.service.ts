import { cloneDeep } from "lodash-es";
import { FileClient } from "~~/clients/files.client";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { FileFieldKeyLabel } from "~~/models/file.model";

export async function uploadFiles(
  fileClient: FileClient,
  authToken: string,
  data: DeedInfoModel,
  old?: DeedInfoModel,
  publish: boolean = false,
  isMinted: boolean = false,
) {
  const toBeUploaded = getSupportedFiles(data, old, publish, isMinted);

  const payload = cloneDeep(data);

  await Promise.all(
    toBeUploaded
      .filter(x => !!x.getFile(data) && (!x.restricted || !publish))
      .map(async x => {
        const files = x.getFile(data);
        return Promise.all(
          files.map(async (fileDatum, i) => {
            let fileId;
            if (publish) {
              fileId = await fileClient.publish(fileDatum, x.label);
            } else {
              fileId = await fileClient.uploadFile(fileDatum, x.label);
            }

            // @ts-ignore
            if (x.multiple) payload[x.key[0]][x.key[1]][i].fileId = fileId;
            // @ts-ignore
            else payload[x.key[0]][x.key[1]].fileId = fileId;
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
  isMinted: boolean = false,
  includeAll: boolean = false,
): FileFieldKeyLabel[] {
  const files: FileFieldKeyLabel[] = [];

  // Owner informations files
  if (
    includeAll ||
    (data.ownerInformation.ids && (!old || old.ownerInformation.ids !== data.ownerInformation.ids))
  ) {
    files.push(
      new FileFieldKeyLabel({
        key: ["ownerInformation", "ids"],
        label: "ID or Passport",
        multiple: false,
        restricted: true,
      }),
    );
  }
  if (
    includeAll ||
    (data.ownerInformation.proofBill &&
      (!old || old.ownerInformation.proofBill !== data.ownerInformation.proofBill))
  ) {
    files.push(
      new FileFieldKeyLabel({
        key: ["ownerInformation", "proofBill"],
        label: "Utility Bill or Other Document",
        multiple: false,
        restricted: true,
      }),
    );
  }

  if (data.ownerInformation.ownerType === "legal") {
    if (
      includeAll ||
      (data.ownerInformation.articleIncorporation &&
        (!old ||
          old.ownerInformation.articleIncorporation !== data.ownerInformation.articleIncorporation))
    ) {
      files.push(
        new FileFieldKeyLabel({
          key: ["ownerInformation", "articleIncorporation"],
          label: "Article of Incorporation",
          multiple: false,
          restricted: true,
        }),
      );
    }

    if (
      includeAll ||
      (data.ownerInformation.operatingAgreement &&
        (!old ||
          old.ownerInformation.operatingAgreement !== data.ownerInformation.operatingAgreement))
    ) {
      files.push(
        new FileFieldKeyLabel({
          key: ["ownerInformation", "operatingAgreement"],
          label: "Operating Agreement",
          multiple: false,
          restricted: true,
        }),
      );
    }

    if (
      includeAll ||
      (data.ownerInformation.supportingDoc?.length &&
        (data.ownerInformation.supportingDoc.find(x => !x.fileId) || !old))
    ) {
      files.push(
        new FileFieldKeyLabel({
          key: ["ownerInformation", "supportingDoc"],
          label: "Any other Supporting Documents",
          multiple: false,
          restricted: true,
        }),
      );
    }
  }

  // Property details files
  if (
    includeAll ||
    (data.propertyDetails.propertyImages?.length &&
      (data.propertyDetails.propertyImages.find(x => !x.fileId) || !old))
  ) {
    files.push(
      new FileFieldKeyLabel({
        key: ["propertyDetails", "propertyImages"],
        label: "Property Images",
        multiple: true,
        restricted: publish ? false : !isMinted,
      }),
    );
  }

  if (
    includeAll ||
    (data.propertyDetails.propertyDeedOrTitle &&
      (!old ||
        old.propertyDetails.propertyDeedOrTitle !== data.propertyDetails.propertyDeedOrTitle))
  )
    files.push(
      new FileFieldKeyLabel({
        key: ["propertyDetails", "propertyDeedOrTitle"],
        label: "Deed or Title",
        multiple: false,
        restricted: true,
      }),
    );

  if (
    includeAll ||
    (data.propertyDetails.propertyPurchaseContract &&
      (!old ||
        old.propertyDetails.propertyPurchaseContract !==
          data.propertyDetails.propertyPurchaseContract))
  ) {
    files.push(
      new FileFieldKeyLabel({
        key: ["propertyDetails", "propertyPurchaseContract"],
        label: "Purchase Contract",
        multiple: false,
        restricted: true,
      }),
    );
  }

  if (
    includeAll ||
    (data.propertyDetails.stateFillings && data.propertyDetails.stateFillings.find(x => x.fileId))
  ) {
    files.push(
      new FileFieldKeyLabel({
        key: ["propertyDetails", "stateFillings"],
        label: "State & County Fillings",
        multiple: true,
        restricted: true,
      }),
    );
  }

  if (includeAll || (data.agreement && (!old || old.agreement !== data.agreement))) {
    files.push(
      new FileFieldKeyLabel({
        key: ["agreement", undefined],
        label: "Agreement",
        multiple: true,
        restricted: true,
      }),
    );
  }

  if (includeAll || (data.process && (!old || old.process !== data.process))) {
    files.push(
      new FileFieldKeyLabel({
        key: ["process", undefined],
        label: "Process",
        multiple: true,
        restricted: true,
      }),
    );
  }

  if (includeAll || (data.process && (!old || old.process !== data.process))) {
    files.push(
      new FileFieldKeyLabel({
        key: ["documentNotorization", undefined],
        label: "Document Notorization",
        multiple: true,
        restricted: true,
      }),
    );
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
