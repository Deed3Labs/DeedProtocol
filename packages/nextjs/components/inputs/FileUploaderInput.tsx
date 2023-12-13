import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { DownloadLogo } from "../assets/Downloadicon";
import useHttpClient from "~~/hooks/useHttpClient";
import { IpfsFileModel } from "~~/models/ipfs-file.model";
import { LightChangeEvent } from "~~/models/light-change-event";
import { IconLightningSolid } from "~~/styles/Icons";

interface Props<TParent> {
  label: string;
  name: keyof TParent;
  subtitle: string;
  optional?: boolean;
  className?: string;
  value?: IpfsFileModel | IpfsFileModel[];
  multiple?: boolean;
  maxFileSizeKb?: number;
  readOnly?: boolean;
  onChange?: (file: LightChangeEvent<TParent>) => void;
}

export const FileUploaderInput = <TParent,>({
  label,
  name,
  subtitle,
  optional,
  className,
  onChange,
  multiple,
  value,
  maxFileSizeKb = 10000,
  readOnly,
}: Props<TParent>) => {
  const httpClient = useHttpClient();
  const [files, setFiles] = useState<IpfsFileModel[]>([]);
  const { query } = useRouter();
  const { id } = query as { id: string };

  useEffect(() => {
    if (!value) {
      setFiles([]);
    } else {
      if (Array.isArray(value)) {
        setFiles(value);
      } else {
        setFiles([value]);
      }
    }
  }, [value]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (ev: React.KeyboardEvent<HTMLLabelElement>) => {
    if (ev.key === "Enter") {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      setFiles(Array.from(files));
      // If multiple files are allowed, convert the FileList to an array
      const newValue = multiple ? Array.from(files) : files[0];
      onChange?.({
        name,
        value: newValue,
      });
    }
  };

  const download = async (hash: string) => {
    httpClient.download(hash, id, name.toString());
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
    <div className={`mt-3 w-[600px] max-w-full ${className ? className : ""} `}>
      <label
        htmlFor={name as string}
        className={`flex flex-row flex-wrap lg:flex-nowrap justify-start gap-8 items-center w-full p-4 lg:h-36 cursor-pointer hover:bg-base-100 border border-opacity-10 ${
          readOnly ? "pointer-events-none border-none" : ""
        }`}
        tabIndex={0}
        onKeyDown={ev => handleKeyDown(ev)}
        onDrop={ev => handleDrop(ev)}
        onDragOver={ev => handleDragOver(ev)}
        onDragEnter={ev => handleDragEnter(ev)}
        onDragLeave={ev => handleDragLeave(ev)}
      >
        <input
          ref={inputRef}
          id={name as string}
          name={name as string}
          type="file"
          className="hidden"
          onChange={ev => handleFileChange(ev.target.files)}
          multiple={multiple}
          readOnly={readOnly}
          // accept=".pdf,.txt,.doc,.csv"
        />
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
          <div className="text-base font-bold font-['Montserrat'] mb-3">
            {label}
            {optional && !readOnly && (
              <span className="text-xs font-semibold uppercase rounded-lg bg-white bg-opacity-5 p-2 ml-3">
                Optional
              </span>
            )}
          </div>
          {files.length ? (
            <ul className="line-clamp-3" title={files.map(x => x.name).join("\n")}>
              {files.map(file => (
                <li key={file.name} className="flex items-center gap-2">
                  <div>
                    {file.name} (
                    <span className={file.size / 1024 > maxFileSizeKb ? "text-error" : ""}>
                      {file.size / 1000} KB
                    </span>
                    )
                  </div>
                  {file.hash && (
                    <button
                      className="btn btn-square pointer-events-auto"
                      onClick={() => download(file.hash!)}
                    >
                      <DownloadLogo />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <>
              <div className="text-zinc-400 text-sm font-normal font-['Montserrat'] leading-tight max">
                {subtitle}
              </div>
              {
                <div className=" text-zinc-400 text-sm font-normal font-['Montserrat'] leading-tight max">
                  Max File Size: 500 kilobytes. {/*File types: PDF, TXT, DOC, or CSV, Images. */}
                </div>
              }
            </>
          )}
        </div>
      </label>
    </div>
  );
};
