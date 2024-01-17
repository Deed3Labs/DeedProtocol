import { DbBase } from "./db-utils.db";
import formidable from "formidable";
import { ReadStream } from "fs";
import { GridFSBucket, ObjectId } from "mongodb";

export interface FileInfo {
  id: string;
  owner: string;
  fileId: ObjectId;
  fileName: string;
  metadata: formidable.File;
}

export class FilesDb extends DbBase {
  private static collection = this.deedDB.collection("FilesInfos");

  static async downloadFile(fileId: string) {
    const bucket = new GridFSBucket(this.deedDB);

    const fileInfo = (await this.collection.findOne({
      fileId: new ObjectId(fileId),
    })) as unknown as FileInfo;

    const stream = bucket.openDownloadStream(new ObjectId(fileId));
    return { stream, fileInfo };
  }

  static async createFile(
    stream: ReadStream,
    fileName: string,
    metadata: formidable.File & { owner: string },
  ) {
    const bucket = new GridFSBucket(this.deedDB);
    const id = stream.pipe(
      bucket.openUploadStream(fileName, {
        metadata,
      }),
    ).id;

    // create file entry with owner and file metadata
    this.collection.insertOne({
      fileName,
      metadata,
      fileId: id,
      timestamp: new Date(),
    });

    return id.toString().replaceAll('"', "");
  }

  static async deleteFile(fileInfo: FileInfo) {
    const bucket = new GridFSBucket(this.deedDB);
    await bucket.delete(fileInfo.fileId);
  }
}
