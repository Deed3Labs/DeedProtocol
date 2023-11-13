import React from "react";

interface Props {
  label: string;
  placeholder: string;
  name: string;
  optional?: boolean;
  large?: boolean;
  info?: boolean;
  className?: string;
}

const TextInput = ({
  label,
  placeholder,
  name,
  optional,
  info,
  large = true,
  className,
}: Props) => {
  return (
    <div className={`flex flex-col ${className ? className : ""}`}>
      <label className="justify-start items-center inline-flex mb-3" htmlFor="entityName">
        <div className="text-base font-bold font-['Montserrat']">{label}</div>
        {info && (
          <div className="text-center text-xs font-normal font-['Inter'] leading-none ml-1">
            info
          </div>
        )}
        {optional && (
          <span className="text-xs font-semibold uppercase rounded-lg bg-white bg-opacity-5 p-2 ml-2 mb-[-4px] mt-[-4px]">
            Optional
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        className={`input ${large ? "input-lg" : ""} input-bordered`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextInput;
