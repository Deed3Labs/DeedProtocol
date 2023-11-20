import pinataSDK from "@pinata/sdk";
import formidable from "formidable";
import fs from "fs";
import { IncomingMessage } from "http";
import { getEnvVar } from "~~/utils/env";

const pinata = new pinataSDK({ pinataJWTKey: getEnvVar("PINATA_TOKEN") });

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (file: formidable.File) => {
  try {
    const stream = fs.createReadStream(file.filepath);
    const options = {
      pinataMetadata: {
        name: file.originalFilename,
      },
    };
    const response = await pinata.pinFileToIPFS(stream, options);
    fs.unlinkSync(file.filepath);

    return response;
  } catch (error) {
    throw error;
  }
};

export default async function handler(req: IncomingMessage, res: any) {
  if (req.method === "POST") {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        if (err) {
          console.log({ err });
          return res.status(500).send("Upload Error");
        }
        if (!files || !files.file) {
          return res.status(400).send("No file uploaded");
        }
        // @ts-ignore
        const response = await saveFile(files.file);
        const { IpfsHash } = response;

        return res.send(IpfsHash);
      });
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  } else if (req.method === "GET") {
    try {
      const response = await pinata.pinList({ pageLimit: 1 });
      res.json(response.rows[0]);
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  }
}
