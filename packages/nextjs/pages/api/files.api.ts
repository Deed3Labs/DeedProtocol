import pinataSDK from "@pinata/sdk";
import axios from "axios";
import formidable, { IncomingForm } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import { FileInfo, FilesDb } from "~~/databases/files.db";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import { authentify, getWalletAddressFromToken } from "~~/servers/auth";

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
  },
};

const handler = (req: NextApiRequest, res: NextApiResponse<string>) => {
  if (req.method === "POST") {
    addFile(req, res);
  } else if (req.method === "GET") {
    download(req, res);
  } else {
    res.status(405).send("Method Not Supported");
  }
};

/**
 * Add a new file to the database if isPublic is false, otherwise add it to IPFS.
 */
const addFile = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const { isRestricted } = req.query;
  const form = new IncomingForm();

  const walletAddress = getWalletAddressFromToken(req);

  if (!walletAddress) {
    res.status(401).send("Error: Unauthorized");
    return;
  }

  form.parse(req, async (error, fields, files) => {
    try {
      if (error) {
        console.error(error);
        res.status(500).send("Upload Error");
      } else {
        const file = files.file![0];
        const stream = fs.createReadStream(file.filepath);
        let response;
        if (isRestricted) {
          // Push the file to the database
          response = await FilesDb.createFile(stream, fields.name![0], {
            ...file,
            owner: walletAddress,
          });
        } else {
          // Push the file to IPFS
          const options = {
            pinataMetadata: {
              name: fields.name![0],
              description: fields.description![0],
            },
          };
          response = (await pinata.pinFileToIPFS(stream, options)).IpfsHash;
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

const download = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const { fileId, isRestricted } = req.query;
  let stream: Readable;
  let fileInfo: FileInfo;

  if (!fileId || typeof fileId !== "string") {
    res.status(400).send("Error: id is required");
    return;
  }

  if (isRestricted === "true") {
    // Get the file from database
    const response = await FilesDb.downloadFile(fileId);
    stream = response.stream;
    fileInfo = response.fileInfo;
    if (
      !authentify(req, res, {
        requireSpecificAddress: fileInfo.owner,
      })
    ) {
      return;
    }
    res.setHeader("Content-Type", fileInfo.mimetype ?? "application/octet-stream");
  } else {
    const filePath = `${process.env.NEXT_PINATA_GATEWAY}/ipfs/${fileId}?pinataGatewayToken=${process.env.NEXT_PINATA_GATEWAY_KEY}`;
    const { data } = await axios.get<Readable>(filePath, {
      responseType: "stream",
    });
    stream = data;
  }

  res.setHeader("Content-Disposition", `attachment; filename="${fileId}"`);

  stream.pipe(res);
};

export default withErrorHandler(handler);
