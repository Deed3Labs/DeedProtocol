import {
  DeedInfoModel,
  OtherInformationModel,
  OwnerInformationModel,
  PropertyDetailsModel,
} from "./deed-info.model";

export type FileValidationState = "Completed" | "Not started" | "Needs Review" | "Processing";

export interface FileModel {
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
    if (subKey !== undefined) {
      // @ts-ignore
      return deed[key][subKey];
    }
    // @ts-ignore
    return deed[key] as FileModel[];
  };
}
