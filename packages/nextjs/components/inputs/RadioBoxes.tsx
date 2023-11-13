interface Props {
  fieldName: string;
  className?: string;
  options: RadioBoxOption[];
  value?: string;
  optionsClassName?: string;
  onChange: (value: string) => void;
}

export interface RadioBoxOption {
  title: string;
  tag: string;
  subtitle?: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const RadioBoxes = ({ fieldName, options, value, optionsClassName, onChange }: Props) => {
  const handleKeyDown = (ev: React.KeyboardEvent<HTMLLabelElement>, value: string) => {
    if (ev.key === "Enter") {
      onChange(value);
    }
  };
  return (
    <div className="flex flex-row flex-wrap justify-start gap-4 mt-2">
      {options.map(option => (
        <div key={option.value} title={option.disabled ? "Coming soon" : undefined}>
          <input
            id={`option_${option.value}`}
            name={fieldName}
            type="radio"
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            className={`peer hidden`}
          />
          <label
            className={`flex flex-col gap-2 justify-between p-4 border-2 border-white border-opacity-10 cursor-pointer px-4 py-6 peer-checked:border-red-100 hover:bg-base-100 ${
              option.disabled && "pointer-events-none opacity-50"
            } ${optionsClassName ? optionsClassName : ""}`}
            htmlFor={`option_${option.value}`}
            tabIndex={option.disabled ? undefined : 0}
            onKeyDown={ev => handleKeyDown(ev, option.value)}
          >
            {option.icon ? (
              option.icon
            ) : (
              <div className="w-8 h-8 px-1 pt-px bg-white bg-opacity-5 rounded-full"></div>
            )}

            <span className="text-xl font-bold mt-2">{option.title}</span>
            <div className="p-2 bg-white bg-opacity-5 rounded-lg w-fit">
              <div className="text-xs font-['Montserrat']">{option.tag}</div>
            </div>
            {option.subtitle && (
              <div className="text-zinc-400 text-sm font-normal font-['Montserrat'] leading-tight">
                {option.subtitle}
              </div>
            )}
          </label>
        </div>
      ))}
    </div>
  );
};
