import formidable from "formidable";

export interface FileModel {
  fileId: string;
  owner: string;
  fileName: string;
  metadata: formidable.File | File;
  timestamp: Date;
  restricted?: boolean;
}
