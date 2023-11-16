import { useScaffoldContractWrite } from "../scaffold-eth";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { dagJson } from "@helia/dag-json";
import { createHelia } from "helia";
import { toHex } from "viem";
import { PropertyTypeOptions } from "~~/constants";
import PropertyRegistrationModel from "~~/models/property-registration.model";
import { indexOfLiteral } from "~~/utils/extract-values";

export const useDeedNftMint = () => {
  const { primaryWallet } = useDynamicContext();

  const contractWritePayload = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "mintAsset",
    args: [] as any, // Will be filled in by write()
  });

  const writeAsync = async (data: PropertyRegistrationModel) => {
    const helia = await createHelia();
    const jsonNode = dagJson(helia);
    const ids = await jsonNode.add(data.ids);
    const proofBill = await jsonNode.add(data.proofBill);
    const articleIncorporation = await jsonNode.add(data.articleIncorporation);
    const operatingAgreement = await jsonNode.add(data.operatingAgreement);
    const supportingDoc = await jsonNode.add(data.supportingDoc);

    if (!primaryWallet) {
      throw new Error("Not connected");
    }

    const propertyHash = await jsonNode.add({
      ...data,
      ids,
      proofBill,
      articleIncorporation,
      operatingAgreement,
      supportingDoc,
    });

    await contractWritePayload.writeAsync({
      args: [
        primaryWallet.address,
        toHex(propertyHash.toString()),
        indexOfLiteral(PropertyTypeOptions, data.propertyType),
        data.propertyAddress,
      ],
    });
  };

  return { ...contractWritePayload, writeAsync };
};
