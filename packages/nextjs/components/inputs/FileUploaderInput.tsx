import { useEffect, useRef, useState } from "react";
import { LightChangeEvent } from "~~/models/light-change-event";
import { IconLightningSolid } from "~~/styles/Icons";

interface Props<TParent> {
  label: string;
  name: keyof TParent;
  subtitle: string;
  optional?: boolean;
  className?: string;
  value?: File | File[];
  multiple?: boolean;
  maxFileSizeKb?: number;
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
  maxFileSizeKb = 500,
}: Props<TParent>) => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (value) {
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

  function handleFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
    if (ev.target.files) {
      setFiles(Array.from(ev.target.files));
      // If multiple files are allowed, convert the FileList to an array
      const newValue = multiple ? Array.from(ev.target.files) : ev.target.files[0];
      onChange?.({
        name,
        value: newValue,
      });
    }
  }

  return (
    <div className={`mt-3 w-[600px] max-w-full ${className ? className : ""}`}>
      <label
        htmlFor={name as string}
        className="flex flex-row flex-wrap lg:flex-nowrap justify-start gap-8 items-center w-full p-4 lg:h-36 border border-white border-opacity-10 cursor-pointer hover:bg-base-100"
        tabIndex={0}
        onKeyDown={ev => handleKeyDown(ev)}
      >
        <input
          ref={inputRef}
          id={name as string}
          name={name as string}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          multiple={multiple}
          accept=".pdf,.txt,.doc,.csv"
        />
        <div className="w-12 h-12 lg:w-24 lg:h-24 mb-2 p-1 lg:p-6 border border-white border-opacity-10 border-dashed justify-start items-center inline-flex">
          <div className="grow shrink basis-0 self-stretch p-1 bg-neutral-900 rounded flex-col justify-center items-center inline-flex">
            <div className="self-stretch grow shrink basis-0 pl-1 pr-0.5 pt-px flex-col justify-center items-center flex">
              <IconLightningSolid />
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-wrap gap-2">
          <div className="text-base font-bold font-['Montserrat'] mb-3">
            {label}
            {optional && (
              <span className="text-xs font-semibold uppercase rounded-lg bg-white bg-opacity-5 p-2 ml-3">
                Optional
              </span>
            )}
          </div>
          {files.length ? (
            <ul className="line-clamp-3" title={files.map(x => x.name).join("\n")}>
              {files.map(file => (
                <li key={file.name}>
                  {file.name} (
                  <span className={file.size / 1000 > maxFileSizeKb ? "text-error" : ""}>
                    {file.size / 1000} KB
                  </span>
                  )
                </li>
              ))}
            </ul>
          ) : (
            <>
              <div className="text-zinc-400 text-sm font-normal font-['Montserrat'] leading-tight max">
                {subtitle}
              </div>
              <div className=" text-zinc-400 text-sm font-normal font-['Montserrat'] leading-tight max">
                Max File Size: 500 kilobytes. File types: PDF, TXT, DOC, or CSV.
              </div>
            </>
          )}
        </div>
      </label>
    </div>
  );
};
