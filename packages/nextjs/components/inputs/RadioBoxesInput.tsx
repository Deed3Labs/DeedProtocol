import React from 'react';
import { LightChangeEvent } from '~~/models/light-change-event';

interface Props<TParent> {
  name: keyof TParent;
  className?: string;
  options: RadioBoxOption[] | Readonly<RadioBoxOption[]>;
  value?: TParent[keyof TParent];
  label?: string;
  description?: string | React.ReactNode;
  info?: boolean;
  optionsClassName?: string;
  gridTemplate?: string; // New prop for grid template customization
  onChange?: (value: LightChangeEvent<TParent>) => void;
  readOnly?: boolean;
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
  description,
  label,
  info,
  options,
  value,
  optionsClassName,
  gridTemplate = 'grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-3', // Default grid template
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

  return (
    <div>
      {label && (
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-bold leading-normal">{label}</div>
          {info && <div className="text-center text-xs font-['Inter'] leading-none ml-1">info</div>}
        </div>
      )}
      {description && <div className="text-secondary">{description}</div>}
      <div className={`grid ${gridTemplate} items-start justify-start w-full mt-2`}>
        {options.map((option, index) => (
          <div key={index} title={option.disabled ? "Coming soon" : undefined}>
            <input
              id={`option_${option.value}`}
              name={String(name)}
              type="radio"
              value={option.value ?? ""}
              checked={value === option.value}
              onChange={() => onChange?.({ value: option.value as TParent[keyof TParent], name })}
              className="peer hidden"
              readOnly={readOnly}
            />
            <label
              htmlFor={`option_${option.value}`}
              className={`flex flex-col gap-2 justify-between p-4 border-2 border-white border-opacity-10 cursor-pointer peer-checked:border-red-500 hover:bg-base-100 ${
                optionsClassName || ''
              } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onKeyDown={(ev) => handleKeyDown(ev, option.value as TParent[keyof TParent])}
            >
              {option.icon}
              <span className="text-xl font-bold">{option.title}</span>
              {option.subtitle && <span className="text-sm">{option.subtitle}</span>}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

