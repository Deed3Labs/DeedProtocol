import { useScaffoldContractWrite } from "../scaffold-eth";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { toHex } from "viem";
import { PropertyTypeOptions } from "~~/constants";
import { PropertyRegistrationModel } from "~~/models/property-registration.model";
import { indexOfLiteral } from "~~/utils/extract-values";
import { uploadFile, uploadJson } from "~~/utils/ipfs";

export const useDeedNftMint = () => {
  const { primaryWallet } = useDynamicContext();

  const contractWritePayload = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "mintAsset",
    args: [] as any, // Will be filled in by write()
  });

  const writeAsync = async (data: PropertyRegistrationModel) => {
    if (!data.ownerInformation) {
      throw new Error("Missing owner information");
    }
    if (!data.propertyDetails) {
      throw new Error("Missing property details");
    }
    if (!data.otherInformation) {
      throw new Error("Missing other information");
    }

    // Owner informations docs
    const ids = await uploadFile(data.ownerInformation.ids);

    const proofBill = data.ownerInformation?.proofBill
      ? await uploadFile(data.ownerInformation?.proofBill)
      : undefined;

    const articleIncorporation = await uploadFile(data.ownerInformation.articleIncorporation);

    const operatingAgreement = data.ownerInformation?.operatingAgreement
      ? await uploadFile(data.ownerInformation.operatingAgreement)
      : undefined;

    const supportingDoc = data.ownerInformation?.supportingDoc
      ? await Promise.all(data.ownerInformation.supportingDoc.map(doc => uploadFile(doc)))
      : undefined;

    // Property details docs
    const propertyImages = data.propertyDetails?.propertyImages
      ? await uploadFile(data.propertyDetails.propertyImages)
      : undefined;

    const propertyDeedOrTitle = await uploadFile(data.propertyDetails.propertyDeedOrTitle);

    const propertyPurchaseContract = data.propertyDetails?.propertyPurchaseContract
      ? await uploadFile(data.propertyDetails.propertyPurchaseContract)
      : undefined;

    if (!primaryWallet) {
      throw new Error("Not connected");
    }

    const deedInfo = cleanObject({
      ownerInformation: {
        ...data.ownerInformation,
        ids,
        proofBill,
        articleIncorporation,
        operatingAgreement,
        supportingDoc,
      },
      propertyDetails: {
        ...data.propertyDetails,
        propertyImages,
        propertyDeedOrTitle,
        propertyPurchaseContract,
      },
      otherInformation: data.otherInformation,
    });

    const propertyHash = await uploadJson(deedInfo);
    console.log("DeedInfo with hash: ", propertyHash.toString(), { deedInfo });

    await contractWritePayload.writeAsync({
      args: [
        primaryWallet.address,
        toHex(propertyHash.toString()),
        indexOfLiteral(PropertyTypeOptions, data.propertyDetails.propertyType),
        data.propertyDetails.propertyAddress,
      ],
    });
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
