import { LightChangeEvent } from "~~/models/light-change-event";

interface Props<TParent> {
  name: keyof TParent;
  className?: string;
  options: RadioBoxOption[] | Readonly<RadioBoxOption[]>;
  value?: TParent[keyof TParent];
  label?: string;
  info?: boolean;
  optionsClassName?: string;
  onChange?: (value: LightChangeEvent<TParent>) => void;
}

export interface RadioBoxOption {
  title: string;
  tag?: string;
  subtitle?: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
export const RadioBoxesInput = <TParent,>({
  name,
  label,
  info,
  options,
  value,
  optionsClassName,
  onChange,
}: Props<TParent>) => {
  const handleKeyDown = (
    ev: React.KeyboardEvent<HTMLLabelElement>,
    newValue: TParent[keyof TParent],
  ) => {
    if (ev.key === "Enter") {
      onChange?.({ value: newValue, name });
    }
  };
  return (
    <div>
      <div className="justify-start items-center inline-flex mt-3">
        <div className="text-base font-bold font-['Montserrat'] leading-normal">{label}</div>
        {info && <div className="text-center text-xs font-['Inter'] leading-none ml-1">info</div>}
      </div>
      <div className="flex flex-row flex-wrap justify-start gap-4 mt-2">
        {options.map(option => (
          <div key={option.value} title={option.disabled ? "Coming soon" : undefined}>
            <input
              id={`option_${option.value}`}
              name={name as string}
              type="radio"
              value={option.value}
              checked={value ? option.value === value : undefined}
              onChange={() => onChange?.({ value: option.value as TParent[keyof TParent], name })}
              className={`peer hidden`}
            />
            <label
              className={`flex flex-col gap-2 justify-between p-4 border-2 border-white border-opacity-10 cursor-pointer px-4 py-6 peer-checked:border-red-100 hover:bg-base-100 max-w-7xl ${
                option.disabled && "pointer-events-none opacity-50"
              } ${optionsClassName ? optionsClassName : ""}`}
              htmlFor={`option_${option.value}`}
              tabIndex={option.disabled ? undefined : 0}
              onKeyDown={ev => handleKeyDown(ev, option.value as TParent[keyof TParent])}
            >
              {option.icon ? (
                option.icon
              ) : (
                <div className="w-8 h-8 px-1 pt-px bg-white bg-opacity-5 rounded-full"></div>
              )}

              <span className="text-xl font-bold mt-2">{option.title}</span>
              {option.tag && (
                <div className="p-2 bg-white bg-opacity-5 rounded-lg w-fit">
                  <div className="text-xs font-['Montserrat']">{option.tag}</div>
                </div>
              )}
              {option.subtitle && (
                <div className="text-zinc-400 text-sm font-normal font-['Montserrat'] leading-tight">
                  {option.subtitle}
                </div>
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
