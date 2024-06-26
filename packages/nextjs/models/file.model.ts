import {
  DeedInfoModel,
  OtherInformationModel,
  OwnerInformationModel,
  PropertyDetailsModel,
} from "./deed-info.model";
import { isArray } from "lodash-es";
import { ObjectId } from "mongodb";

export type FileValidationState = "Completed" | "Not started" | "Needs Review" | "Processing";
export interface FileValidationModel {
  _id?: string;
  registrationId: string;
  key: string;
  state: FileValidationState;
}

export interface FileModel {
  _id?: ObjectId;
  id: string;
  fileId: string;
  owner: string;
  fileName: string;
  mimetype: string | null;
  size: number;
  timestamp: Date;
  restricted?: boolean;
}

export type FileFieldKey = [
  keyof DeedInfoModel,
  (
    | keyof OwnerInformationModel
    | keyof PropertyDetailsModel
    | keyof OtherInformationModel
    | undefined
  ),
];

export class FileFieldKeyLabel {
  key!: FileFieldKey;
  label!: string;
  restricted?: boolean;
  multiple?: boolean;
  state?: FileValidationState;

  constructor(data: Omit<FileFieldKeyLabel, "getFile">) {
    Object.assign(this, data);
  }

  getFile = (deed: DeedInfoModel): FileModel[] => {
    const [key, subKey] = this.key;
    let files;
    if (subKey !== undefined) {
      // @ts-ignore
      files = deed[key][subKey];
    } else {
      // @ts-ignore
      files = deed[key] as FileModel[];
    }

    return isArray(files) ? files : [files];
  };
}
