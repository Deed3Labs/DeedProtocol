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
  state?: FileValidationState;
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

export interface FileKeyValueLabel {
  key: FileFieldKey;
  label: string;
  value: FileModel[];
  restricted?: boolean;
}
