let currentWallet: string | undefined = undefined;

const logger = {
  debug: (payload: any) => {
    handleLog(payload, "debug");
  },
  info: (payload: any) => {
    handleLog(payload, "info");
  },
  warn: (payload: any) => {
    handleLog(payload, "warn");
  },
  error: (payload: any) => {
    handleLog(payload, "error");
  },
  setWallet: function (address: string) {
    currentWallet = address;
  },
};

const handleLog = (payload: any, level: "debug" | "info" | "warn" | "error") => {
  console[level](payload);
  fetch("/api/logger?level=warn", {
    method: "POST",
    body: JSON.stringify({
      context: {
        wallet: currentWallet ?? "No wallet",
        browser: navigator.userAgent,
      },
      ...payload,
    }),
  });
};

export default logger;
