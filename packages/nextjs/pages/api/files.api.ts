import pinataSDK from "@pinata/sdk";
import axios from "axios";
import { IncomingForm } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import { FilesDb } from "~~/databases/files.db";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import { FileModel } from "~~/models/file.model";
import { authentify, getWalletAddressFromToken, testEncryption } from "~~/servers/auth";
import logger from "~~/services/logger.service";

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

const handler = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  if (!(await testEncryption(res))) return;
  if (req.method === "POST") {
    if (req.query.publish === "true") {
      // Publish the file to IPFS
      return await publishFile(req, res);
    } else if (req.query.isJson) {
      return await uploadJson(req, res);
    } else {
      return await uploadFile(req, res);
    }
  } else if (req.method === "GET") {
    if (req.query.download === "true") {
      return await download(req, res);
    } else {
      return await getFileInfo(req, res);
    }
  } else {
    return res.status(405).send("Method Not Supported");
  }
};

/**
 * Add a new file to the database if isPublic is false, otherwise add it to IPFS.
 */
const uploadFile = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const form = new IncomingForm();

  const walletAddress = getWalletAddressFromToken(req);

  if (!walletAddress) {
    return res.status(401).send("Error: Unauthorized");
  }

  form.parse(req, async (error, fields, files) => {
    try {
      if (error) {
        logger.error(error);
        return res.status(500).send("Upload Error");
      }
      const file: FileModel = fields.payload ? JSON.parse(fields.payload[0]) : {};
      const fileInfo = files.file![0];

      const stream = fs.createReadStream(fileInfo.filepath);
      let response;
      if (file.restricted) {
        // Push the file to the database
        response = await FilesDb.createFile(stream, {
          fileName: file.fileName,
          mimetype: fileInfo.mimetype,
          size: fileInfo.size,
          owner: walletAddress,
          restricted: file.restricted,
          timestamp: new Date(),
        } satisfies Omit<FileModel, "fileId">);
      } else {
        // Push the file to IPFS
        const options = {
          pinataMetadata: {
            name: file.fileName![0],
            description: `
            - Owner ${file.owner}
            - DB File ID ${file.fileId}
            - Timestamp ${new Date().toISOString()}`,
          },
        };
        response = (await pinata.pinFileToIPFS(stream, options)).IpfsHash;
        await FilesDb.saveFileInfo({
          mimetype: fileInfo.mimetype,
          fileName: file.fileName,
          owner: walletAddress,
          size: fileInfo.size,
          fileId: response,
          timestamp: new Date(),
        });
      }
      fs.unlinkSync(fileInfo.filepath);
      return res.status(200).send(response);
    } catch (error) {
      logger.error(error);
      return res.status(500).send("Server Error");
    }
  });
};

const uploadJson = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const payload = JSON.parse(Buffer.from(req.read()).toString()) as File;
  const response = await pinata.pinJSONToIPFS(payload);
  const ipfsHash = response.IpfsHash;
  return res.status(200).send(ipfsHash);
};

const publishFile = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  // Get the file from database
  const file = JSON.parse(Buffer.from(req.read()).toString()) as FileModel;
  const dbFile = await FilesDb.downloadFile(file.fileId);
  const stream = dbFile.stream;
  if (!authentify(req, res, ["Validator"])) {
    return;
  }

  // Push the file to IPFS
  const options = {
    pinataMetadata: {
      name: dbFile.fileInfo.fileName,
      description: dbFile.fileInfo.fileId.toString().replaceAll('"', ""),
    },
  };
  const ipfsHash = (await pinata.pinFileToIPFS(stream, options)).IpfsHash;

  // Maybe Delete the file from database
  // await FilesDb.deleteFile(dbFile.fileInfo);

  // Update the file in database
  await FilesDb.saveFileInfo({ ...dbFile.fileInfo, fileId: ipfsHash, restricted: false });

  return res.status(200).send(ipfsHash);
};

const download = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const { fileId } = req.query;
  let stream: Readable;
  let fileInfo: FileModel;

  if (!fileId || typeof fileId !== "string") {
    return res.status(400).send("Error: id is required");
  }

  fileInfo = await FilesDb.getFileInfo(fileId);

  if (fileInfo.restricted) {
    // Get the file from database
    const response = await FilesDb.downloadFile(fileId);
    stream = response.stream;
    fileInfo = response.fileInfo;
    if (!authentify(req, res, [fileInfo.owner, "Validator"])) {
      return;
    }
  } else {
    let gateway = process.env.NEXT_PINATA_GATEWAY;
    if (!gateway?.endsWith("/")) {
      gateway += "/";
    }
    const filePath = `${gateway}ipfs/${fileId}?pinataGatewayToken=${process.env.NEXT_PINATA_GATEWAY_KEY}`;
    const { data } = await axios.get<Readable>(filePath, {
      responseType: "stream",
    });
    stream = data;
  }

  res.setHeader("Content-Type", fileInfo.mimetype ?? "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename=${fileInfo.fileName}`);

  return stream.pipe(res);
};

export const getFileInfo = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const { fileId } = req.query;

  if (!fileId || typeof fileId !== "string") {
    return res.status(400).send("Error: id is required");
  }

  const fileInfo = await FilesDb.getFileInfo(fileId);

  if ("_id" in fileInfo) {
    delete fileInfo._id;
  }
  const response = JSON.stringify(fileInfo);
  return res.status(200).json(response);
};

export default withErrorHandler(handler);
