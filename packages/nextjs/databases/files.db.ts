import { DbBase } from "./db-utils.db";
import { DeedDb } from "./deeds.db";
import { ReadStream } from "fs";
import { GridFSBucket, ObjectId } from "mongodb";
import { FileModel } from "~~/models/file.model";

export class FilesDb extends DbBase {
  private static collection = this.deedDB.collection("FilesInfos");

  static async downloadFile(fileId: string) {
    const bucket = new GridFSBucket(this.deedDB);
    const chainId = DeedDb.getChainId();
    const fileInfo = (await this.collection.findOne({
      fileId,
      chainId,
    })) as unknown as FileModel;

    const stream = bucket.openDownloadStream(new ObjectId(fileId));
    return { stream, fileInfo };
  }

  static async createFile(stream: ReadStream, fileInfo: Omit<FileModel, "fileId">) {
    const bucket = new GridFSBucket(this.deedDB);
    const id = stream.pipe(
      bucket.openUploadStream(fileInfo.fileName, {
        metadata: fileInfo,
      }),
    ).id;
    const fileId = id.toString().replaceAll('"', "");
    // create file entry with owner and file metadata
    await FilesDb.saveFileInfo({ ...fileInfo, fileId });

    return fileId;
  }

  static async saveFileInfo(fileInfo: FileModel) {
    const entry = {
      ...fileInfo,
      lastModified: new Date(),
      chainId: DeedDb.getChainId(),
    } as any;
    if (fileInfo.fileId === undefined) {
      entry.createdOn = new Date();
    } else {
      delete entry._id;
    }
    const res = await this.collection.updateOne(
      { _id: fileInfo._id },
      { $set: entry },
      {
        upsert: true, // Create if not exists
      },
    );

    const id = res.upsertedId?.toString().replaceAll('"', "") ?? fileInfo.fileId;

    return id;
  }

  static async deleteFile(fileInfo: FileModel) {
    const bucket = new GridFSBucket(this.deedDB);
    await bucket.delete(new ObjectId(fileInfo.fileId));
    await this.collection.deleteOne({
      fileId: fileInfo.fileId,
      chainId: DeedDb.getChainId(),
    });
  }

  static async getFileInfo(fileId: string) {
    return (await this.collection.findOne({
      fileId,
      chainId: DeedDb.getChainId(),
    })) as unknown as FileModel;
  }
}
