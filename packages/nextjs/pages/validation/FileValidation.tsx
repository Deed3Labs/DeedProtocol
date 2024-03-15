import React, { useEffect, useMemo, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isArray } from "lodash-es";
import useFileClient from "~~/clients/file.client";
import { FileUploaderInput } from "~~/components/inputs/FileUploaderInput";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { FileFieldKeyLabel, FileModel, FileValidationState } from "~~/models/file.model";
import { LightChangeEvent } from "~~/models/light-change-event";
import { notification } from "~~/utils/scaffold-eth";

interface Props {
  id: string;
  fileLabels?: string[];
  label: string;
  description?: string;
  button?: React.ReactNode;
  deedData: DeedInfoModel;
  supportedFiles: Map<string, FileFieldKeyLabel>;
  onSave: (deed: DeedInfoModel) => Promise<void>;
  onRefresh: () => void;
  onStateChanged?: (id: string, state: FileValidationState) => void;
}
const FileValidation = ({
  id,
  fileLabels,
  label,
  description,
  supportedFiles,
  button,
  onStateChanged,
  onSave,
  onRefresh,
  deedData,
}: Props) => {
  const { authToken } = useDynamicContext();
  const fileClient = useFileClient();
  const [isBadgeEdit, setIsBadgeEdit] = useState(false);
  const [allFiles, setAllFiles] = useState<(FileFieldKeyLabel & { files?: FileModel[] })[]>([]);

  const state = useMemo(() => {
    const validationEntry = deedData.validations?.find(x => x[0] === id);
    return validationEntry?.[1];
  }, [deedData.validations, id]);

  const stateBadge = useMemo(() => {
    switch (state) {
      case "Completed":
        return "success";
      case "Needs Review":
        return "error";
      case "Processing":
        return "warning";
      case "Not started":
      default:
        return "neutral";
    }
  }, [state]);

  useEffect(() => {
    if (fileLabels && supportedFiles) {
      const files: typeof allFiles = [];
      fileLabels.forEach(label => {
        const x = supportedFiles.get(label)!;
        if (!x) return;
        files.push({ ...x, files: x?.getFile(deedData) });
      });
      setAllFiles(files);
    }
  }, [fileLabels, supportedFiles]);

  const handleFileUpload = async (
    files: LightChangeEvent<FileModel>,
    field: (typeof allFiles)[number],
  ) => {
    if (!isArray(files.value)) {
      files.value = [files.value];
    }
    const toastId = notification.loading("Uploading documents...");
    await Promise.all(
      files.value.map(async (file: FileModel, index: number) => {
        const fileId = await fileClient.authentify(authToken ?? "").uploadFile(file, field.label);
        files.value.fileId = fileId;
        if (!field.key[1]) {
          if (field.multiple) {
            // @ts-ignore
            if (!deedData[field.key[0]]) deedData[field.key[0]] = [];
            // @ts-ignore
            deedData[field.key[0]][index] = file;
          } else {
            // @ts-ignore
            deedData[field.key[0]] = file;
          }
        } else {
          if (field.multiple) {
            // @ts-ignore
            if (!deedData[field.key[0]][field.key[1]]) deedData[field.key[0]][field.key[1]] = [];
            // @ts-ignore
            deedData[field.key[0]][field.key[1]][index] = file;
          } else {
            // @ts-ignore
            deedData[field.key[0]][field.key[1]] = file;
          }
        }
      }),
    )
      .catch(() => {
        notification.error("Error uploading documents");
      })
      .finally(() => {
        notification.remove(toastId);
      });

    onSave(deedData).then(onRefresh);
  };

  const openFile = async (file: FileModel) => {
    await fileClient.authentify(authToken ?? "").getFile(file.fileId, file.fileName, false);
  };

  const handleStateChanged = (ev: any) => {
    const newState = ev.target.value as FileValidationState;
    onStateChanged?.(id, newState);
    setIsBadgeEdit(false);
  };

  return (
    <div className="flex flex-row flex-wrap w-full justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="text-lg">{label}</div>
        <div className="text-secondary uppercase text-xs">{description}</div>
      </div>
      <div className="flex flex-row items-center">
        {stateBadge && isBadgeEdit ? (
          <select
            className="select w-full max-w-xs"
            value={state ?? "Not started"}
            onChange={handleStateChanged}
          >
            <option value="Not Started">Not Started</option>
            <option value="Processing">Processing</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Completed">Completed</option>
          </select>
        ) : (
          <div
            className={`badge badge-${stateBadge} text-${
              stateBadge === "neutral"
                ? "secondary"
                : stateBadge === "warning"
                ? "black"
                : stateBadge
            } rounded-lg `}
            onDoubleClick={() => setIsBadgeEdit(x => !x)}
          >
            {state ?? "Not started"}
          </div>
        )}
        {button ? (
          button
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-primary m-1 btn-outline btn-square rounded-lg w-fit px-2 uppercase"
            >
              View documents
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 list-none"
            >
              {allFiles.map(field => (
                <li key={field.label}>
                  <div className="pointer-events-none">{field.label}</div>
                  <div className="flex flex-col flex-nowrap">
                    {field.files?.map(file =>
                      file ? (
                        <button
                          className="hover:bg-secondary w-full p-2 text-left pl-2"
                          key={file?.fileId}
                          onClick={() => openFile(file)}
                        >
                          {file.fileName}
                        </button>
                      ) : (
                        <span className="w-full p-2 text-left pl-2 text-secondary italic cursor-default">
                          No file
                        </span>
                      ),
                    )}
                    <div className="w-full text-left">
                      <FileUploaderInput
                        inline
                        className="p-2 hover:bg-secondary"
                        name={field.label}
                        label={"Upload"}
                        multiple={field.multiple}
                        isRestricted={field.restricted}
                        // @ts-ignore
                        onChange={newFile => handleFileUpload(newFile as FileModel, field)}
                      ></FileUploaderInput>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileValidation;
