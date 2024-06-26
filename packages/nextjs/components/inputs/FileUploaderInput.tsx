import { useEffect, useRef, useState } from "react";
import { DownloadLogo } from "../assets/Downloadicon";
import { ExternalLinkIcon } from "@dynamic-labs/sdk-react-core";
import useFileClient from "~~/clients/files.client";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import useWallet from "~~/hooks/useWallet";
import { FileModel } from "~~/models/file.model";
import { LightChangeEvent } from "~~/models/light-change-event";
import { IconLightningSolid } from "~~/styles/Icons";

interface Props<TParent> {
  label: string;
  name: keyof TParent;
  subtitle?: string;
  optional?: boolean;
  className?: string;
  value?: FileModel | FileModel[];
  multiple?: boolean;
  maxFileSizeKb?: number;
  readOnly?: boolean;
  isRestricted?: boolean;
  inline?: boolean;
  onChange?: (file: LightChangeEvent<TParent>) => void;
}

export const FileUploaderInput = <TParent,>({
  label,
  name,
  subtitle,
  optional,
  className,
  inline,
  onChange,
  multiple,
  value,
  maxFileSizeKb = 10000,
  readOnly,
  isRestricted = true,
}: Props<TParent>) => {
  const fileClient = useFileClient();
  const { authToken, primaryWallet } = useWallet();
  const [files, setFiles] = useState<FileModel[]>([]);
  const isValidator = useIsValidator();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      const values = Array.isArray(value) ? value : [value];
      setFiles([...values]);
    } else {
      setFiles([]);
    }
  }, [value, authToken]);

  const handleKeyDown = (ev: React.KeyboardEvent<HTMLLabelElement>) => {
    if (ev.key === "Enter") {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      const newValues = Array.from(files).map(x => ({
        fileName: x.name,
        restricted: isRestricted,
        size: x.size,
        mimetype: x.type,
        metadata: x,
      }));

      // If multiple files are allowed, convert the FileList to an array
      onChange?.({
        name,
        value: multiple ? newValues : newValues[0],
      });
    }
  };

  const download = async (file: FileModel) => {
    await fileClient.getFile(file, name.toString(), true);
  };

  const openFile = async (file: FileModel) => {
    await fileClient.getFile(file, name.toString(), false);
  };

  const handleDrop = (ev: React.DragEvent<HTMLElement>) => {
    handleFileChange(ev.dataTransfer.files);
    handleDragLeave(ev);
    ev.preventDefault();
    ev.stopPropagation();
  };

  const handleDragOver = (ev: React.DragEvent<HTMLElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
  };

  const handleDragEnter = (ev: React.DragEvent<HTMLElement>) => {
    const el = ev.target as HTMLElement;
    el.classList.add("drop-zone-active");
    ev.preventDefault();
    ev.stopPropagation();
  };

  const handleDragLeave = (ev: React.DragEvent<HTMLElement>) => {
    const el = ev.target as HTMLElement;
    el.classList.remove("drop-zone-active");
    ev.preventDefault();
    ev.stopPropagation();
  };

  return (
    <div className={`max-w-full ${className ? className : ""} `}>
      <input
        ref={inputRef}
        id={name as string}
        name={name as string}
        type="file"
        className="hidden"
        onChange={ev => handleFileChange(ev.target.files)}
        multiple={multiple}
        readOnly={readOnly}
        value={""}
        // accept=".pdf,.txt,.doc,.csv"
      />
      {inline ? (
        <label
          htmlFor={name as string}
          className="text-base font-normal leading-normal w-full cursor-pointer block"
        >
          {label}
        </label>
      ) : (
        <label
          htmlFor={name as string}
          className={`mt-3 flex flex-row flex-wrap lg:flex-nowrap justify-start gap-8 items-center w-full p-4 lg:h-min-36 cursor-pointer hover:bg-base-100 border border-white border-opacity-10 ${
            readOnly ? "pointer-events-none border-none" : ""
          }`}
          tabIndex={0}
          onKeyDown={ev => handleKeyDown(ev)}
          onDrop={ev => handleDrop(ev)}
          onDragOver={ev => handleDragOver(ev)}
          onDragEnter={ev => handleDragEnter(ev)}
          onDragLeave={ev => handleDragLeave(ev)}
        >
          {!readOnly && (
            <div className="w-12 h-12 lg:w-24 lg:h-24 mb-2 p-1 lg:p-6 border border-white border-opacity-10 border-dashed justify-start items-center inline-flex pointer-events-none">
              <div className="grow shrink basis-0 self-stretch p-1 bg-neutral-900 rounded flex-col justify-center items-center inline-flex">
                <div className="self-stretch grow shrink basis-0 pl-1 pr-0.5 pt-px flex-col justify-center items-center flex">
                  <IconLightningSolid />
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col flex-wrap gap-2 pointer-events-none">
            <div className="text-base font-normal mb-3">
              {label}
              {optional && (
                <span className="text-[10px] uppercase rounded-lg bg-white bg-opacity-5 p-2 ml-3 text-zinc-400 tracking-widest">
                  Optional
                </span>
              )}
            </div>
            {files.length > 0 && (
              <div className="" title={files.map(x => x.fileName).join("\n")}>
                {files.map(file => (
                  <div key={`${file.fileId}-${file.size}-`} className="flex items-center gap-2">
                    <div>
                      {file.fileName} (
                      <span className={file.size / 1024 > maxFileSizeKb ? "text-error" : ""}>
                        {file.size / 1000} KB
                      </span>
                      )
                    </div>
                    {file.fileId &&
                      (!isRestricted || isValidator || file.owner === primaryWallet?.address) && (
                        <div className="flex">
                          <button
                            className="btn btn-sm btn-square pointer-events-auto"
                            onClick={() => openFile(file)}
                          >
                            <ExternalLinkIcon />
                          </button>
                          <button
                            className="btn btn-sm btn-square pointer-events-auto"
                            onClick={() => download(file)}
                          >
                            <DownloadLogo />
                          </button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
            {files.length === 0 &&
              (readOnly ? (
                "-"
              ) : (
                <>
                  <div className="text-zinc-400 text-sm font-normal leading-tight max">
                    {subtitle}
                  </div>
                  {
                    <div className=" text-zinc-400 text-sm font-normal leading-tight max">
                      Max File Size: 500 kilobytes.{" "}
                      {/*File types: PDF, TXT, DOC, or CSV, Images. */}
                    </div>
                  }
                </>
              ))}
          </div>
        </label>
      )}
    </div>
  );
};
