import http from "http";
import https from "https";
import logger from "~~/services/logger.service";

const BASE_MODULES = [http, https];

BASE_MODULES.forEach(baseModule => {
  const original = baseModule.request;
  baseModule.request = function (opts: any, cb: any) {
    logger.debug({
      OutgoingRequest: {
        method: opts.method,
        url: opts.href
          ? opts.href
          : `${opts.protocol}:${opts.port ?? ""}//${opts.hostname}/${opts.pathname}`,
        params: opts.params,
        headers: Object.entries(opts.headers)
          .map(([key, value]) => `* ${key}: ${value}`)
          .join("\n"),
        body: JSON.stringify(opts.body),
      },
    });

    return original(opts, cb);
  };
});
