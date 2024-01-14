import useHttpClient, { HttpClient } from "./base.client";
import logger from "~~/services/logger.service";
import { notification } from "~~/utils/scaffold-eth";

// LINK ../pages/api/files.api.ts

export class FileClient extends HttpClient {
  public async downloadFile(fileId: string, name: string, isRestricted: boolean) {
    const url = `/api/files?fileId=${fileId}&isRestricted=${isRestricted}`;
    const response = await fetch(url, {
      headers: [["authorization", this.authorizationToken ?? ""]],
    });
    if (response.status !== 200) {
      notification.error("Error downloading file " + name);
      logger.error({ message: "Error downloading file", details: await response.text() });
      return;
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = isRestricted ? fileId : `${fileId}-${name}`;
    link.click();
    URL.revokeObjectURL(blobUrl);
  }

  public async uploadFile(file: File, fieldLabel: string, isRestricted: boolean) {
    try {
      const formData = new FormData();
      // @ts-ignore
      formData.append("file", file, { filename: file.name });
      formData.append("name", file.name);
      formData.append("description", fieldLabel);

      const res = await this.post(`/api/files?isRestricted=${isRestricted}`, formData);
      return res.value;
    } catch (error) {
      const message = `Error uploading file ${file.name} for field ${fieldLabel}`;
      logger.error({ message, error });
      throw error;
    }
  }
}

const useFileClient = () => useHttpClient(new FileClient());
export default useFileClient;
