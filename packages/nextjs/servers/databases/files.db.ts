import { deedDB } from "./db-utils.db";
import { ReadStream } from "fs";
import { GridFSBucket } from "mongodb";

export const downloadFile = (fileName: string) => {
  const bucket = new GridFSBucket(deedDB);
  const stream = bucket.openDownloadStreamByName(fileName);
  return stream;
};

export const createFile = async (stream: ReadStream, fileName: string, description: any) => {
  const bucket = new GridFSBucket(deedDB);
  stream.pipe(
    bucket.openUploadStream(fileName, {
      metadata: {
        description,
      },
    }),
  );
  return fileName;
};
