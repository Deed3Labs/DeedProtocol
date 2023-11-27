import pinataSDK from "@pinata/sdk";
import { Fields, File, IncomingForm } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

const pinata = new pinataSDK({ pinataJWTKey: process.env.NEXT_PINATA_TOKEN });
if (!process.env.NEXT_PINATA_TOKEN) throw new Error("Missing NEXT_PINATA_TOKEN env var");

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const saveFile = async (file: File, fields: Fields) => {
  const stream = fs.createReadStream(file.filepath);
  const options = {
    pinataMetadata: {
      name: fields.name![0],
      description: fields.description![0],
    },
  };
  const response = await pinata.pinFileToIPFS(stream, options);
  fs.unlinkSync(file.filepath);

  return response;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  if (req.method === "POST") {
    try {
      const { mode } = req.query;
      if (mode === "file") {
        const form = new IncomingForm();
        form.parse(req, async (error, fields, files) => {
          try {
            if (error) {
              console.error(error);
              res.status(500).send("Upload Error");
            } else {
              const response = await saveFile(files.file![0], fields);
              res.status(200).send(response.IpfsHash);
            }
          } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
          }
        });
      } else if (mode === "json") {
        const readable = req.read();
        const buffer = Buffer.from(readable);
        const data = JSON.parse(buffer.toString());
        console.debug(data);
        const response = await pinata.pinJSONToIPFS(data);
        res.status(200).send(response.IpfsHash);
      }
    } catch (e) {
      console.error(e);
      res.status(500).send("Server Error");
    }
  } else {
    res.status(405).send("Method Not Supported");
  }
}
