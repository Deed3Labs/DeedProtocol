import { logger, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

const useHttpClient = () => {
  const { authToken } = useDynamicContext();

  const get = async <TRes = any>(url: string) => {
    const res = await fetch(url, {
      headers: [["authorization", authToken ?? ""]],
    });

    if (handleError(url, res)) return undefined;

    return { status: res.status, value: (await res.json()) as TRes };
  };

  const post = async <TRes = any>(url: string, body: any) => {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: [["authorization", authToken ?? ""]],
    });

    if (handleError(url, res)) return undefined;

    return { status: res.status, value: (await res.json()) as TRes };
  };

  const put = async <TRes = any>(url: string, body: any) => {
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: [["authorization", authToken ?? ""]],
    });

    if (handleError(url, res)) return undefined;

    return { status: res.status, value: (await res.json()) as TRes };
  };

  const del = async (url: string) => {
    const res = await fetch(url, {
      method: "DELETE",
      headers: [["authorization", authToken ?? ""]],
    });

    handleError(url, res);

    return { status: res.status };
  };

  const download = async (fileHash: string, id: string, name: string) => {
    const url = `api/deed-info/${id}?hash=${fileHash}&chainId=${getTargetNetwork().id}`;
    const response = await fetch(url, {
      headers: [["authorization", authToken ?? ""]],
    });
    if (response.status !== 200) {
      notification.error("Error downloading file");
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
      notification.error("Unauthorized");
      logger.error({ message: "Unauthorized", url });
      return true;
    }

    if (res.status === 500) {
      notification.error("Server Error");
      logger.error({ message: "Server Error", url });
      return true;
    }

    if (res.status === 404) {
      notification.error("Not Found");
      logger.error({ message: "Not Found", url });
      return true;
    }

    if (res.status === 400) {
      notification.error("Bad Request");
      logger.error({ message: "Bad Request", url });
      return true;
    }

    if (res.status === 403) {
      notification.error("Forbidden");
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
  };
};

export default useHttpClient;
