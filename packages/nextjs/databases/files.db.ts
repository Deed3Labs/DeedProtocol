import { DbBase } from "./db-utils.db";
import formidable from "formidable";
import { ReadStream } from "fs";
import { GridFSBucket } from "mongodb";

export type FileInfo = formidable.File & {
  owner: string;
};

export class FilesDb extends DbBase {
  private static collection = this.deedDB.collection("FilesInfos");

  static async downloadFile(fileName: string) {
    const bucket = new GridFSBucket(this.deedDB);
    const stream = bucket.openDownloadStreamByName(fileName);

    const fileInfo = (await this.collection.findOne({ fileName })) as unknown as FileInfo;
    return { stream, fileInfo };
  }

  static async createFile(
    stream: ReadStream,
    fileName: string,
    metadata: formidable.File & { owner: string },
  ) {
    const bucket = new GridFSBucket(this.deedDB);
    stream.pipe(
      bucket.openUploadStream(fileName, {
        metadata,
      }),
    );

    // create file entry with owner and file metadata
    this.collection.insertOne({
      fileName,
      metadata,
    });

    return fileName;
  }
}
