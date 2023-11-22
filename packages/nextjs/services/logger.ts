const logger = {
  debug: (payload: any) => {
    console.log("debug", payload);
    fetch("/api/logger?level=debug", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  info: (payload: any) => {
    console.log("info", payload);
    fetch("/api/logger?level=info", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  warn: (payload: any) => {
    console.log("warn", payload);
    fetch("/api/logger?level=warn", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  error: (payload: any) => {
    console.log("error", payload);
    fetch("/api/logger?level=error", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export default logger;
