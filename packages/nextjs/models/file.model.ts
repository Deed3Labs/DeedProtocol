export interface FileModel {
  fileId: string;
  owner: string;
  fileName: string;
  mimetype: string | null;
  size: number;
  timestamp: Date;
  restricted?: boolean;
}
