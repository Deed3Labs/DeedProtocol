import { DbBase } from "./db-utils.db";
import { ReadStream } from "fs";
import { GridFSBucket, ObjectId } from "mongodb";
import { FileModel } from "~~/models/file.model";

export class FilesDb extends DbBase {
  private static collection = this.deedDB.collection("FilesInfos");

  static async downloadFile(fileId: string) {
    const bucket = new GridFSBucket(this.deedDB);

    const fileInfo = (await this.collection.findOne({
      fileId,
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
    // @ts-ignore
    await this.collection.deleteOne({ _id: fileInfo._id });
    const result = await this.collection.insertOne(fileInfo);

    return result.insertedId.toString().replaceAll('"', "");
  }

  static async deleteFile(fileInfo: FileModel) {
    const bucket = new GridFSBucket(this.deedDB);
    await bucket.delete(new ObjectId(fileInfo.fileId));
    await this.collection.deleteOne({ fileId: fileInfo.fileId });
  }

  static async getFileInfo(fileId: string) {
    return (await this.collection.findOne({ fileId })) as unknown as FileModel;
  }
}
