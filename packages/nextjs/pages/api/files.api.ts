import pinataSDK from "@pinata/sdk";
import { IncomingForm } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import { createFile } from "~~/servers/databases/files.db";

if (!process.env.NEXT_PINATA_GATEWAY_KEY) {
  throw new Error("Missing NEXT_PINATA_GATEWAY_KEY env var");
}

const pinata = new pinataSDK(
  "0ef110c59f035fed162f",
  "17025a6e8e0c7d645551f7683df3c743d64249d8c354dd3b2b29a23c0b6990c9",
);

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const handler = (req: NextApiRequest, res: NextApiResponse<string>) => {
  if (req.method === "POST") {
    post(req, res);
  } else {
    res.status(405).send("Method Not Supported");
  }
};

/**
 * Add a new file to the database if isPublic is false, otherwise add it to IPFS.
 */
const post = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const { isPublic } = req.query;
  const form = new IncomingForm();
  form.parse(req, async (error, fields, files) => {
    try {
      if (error) {
        console.error(error);
        res.status(500).send("Upload Error");
      } else {
        const file = files.file![0];
        const stream = fs.createReadStream(file.filepath);
        let response;
        if (isPublic) {
          const options = {
            pinataMetadata: {
              name: fields.name![0],
              description: fields.description![0],
            },
          };
          response = (await pinata.pinFileToIPFS(stream, options)).IpfsHash;
        } else {
          response = await createFile(stream, fields.name![0], fields.description![0]);
        }
        fs.unlinkSync(file.filepath);
        res.status(200).send(response);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  });
};

export default withErrorHandler(handler);
