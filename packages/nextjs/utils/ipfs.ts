import pinataSDK from "@pinata/sdk";
import axios from "axios";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const pinataBody = {
    options: {
      cidVersion: 0,
    },
    metadata: {
      name: file.name,
    },
  };
  formData.append("pinataOptions", JSON.stringify(pinataBody.options));
  formData.append("pinataMetadata", JSON.stringify(pinataBody.metadata));
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  const res = await axios.post(url, formData, {
    headers: {
      // @ts-ignore
      "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_TOKEN}`,
    },
  });

  return res.data.IpfsHash;
};

export const uploadJson = async (object: any) => {
  const pinata = new pinataSDK({ pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_TOKEN });
  const res = await pinata.pinJSONToIPFS(object);
  return res.IpfsHash;
};

export const retrieveFromHash = async <T = any>(hash: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${hash}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_KEY}"`,
  );
  return res.json() as T;
};
