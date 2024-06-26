import { LightChangeEvent } from "~~/models/light-change-event";

interface Props<TParent> {
  label: string;
  name: keyof TParent;
  options: { label: string; value: string }[] | Readonly<{ label: string; value: string }[]>;
  onChange?: (ev: LightChangeEvent<TParent>) => void;
  value?: string;
  className?: string;
  info?: boolean;
  optional?: boolean;
  placeholder?: string;
  large?: boolean;
  textSize?: string;
  readOnly?: boolean;
}

export const SelectInput = <TParent,>({
  label,
  name,
  options,
  onChange,
  value,
  info,
  optional,
  className,
  placeholder,
  large = true,
  readOnly,
}: Props<TParent>) => {
  return (
    <div className={`flex flex-col  ${className ? className : ""}`}>
      <label className="justify-start items-center inline-flex mb-3" htmlFor="state">
        <div className="text-base font-normal">{label}</div>
        {info && (
          <span className="text-center text-xs font-normal font-['General_Sans'] leading-none ml-1">
            info
          </span>
        )}
        {optional && (
          <span className="text-[10px] text-zinc-400 uppercase rounded-lg bg-white bg-opacity-5 p-2 ml-2 mb-[-4px] mt-[-4px] tracking-widest">
            Optional
          </span>
        )}
      </label>
      <select
        id={name as string}
        name={name as string}
        className={`select ${"text-base sm:text-base"} ${
          large ? "select-lg" : ""
        } border-white border-opacity-10 w-auto ${
          readOnly ? "bg-none !cursor-text select-text" : ""
        }`}
        onChange={ev => onChange?.({ name, value: ev.target.value })}
        value={value ?? "default"}
        disabled={readOnly}
      >
        <option disabled value="default">
          {placeholder}
        </option>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};
