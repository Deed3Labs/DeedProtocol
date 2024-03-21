import React from "react";
import Link from "next/link";
import { RadioBoxesInput } from "~~/components/inputs/RadioBoxesInput";
import { WrapperOptions } from "~~/constants";
import { DeedInfoModel, OtherInformationModel } from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";

interface Props {
  value?: OtherInformationModel;
  onChange?: (ev: LightChangeEvent<DeedInfoModel>) => void;
  readOnly?: boolean;
}

const OtherInformation = ({ value, onChange, readOnly }: Props) => {
  const handleChange = (ev: LightChangeEvent<OtherInformationModel>) => {
    const updatedValue = { ...value, [ev.name]: ev.value };
    onChange?.({ name: "otherInformation", value: updatedValue });
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="text-4xl font-['Coolvetica'] font-condensed uppercase">
        3. Other Information
      </div>
      <RadioBoxesInput
        name="wrapper"
        label="Customize your Wrapper type"
        description={
          <>
            <Link
              href="https://docs.deedprotocol.org/legal-framework/property-wrappers"
              target="_blank"
            >
              Learn more
            </Link>
            &nbsp;about each Wrapper type.
          </>
        }
        options={WrapperOptions(["$225.00", "$450.00"])}
        value={value?.wrapper}
        onChange={handleChange}
        readOnly={readOnly}
      />
      {/* The grid setup for the RadioBoxesInput's options should be modified as per the suggestion */}
      <div className="grid grid-cols-1 gap-4 mt-2">
        {WrapperOptions(["$225.00", "$450.00"]).map((option, index) => (
          <div key={index} className="border border-gray-700 p-4 rounded-lg bg-gray-800">
            <input
              id={`wrapper_option_${option.value}`}
              name="wrapper"
              type="radio"
              value={option.value}
              checked={value?.wrapper === option.value}
              onChange={() => handleChange({ value: option.value, name: "wrapper" })}
              className="hidden"
            />
            <label htmlFor={`wrapper_option_${option.value}`} className="block w-full cursor-pointer">
              <div className="text-lg font-bold text-white">{option.title}</div>
              <div className="text-white">{option.subtitle}</div>
              <div className="text-gray-400">{option.tag}</div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherInformation;
