import { useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import logger from "~~/services/logger.service";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

export class HttpClient {
  protected authorizationToken?: string;
  protected get chainId() {
    return getTargetNetwork().id;
  }

  public authentify(authorizationToken: string) {
    this.authorizationToken = authorizationToken;
  }

  public async get<TRes = any>(url: string) {
    const res = await fetch(url, {
      headers: [["authorization", this.authorizationToken ?? ""]],
    });

    if (this.handleError(url, res)) return { status: res.status, value: undefined, ok: false };

    return { status: res.status, value: (await res.text()) as TRes, ok: true };
  }

  public async post<TRes = any>(url: string, body: any) {
    const res = await fetch(url, {
      method: "POST",
      body: body,
      headers: [["authorization", this.authorizationToken ?? ""]],
    });

    if (this.handleError(url, res)) return { status: res.status, value: undefined, ok: false };

    return { status: res.status, value: (await res.text()) as TRes, ok: true };
  }

  public async put<TRes = any>(url: string, body: any) {
    const res = await fetch(url, {
      method: "PUT",
      body: body,
      headers: [["authorization", this.authorizationToken ?? ""]],
    });

    if (this.handleError(url, res)) return { status: res.status, value: undefined, ok: false };

    return { status: res.status, value: (await res.text()) as TRes, ok: true };
  }

  public async del(url: string) {
    const res = await fetch(url, {
      method: "DELETE",
      headers: [["authorization", this.authorizationToken ?? ""]],
    });

    if (this.handleError(url, res)) return { status: res.status, value: undefined, ok: false };

    return { status: res.status, ok: true };
  }

  private handleError(url: string, res: Response) {
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
  }
}

const useHttpClient = <TClient extends HttpClient>(client: TClient): TClient => {
  const { authToken } = useDynamicContext();

  useEffect(() => {
    if (authToken) {
      client.authentify(authToken);
    }
  }, [authToken]);

  return client ?? new HttpClient();
};

export default useHttpClient;
