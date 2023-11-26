import { useScaffoldContractWrite } from "../scaffold-eth";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { cloneDeep } from "lodash-es";
import { toHex } from "viem";
import { PropertyTypeOptions } from "~~/constants";
import {
  OtherInformationModel,
  OwnerInformationModel,
  PropertyDetailsModel,
  PropertyRegistrationModel,
} from "~~/models/property-registration.model";
import logger from "~~/services/logger";
import { indexOfLiteral } from "~~/utils/extract-values";
import { uploadFile, uploadJson } from "~~/utils/ipfs";
import { notification } from "~~/utils/scaffold-eth";

export const useDeedNftMint = () => {
  const { primaryWallet } = useDynamicContext();

  const contractWritePayload = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "mintAsset",
    args: [] as any, // Will be filled in by write()
  });

  let propertyHash: string;

  const writeAsync = async (data: PropertyRegistrationModel) => {
    try {
      if (!primaryWallet) {
        notification.error("No wallet connected");
        return;
      }

      const toBeUploaded: {
        key: [
          keyof PropertyRegistrationModel,
          keyof OwnerInformationModel | keyof PropertyDetailsModel | keyof OtherInformationModel,
        ];
        label: string;
        value: File;
      }[] = [];

      // Owner informations files
      if (data.ownerInformation.ids)
        toBeUploaded.push({
          key: ["ownerInformation", "ids"],
          label: "ID or Passport",
          value: data.ownerInformation.ids,
        });
      if (data.ownerInformation.proofBill)
        toBeUploaded.push({
          key: ["ownerInformation", "proofBill"],
          label: "Utility Bill or Other Document",
          value: data.ownerInformation.proofBill,
        });
      toBeUploaded.push({
        key: ["ownerInformation", "articleIncorporation"],
        label: "Article of Incorporation",
        value: data.ownerInformation.articleIncorporation,
      });
      if (data.ownerInformation.operatingAgreement)
        toBeUploaded.push({
          key: ["ownerInformation", "operatingAgreement"],
          label: "Operating Agreement",
          value: data.ownerInformation.operatingAgreement,
        });
      if (data.ownerInformation.supportingDoc)
        data.ownerInformation.supportingDoc.forEach((doc, index) => {
          toBeUploaded.push({
            key: ["ownerInformation", "supportingDoc"],
            label: "Any other Supporting Documents #" + index,
            value: doc,
          });
        });

      // Property details files
      if (data.propertyDetails.propertyImages?.length)
        data.propertyDetails.propertyImages.forEach((image, index) => {
          toBeUploaded.push({
            key: ["propertyDetails", "propertyImages"],
            label: "Property Images #" + index,
            value: image,
          });
        });

      toBeUploaded.push({
        key: ["propertyDetails", "propertyDeedOrTitle"],
        label: "ID or Passport",
        value: data.propertyDetails.propertyDeedOrTitle,
      });
      if (data.propertyDetails.propertyPurchaseContract)
        toBeUploaded.push({
          key: ["propertyDetails", "propertyPurchaseContract"],
          label: "ID or Passport",
          value: data.propertyDetails.propertyPurchaseContract,
        });

      // Other informations files

      const toastId = notification.loading("Uploading documents...");
      const payload = { ...cloneDeep(data), walletAddress: primaryWallet.address };

      await Promise.all(
        toBeUploaded.map(async ({ key, label, value }, index) => {
          try {
            const hash = await uploadFile(value, label);
            notification.update(
              toastId,
              `Uploading documents... (${index + 1}/${toBeUploaded.length})`,
            );
            // @ts-ignore
            payload[key[0]][key[1]] = hash;
          } catch (error) {
            logger.error({ message: "Error while uploading documents", error });
            return;
          }
        }),
      );

      notification.remove(toastId);

      const deedInfo = cleanObject(payload);

      propertyHash = await uploadJson(deedInfo);

      console.debug("DeedInfo with hash: ", propertyHash.toString(), { deedInfo });
    } catch (error) {
      logger.error({ message: "Error while uploading documents", error });
      return;
    }

    try {
      await contractWritePayload.writeAsync({
        args: [
          primaryWallet.address,
          toHex(propertyHash.toString()),
          indexOfLiteral(PropertyTypeOptions, data.propertyDetails.propertyType),
          data.propertyDetails.propertyAddress,
        ],
      });
    } catch (error) {
      notification.error("Error while minting deed");
      logger.error({ message: "Error while minting deed", error });
      return;
    }
  };

  return { ...contractWritePayload, writeAsync };
};

function cleanObject(obj: any) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === "object") cleanObject(obj[key]);
    else if (obj[key] === undefined) delete obj[key]; // or set to null
  });
  return obj;
}
