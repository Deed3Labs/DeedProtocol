import { HttpClient } from "./base.client";
import logger from "~~/services/logger.service";
import { notification } from "~~/utils/scaffold-eth";

export class FileClient extends HttpClient {
  public async download(fileHash: string, id: string, name: string) {
    const url = `/api/deed-info/${id}?hash=${fileHash}&chainId=${this.chainId}`;
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
    link.download = `${id}-${name}`;
    link.click();
    URL.revokeObjectURL(blobUrl);
  }
}
