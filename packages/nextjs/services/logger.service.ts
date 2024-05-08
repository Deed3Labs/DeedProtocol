let currentWallet: string | undefined = undefined;

const logger = {
  debug: (...payload: any) => {
    handleLog(payload, "debug");
  },
  info: (...payload: any) => {
    handleLog(payload, "info");
  },
  warn: (...payload: any) => {
    handleLog(payload, "warn");
  },
  error: (...payload: any) => {
    handleLog(payload, "error");
  },
  setWallet: function (address: string) {
    currentWallet = address;
  },
};

const handleLog = (payload: any, level: "debug" | "info" | "warn" | "error") => {
  // eslint-disable-next-line no-console
  console[level](payload);
  // If browser side
  if (global.window) {
    try {
      const body = JSON.stringify({
        context: {
          wallet: currentWallet ?? "No wallet",
          // browser: navigator.userAgent,si
        },
        ...payload,
      });
      fetch(`/api/loggers?level=${level}`, {
        method: "POST",
        body: body,
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.error("Something went wrong while sending logs to the server", error);
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Something went wrong while sending logs to the server", error);
    }
  }
};

export default logger;
