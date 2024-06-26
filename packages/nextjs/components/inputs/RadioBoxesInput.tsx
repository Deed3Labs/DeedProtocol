import React from "react";
import { LightChangeEvent } from "~~/models/light-change-event";

interface Props<TParent> {
  name: keyof TParent;
  className?: string;
  options: RadioBoxOption[] | Readonly<RadioBoxOption[]>;
  value?: TParent[keyof TParent];
  label?: string;
  description?: string | React.ReactNode;
  info?: boolean;
  optionsClassName?: string;
  gridTemplate?: string; // New prop for controlling the grid layout
  onChange?: (value: LightChangeEvent<TParent>) => void;
  readOnly?: boolean;
}

export interface RadioBoxOption {
  title: string;
  tag?: string;
  subtitle?: string;
  value: string;
  icon?: React.ReactNode; // Ensure this is correctly typed to accept React nodes
  disabled?: boolean;
}

export const RadioBoxesInput = <TParent,>({
  name,
  description,
  label,
  info,
  options,
  value,
  optionsClassName,
  gridTemplate, // Utilize the new prop
  onChange,
  readOnly,
}: Props<TParent>) => {
  const handleKeyDown = (
    ev: React.KeyboardEvent<HTMLLabelElement>,
    newValue: TParent[keyof TParent],
  ) => {
    if (ev.key === "Enter") {
      onChange?.({ value: newValue, name });
    }
  };

  // Apply the custom gridTemplate if provided, otherwise fallback to the default grid layout
  const gridLayout = gridTemplate || "grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-3";

  return (
    <div>
      {label && (
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-normal leading-normal">{label}</div>
          {info && (
            <div className="text-center text-xs font-['Coolvetica'] leading-none ml-1">info</div>
          )}
        </div>
      )}
      {description && <div className="font-normal text-zinc-400">{description}</div>}
      <div className={`${gridLayout} items-start justify-start w-full mt-2`}>
        {options.map(option => {
          if (readOnly && option.value !== value) return null;
          return (
            <div key={option.value} title={option.disabled ? "Coming soon" : undefined}>
              <input
                id={`option_${option.value}`}
                name={name as string}
                type="radio"
                value={option.value ?? ""}
                checked={value === option.value}
                onChange={() => onChange?.({ value: option.value as TParent[keyof TParent], name })}
                className="peer hidden"
                readOnly={readOnly}
              />
              <label
                className={`flex flex-col gap-2 justify-between p-4 border-[1px] peer-checked:border-2 border-white border-opacity-10 cursor-pointer px-4 py-6 peer-checked:border-red-100 hover:bg-base-100 max-w-7xl ${
                  option.disabled && "pointer-events-none opacity-50"
                } ${readOnly && "pointer-events-none border-none !py-0"} ${
                  optionsClassName && !readOnly ? optionsClassName : ""
                }`}
                htmlFor={`option_${option.value}`}
                tabIndex={option.disabled ? undefined : 0}
                onKeyDown={ev => handleKeyDown(ev, option.value as TParent[keyof TParent])}
              >
                {!readOnly &&
                  (option.icon ? (
                    option.icon
                  ) : (
                    <div className="w-8 h-8 px-1 pt-px bg-white bg-opacity-5 rounded-full" />
                  ))}

                <span className="text-lg font-normal mt-2">{option.title}</span>
                {option.tag && !readOnly && (
                  <div className="p-2 bg-white bg-opacity-5 rounded-lg w-fit">
                    <div className="text-[10px] uppercase text-zinc-400 tracking-widest">
                      {option.tag}
                    </div>
                  </div>
                )}
                {option.subtitle && (
                  <div className="text-zinc-400 text-sm font-normal leading-tight whitespace-pre-line">
                    {option.subtitle}
                  </div>
                )}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
