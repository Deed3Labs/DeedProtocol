import { notification } from "./scaffold-eth";

export const uploadFile = async (file: File, fieldLabel: string) => {
  const formData = new FormData();
  // @ts-ignore
  formData.append("file", file, { filename: file.name });
  formData.append("name", file.name);
  formData.append("description", fieldLabel);

  try {
    const res = await fetch("/api/files?mode=file", {
      method: "POST",
      body: formData,
    });
    return await res.text();
  } catch (error) {
    console.error(error);
    notification.error(`Error uploading file ${file.name} for field ${fieldLabel}`);
  }

  return null;
};

export const uploadJson = async (object: any) => {
  const res = await fetch("/api/files?mode=json", {
    method: "POST",
    body: JSON.stringify(object),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.text();
};

export const retrieveFromHash = async <T = any>(hash: string) => {
  const res = await fetch("/api/files/" + hash);
  return res.json() as T;
};
