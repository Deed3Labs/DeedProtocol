export type FileModel = File & {
  id?: string;
  restricted?: boolean;
  owner?: string;
};
