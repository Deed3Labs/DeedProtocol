import { logger, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

export interface HttpClient {
  get: <TRes = any>(url: string) => Promise<{ status: number; value?: TRes }>;
  post: <TRes = any>(url: string, body: any) => Promise<{ status: number; value?: TRes }>;
  put: <TRes = any>(url: string, body: any) => Promise<{ status: number; value?: TRes }>;
  delete: (url: string) => Promise<{ status: number }>;
  download: (fileHash: string, id: string, name: string) => Promise<void>;
}

const useHttpClient = () => {
  const { authToken } = useDynamicContext();

  const get = async <TRes = any>(url: string) => {
    const res = await fetch(url, {
      headers: [["authorization", authToken ?? ""]],
    });

    if (handleError(url, res)) return { status: res.status, value: undefined };

    return { status: res.status, value: (await res.json()) as TRes };
  };

  const post = async <TRes = any>(url: string, body: any) => {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: [["authorization", authToken ?? ""]],
    });

    if (handleError(url, res)) return { status: res.status, value: undefined };

    return { status: res.status, value: (await res.json()) as TRes };
  };

  const put = async <TRes = any>(url: string, body: any) => {
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: [["authorization", authToken ?? ""]],
    });

    if (handleError(url, res)) return { status: res.status, value: undefined };

    return { status: res.status, value: (await res.json()) as TRes };
  };

  const del = async (url: string) => {
    const res = await fetch(url, {
      method: "DELETE",
      headers: [["authorization", authToken ?? ""]],
    });

    if (handleError(url, res)) return { status: res.status, value: undefined };

    return { status: res.status };
  };

  const download = async (fileHash: string, id: string, name: string) => {
    const url = `/api/deed-info/${id}?hash=${fileHash}&chainId=${getTargetNetwork().id}`;
    const response = await fetch(url, {
      headers: [["authorization", authToken ?? ""]],
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
  };

  const handleError = (url: string, res: Response) => {
    if (res.status === 401) {
      logger.error({ message: "Unauthorized", url });
      return true;
    }

    if (res.status === 500) {
      logger.error({ message: "Server Error", url });
      return true;
    }

    if (res.status === 404) {
      logger.error({ message: "Not Found", url });
      return true;
    }

    if (res.status === 400) {
      logger.error({ message: "Bad Request", url });
      return true;
    }

    if (res.status === 403) {
      logger.error({ message: "Forbidden", url });
      return true;
    }

    return false;
  };

  return {
    get,
    post,
    put,
    delete: del,
    download,
  } satisfies HttpClient;
};

export default useHttpClient;
