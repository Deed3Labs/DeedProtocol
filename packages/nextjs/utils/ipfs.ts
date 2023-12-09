import { notification } from "./scaffold-eth";
import logger from "~~/services/logger";

export const uploadFile = async (file: File, fieldLabel: string) => {
  try {
    const formData = new FormData();
    // @ts-ignore
    formData.append("file", file, { filename: file.name });
    formData.append("name", file.name);
    formData.append("description", fieldLabel);

    const res = await fetch("/api/files?mode=file", {
      method: "POST",
      body: formData,
    });
    return await res.text();
  } catch (error) {
    const message = `Error uploading file ${file.name} for field ${fieldLabel}`;
    notification.error(message);
    logger.error({ message, error });
    throw error;
  }
};

export const uploadJson = async (object: any) => {
  const res = await fetch("/api/files?mode=json", {
    method: "POST",
    body: JSON.stringify(object),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.text();
};
