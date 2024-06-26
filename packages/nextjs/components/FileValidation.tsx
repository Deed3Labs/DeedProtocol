import React, { useEffect, useMemo, useState } from "react";
import { isArray } from "lodash-es";
import useFileClient from "~~/clients/files.client";
import useValidationClient from "~~/clients/validations.client";
import { FileUploaderInput } from "~~/components/inputs/FileUploaderInput";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import useWallet from "~~/hooks/useWallet";
import { DeedInfoModel } from "~~/models/deed-info.model";
import {
  FileFieldKeyLabel,
  FileModel,
  FileValidationModel,
  FileValidationState,
} from "~~/models/file.model";
import { LightChangeEvent } from "~~/models/light-change-event";
import { notification } from "~~/utils/scaffold-eth";

interface Props {
  id: string;
  validationState?: FileValidationState;
  fileLabels?: string[];
  label: string;
  description?: string;
  button?: React.ReactNode;
  deedData: DeedInfoModel;
  supportedFiles: Map<string, FileFieldKeyLabel>;
  onSave: (deed: DeedInfoModel) => Promise<void>;
  onRefresh: () => void;
  onStateChanged?: (validation: FileValidationModel) => void;
}
const FileValidation = ({
  id: key,
  validationState,
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
  const { primaryWallet } = useWallet();
  const fileClient = useFileClient();
  const [isBadgeEdit, setIsBadgeEdit] = useState(false);
  const [allFiles, setAllFiles] = useState<(FileFieldKeyLabel & { files?: FileModel[] })[]>([]);
  const [fileValidationState, setFileValidationState] = useState(validationState);
  const [loading, setLoading] = useState(true);
  const isValidator = useIsValidator();
  const validationClient = useValidationClient();
  const isOwner = useMemo(() => {
    return deedData.ownerInformation.walletAddress === primaryWallet?.address;
  }, [deedData.ownerInformation.walletAddress, primaryWallet]);

  useEffect(() => {
    (async () => {
      if (!deedData.id) return;
      const result = await validationClient.getValidation(deedData.id, key);
      if (!result) {
        notification.error(`Error retrieving validation with key: ${key}`);
      } else {
        setFileValidationState(result.state);
      }
      setLoading(false);
    })();
  }, []);

  const stateBadge = useMemo(() => {
    switch (fileValidationState) {
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
  }, [fileValidationState]);

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
    if (field.multiple) {
      if (field.key[1]) {
        // @ts-ignore
        deedData[field.key[0]][field.key[1]] = [];
      } else {
        // @ts-ignore
        deedData[field.key[0]] = [];
      }
    }
    const toastId = notification.loading("Uploading documents...");
    await Promise.all(
      files.value.map(async (file: FileModel, index: number) => {
        const fileId = await fileClient.uploadFile(file, field.label);
        file.fileId = fileId;
        if (!field.key[1]) {
          if (field.multiple) {
            // @ts-ignore
            deedData[field.key[0]][index] = file;
          } else {
            // @ts-ignore
            deedData[field.key[0]] = file;
          }
        } else {
          if (field.multiple) {
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
    await fileClient.getFile(file, file.fileName, false);
  };

  const handleStateChanged = (ev: any) => {
    const newState = ev.target.value as FileValidationState;
    setFileValidationState(newState);
    onStateChanged?.({ key: key, state: newState, registrationId: deedData.id! });
    setIsBadgeEdit(false);
  };

  return (
    <div className="flex flex-row flex-wrap w-full justify-between items-center gap-5">
      <div className="flex flex-col gap-1">
        <div className="text-base font-normal text-white capitalize">{label}</div>
        <div className="text-[10px] font-normal text-zinc-400 uppercase tracking-widest">
          {description}
        </div>
      </div>
      <div className="flex flex-row items-center">
        {stateBadge && isBadgeEdit ? (
          <select
            className="select w-full max-w-xs"
            value={fileValidationState ?? "Not started"}
            onChange={handleStateChanged}
          >
            <option value="Not Started">Not Started</option>
            <option value="Processing">Processing</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Completed">Completed</option>
          </select>
        ) : (
          <div
            className={`badge badge-${loading ? "" : stateBadge} text-${
              stateBadge === "neutral"
                ? "secondary"
                : stateBadge === "warning"
                ? "black"
                : stateBadge
            } h-6 rounded-lg text-[10px] font-normal capitalize`}
            onDoubleClick={() => {
              if (isValidator) return setIsBadgeEdit(x => !x);
            }}
          >
            {loading ? (
              <div className="h-2 w-16 bg-slate-300 rounded" />
            ) : (
              fileValidationState ?? "Not started"
            )}
          </div>
        )}
        {button ? (
          button
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm btn-primary ml-1 border-white border-opacity-10 btn-square rounded-lg w-fit px-2 text-[9px] font-normal uppercase tracking-widest"
            >
              View Documents
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] p-4 shadow bg-base-100 rounded-box w-52 list-none"
            >
              {allFiles.map(field => (
                <li key={field.label}>
                  <div className="pointer-events-none text-[9px] text-white font-normal uppercase tracking-widest">
                    {field.label}
                  </div>
                  <div className="flex flex-col flex-nowrap">
                    {field.files?.map((file, i) =>
                      file ? (
                        <button
                          className="hover:bg-secondary w-full p-2 text-left pl-4"
                          key={file?.fileId}
                          onClick={() => openFile(file)}
                        >
                          {file.fileName}
                        </button>
                      ) : (
                        <span
                          key={i}
                          className="w-full p-2 text-left pl-4 text-secondary italic cursor-default"
                        >
                          No file
                        </span>
                      ),
                    )}
                    {isOwner && (
                      <div className="w-full text-left">
                        <FileUploaderInput
                          inline
                          className="p-2 pl-4 hover:bg-secondary opacity-50"
                          name={field.label}
                          label="Upload"
                          multiple={field.multiple}
                          isRestricted={field.restricted}
                          // @ts-ignore
                          onChange={newFile => handleFileUpload(newFile as FileModel, field)}
                        />
                      </div>
                    )}
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
