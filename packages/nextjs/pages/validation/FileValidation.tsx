import React, { ChangeEventHandler, useEffect, useMemo, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { flatMap } from "lodash-es";
import useFileClient from "~~/clients/file.client";
import { DeedInfoModel } from "~~/models/deed-info.model";
import {
  FileFieldKeyLabel as FileFieldModel,
  FileModel,
  FileValidationState,
} from "~~/models/file.model";

interface Props {
  fileFields?: FileFieldModel[];
  label: string;
  description?: string;
  button?: React.ReactNode;
  deedData: DeedInfoModel;
  onStateChanged?: (state: FileValidationState) => void;
}
const FileValidation = ({
  fileFields,
  label,
  description,
  button,
  onStateChanged,
  deedData,
}: Props) => {
  const { authToken } = useDynamicContext();
  const fileClient = useFileClient();
  const [isBadgeEdit, setIsBadgeEdit] = useState(false);
  const [allFiles, setAllFiles] = useState<FileModel[]>([]);
  const stateBadge = useMemo(() => {
    switch (fileFields?.[0].state) {
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
  }, [fileFields?.[0].state]);

  useEffect(() => {
    if (fileFields) {
      setAllFiles(
        flatMap(
          fileFields.filter(x => !!x),
          field => field?.getFile(deedData),
        ),
      );
    }
  }, [fileFields]);

  const openFile = async (file: FileModel) => {
    await fileClient.authentify(authToken ?? "").getFile(file.fileId, file.fileName, false);
  };

  const handleStateChanged = (ev: any) => {
    const newState = ev.target.value as FileValidationState;
    onStateChanged?.(newState);
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
            value={fileFields?.[0].state}
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
              stateBadge === "neutral" ? "secondary" : stateBadge
            } rounded-lg `}
            onDoubleClick={() => setIsBadgeEdit(x => !x)}
          >
            {fileFields?.[0].state ?? "Not started"}
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
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              {allFiles.map(file => (
                <li key={file.fileId}>
                  <button onClick={() => openFile(file)} className="link-default">
                    {file.fileName}
                  </button>
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
