import { useScaffoldContractWrite } from "../../scaffold-eth";
import { TransactionReceipt } from "viem";
import useDeedClient from "~~/clients/deeds.client";
import useFileClient from "~~/clients/files.client";
import { PropertyTypeOptions } from "~~/constants";
import useWallet from "~~/hooks/useWallet";
import { DeedInfoModel, OpenSeaMetadata } from "~~/models/deed-info.model";
import { uploadFiles } from "~~/services/file.service";
import logger from "~~/services/logger.service";
import { indexOfLiteral } from "~~/utils/extract-values";
import { notification } from "~~/utils/scaffold-eth";

const useDeedMint = (onConfirmed?: (txnReceipt: TransactionReceipt) => void) => {
  const { primaryWallet, authToken } = useWallet();
  const fileClient = useFileClient();
  const registrationsClient = useDeedClient();

  const contractWriteHook = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "mintAsset",
    args: [] as any, // Will be filled in by write()
    onBlockConfirmation: onConfirmed,
  });

  const writeAsync = async (data: DeedInfoModel) => {
    if (!primaryWallet || !authToken) {
      notification.error("No wallet connected");
      return;
    }

    const toastId = notification.loading("Publishing documents...");
    let hash;
    let payload: DeedInfoModel & OpenSeaMetadata;
    try {
      payload = await uploadFiles(fileClient, authToken, data, undefined, true);
      if (!payload) return;
      payload = updateNFTMetadata(payload); // Update OpenSea metadata
      payload.isValidated = true;
      hash = await fileClient.uploadJson(payload);
    } catch (error) {
      notification.error("Error while publishing documents");
      logger.error({ message: "[Deed Mint] Error while publishing documents", error });
      return null;
    } finally {
      notification.remove(toastId);
    }
    if (!hash) return;

    const mintNotif = notification.info("Minting...", {
      duration: Infinity,
    });
    try {
      await contractWriteHook.writeAsync({
        args: [
          data.ownerInformation.walletAddress,
          hash.toString(),
          indexOfLiteral(PropertyTypeOptions, data.propertyDetails.propertyType),
        ],
      });

      // Save the current state of published documents
      await registrationsClient.saveDeed(payload);
    } catch (error) {
      notification.error("Error while minting deed");
      logger.error({ message: "Error while minting deed", error });

      return;
    } finally {
      notification.remove(mintNotif);
    }
  };

  return { ...contractWriteHook, writeAsync };
};

export default useDeedMint;

export const updateNFTMetadata = (data: DeedInfoModel & OpenSeaMetadata) => {
  // Fill NFT metadata as OpenSea standard
  data.name = `${data.propertyDetails.propertyAddress}, ${data.propertyDetails.propertyCity},
   ${data.propertyDetails.propertyState}`;
  data.description = data.propertyDetails.propertyDescription;
  data.image = data.propertyDetails.propertyImages?.[0].fileId;
  data.external_url = `https://app.deed3.io/overview/${data.id}`;
  data.attributes = [
    { trait_type: "Type", value: data.propertyDetails.propertyType },
    { trait_type: "Address", value: data.propertyDetails.propertyAddress },
  ];

  if (data.propertyDetails.propertySize)
    data.attributes.push({ trait_type: "Size", value: data.propertyDetails.propertySize });
  if (data.propertyDetails.propertyBathrooms)
    data.attributes.push({
      trait_type: "Bathrooms",
      value: data.propertyDetails.propertyBathrooms,
    });
  if (data.propertyDetails.propertyBedrooms)
    data.attributes.push({ trait_type: "Bedrooms", value: data.propertyDetails.propertyBedrooms });
  if (data.propertyDetails.propertyZoning)
    data.attributes.push({ trait_type: "Zoning", value: data.propertyDetails.propertyZoning });
  if (data.propertyDetails.propertySquareFootage)
    data.attributes.push({
      trait_type: "Square Footage",
      value: data.propertyDetails.propertySquareFootage,
    });
  if (data.propertyDetails.propertyHouseType)
    data.attributes.push({
      trait_type: "House Type",
      value: data.propertyDetails.propertyHouseType,
    });
  if (data.propertyDetails.propertyBuildYear)
    data.attributes.push({
      trait_type: "Build Year",
      value: data.propertyDetails.propertyBuildYear,
    });
  if (data.propertyDetails.vehicleMake)
    data.attributes.push({ trait_type: "Vehicle Make", value: data.propertyDetails.vehicleMake });
  if (data.propertyDetails.vehicleModel)
    data.attributes.push({ trait_type: "Vehicle Model", value: data.propertyDetails.vehicleModel });
  if (data.propertyDetails.yearOfManufacture)
    data.attributes.push({
      trait_type: "Year of Manufacture",
      value: data.propertyDetails.yearOfManufacture,
    });
  if (data.propertyDetails.currentMileage)
    data.attributes.push({
      trait_type: "Current Mileage",
      value: data.propertyDetails.currentMileage,
    });

  return data;
};
