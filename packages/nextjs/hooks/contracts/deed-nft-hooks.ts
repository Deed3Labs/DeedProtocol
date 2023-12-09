import { useScaffoldContractWrite } from "../scaffold-eth";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { cloneDeep } from "lodash-es";
import { TransactionReceipt, toHex } from "viem";
import { PropertyTypeOptions } from "~~/constants";
import {
  DeedInfoModel,
  OtherInformationModel,
  OwnerInformationModel,
  PropertyDetailsModel,
} from "~~/models/deed-info.model";
import logger from "~~/services/logger";
import { indexOfLiteral } from "~~/utils/extract-values";
import { uploadFile, uploadJson } from "~~/utils/ipfs";
import { notification } from "~~/utils/scaffold-eth";

export const useDeedNftMint = (onConfirmed?: (txnReceipt: TransactionReceipt) => void) => {
  const { primaryWallet } = useDynamicContext();

  const contractWriteHook = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "mintAsset",
    args: [] as any, // Will be filled in by write()
    onBlockConfirmation: onConfirmed,
  });

  const writeAsync = async (data: DeedInfoModel) => {
    if (!primaryWallet) {
      notification.error("No wallet connected");
      return;
    }

    const hash = await uploadDocuments(data);
    if (!hash) return;

    try {
      await contractWriteHook.writeAsync({
        args: [
          primaryWallet.address,
          toHex(hash.toString()),
          indexOfLiteral(PropertyTypeOptions, data.propertyDetails.propertyType),
        ],
      });
    } catch (error) {
      notification.error("Error while minting deed");
      logger.error({ message: "Error while minting deed", error });
      return;
    }
  };

  return { ...contractWriteHook, writeAsync };
};

export const useDeedNftUpdateInfo = (onConfirmed?: (txnReceipt: TransactionReceipt) => void) => {
  const { primaryWallet } = useDynamicContext();

  const contractWriteHook = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "setIpfsDetailsHash",
    args: [] as any, // Will be filled in by write()
    onBlockConfirmation: onConfirmed,
    account: primaryWallet?.address,
  });

  const writeAsync = async (data: DeedInfoModel, deedId: number) => {
    if (!primaryWallet) {
      notification.error("No wallet connected");
      return;
    }

    const hash = await uploadDocuments(data);
    if (!hash) return;

    try {
      await contractWriteHook.writeAsync({
        args: [BigInt(deedId), hash],
      });
    } catch (error) {
      notification.error("Error while minting deed");
      logger.error({ message: "Error while minting deed", error });
      return;
    }
  };

  return { ...contractWriteHook, writeAsync };
};

export const useDeedNftValidate = () => {
  const { primaryWallet } = useDynamicContext();

  const contractWritePayload = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "setAssetValidation",
    args: [] as any, // Will be filled in by write()
  });

  const writeValidateAsync = async (deedId: number, isValidated: boolean) => {
    if (!primaryWallet) {
      notification.error("No wallet connected");
      return;
    }

    try {
      await contractWritePayload.writeAsync({
        args: [deedId as any, isValidated],
      });
    } catch (error) {
      notification.error("Error while validating deed");
      logger.error({ message: "Error while validating deed", error });
      return;
    }
  };

  return { ...contractWritePayload, writeValidateAsync };
};

export const useDeedNFTList = () => {
  // TODO: use subgraph instead
  // const [deeds, setDeeds] = useState<PropertyModel[]>([]);
  // const { data, isLoading, error } = useScaffoldEventHistory({
  //   contractName: "DeedNFT",
  //   eventName: "DeedNFTMinted",
  //   fromBlock: BigInt(deployedContracts[5].DeedNFT.startBlock),
  // });
  // useEffect(() => {
  //   console.log({ data });
  // }, [data]);
  // useEffect(() => {
  //   if (error) {
  //     logger.error({ message: "Error while fetching deeds", error });
  //   }
  // }, [error]);
  // return { deeds, isLoading };
};

async function uploadDocuments(data: DeedInfoModel) {
  try {
    const toBeUploaded: {
      key: [
        keyof DeedInfoModel,
        keyof OwnerInformationModel | keyof PropertyDetailsModel | keyof OtherInformationModel,
        number?,
      ];
      label: string;
      value: File;
    }[] = [];

    // Owner informations files
    if (data.ownerInformation.ids) {
      toBeUploaded.push({
        key: ["ownerInformation", "ids"],
        label: "ID or Passport",
        value: data.ownerInformation.ids,
      });
    }
    if (data.ownerInformation.proofBill) {
      toBeUploaded.push({
        key: ["ownerInformation", "proofBill"],
        label: "Utility Bill or Other Document",
        value: data.ownerInformation.proofBill,
      });
    }
    toBeUploaded.push({
      key: ["ownerInformation", "articleIncorporation"],
      label: "Article of Incorporation",
      value: data.ownerInformation.articleIncorporation,
    });
    if (data.ownerInformation.operatingAgreement) {
      toBeUploaded.push({
        key: ["ownerInformation", "operatingAgreement"],
        label: "Operating Agreement",
        value: data.ownerInformation.operatingAgreement,
      });
    }
    if (data.ownerInformation.supportingDoc) {
      data.ownerInformation.supportingDoc.forEach((doc, index) => {
        toBeUploaded.push({
          key: ["ownerInformation", "supportingDoc"],
          label: "Any other Supporting Documents #" + index,
          value: doc,
        });
      });
    }

    // Property details files
    if (data.propertyDetails.propertyImages?.length) {
      data.propertyDetails.propertyImages.forEach((image, index) => {
        toBeUploaded.push({
          key: ["propertyDetails", "propertyImages", index],
          label: "Property Images #" + index,
          value: image,
        });
      });
    }

    toBeUploaded.push({
      key: ["propertyDetails", "propertyDeedOrTitle"],
      label: "ID or Passport",
      value: data.propertyDetails.propertyDeedOrTitle,
    });

    if (data.propertyDetails.propertyPurchaseContract) {
      toBeUploaded.push({
        key: ["propertyDetails", "propertyPurchaseContract"],
        label: "ID or Passport",
        value: data.propertyDetails.propertyPurchaseContract,
      });
    }

    // Other informations files
    const toastId = notification.loading("Uploading documents...");

    console.log("data", JSON.stringify(data));

    await fetch("/api/deed-info", {
      body: JSON.stringify(data),
      method: "POST",
    });

    const payload = cloneDeep(data) as DeedInfoModel;
    let counter = 0;
    await Promise.all(
      toBeUploaded.map(async ({ key, label, value }) => {
        try {
          const hash = await uploadFile(value, label);
          notification.update(
            toastId,
            `Uploading documents... (${counter++}/${toBeUploaded.length})`,
          );
          const newValue = {
            hash,
            name: value.name,
            size: value.size,
            type: value.type,
            lastModified: value.lastModified,
          };
          // @ts-ignore
          if (key[2] !== undefined) payload[key[0]][key[1]][key[2]] = newValue;
          // @ts-ignore
          else payload[key[0]][key[1]] = newValue;
        } catch (error) {
          logger.error({ message: "Error while uploading documents", error });
          return;
        }
      }),
    );

    notification.remove(toastId);

    const deedInfo = cleanObject(payload);

    const hash = await uploadJson(deedInfo);

    console.debug("DeedInfo with hash: ", hash.toString(), { deedInfo });

    return hash;
  } catch (error) {
    logger.error({ message: "Error while uploading documents", error });
    return null;
  }
}

function cleanObject(obj: any) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === "object") cleanObject(obj[key]);
    else if (obj[key] === undefined) delete obj[key]; // or set to null
  });
  return obj;
}
