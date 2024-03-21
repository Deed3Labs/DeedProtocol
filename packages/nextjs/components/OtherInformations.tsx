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

const OtherInformations = ({ value, onChange, readOnly }: Props) => {
  const handleChange = (ev: LightChangeEvent<OtherInformationModel>) => {
    const updatedValue = { ...value, [ev.name]: ev.value };
    onChange?.({ name: "otherInformation", value: updatedValue });
  };

  // Use optionsClassName to pass custom class names for the grid layout
  // Ensure your global styles or component styles include definitions for these classes
  const customGridClass = "grid-cols-1"; // Ensures a single column layout

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
        optionsClassName={`w-full ${customGridClass}`} // Apply custom grid class along with full width
        value={value?.wrapper}
        onChange={handleChange}
        readOnly={readOnly}
      />
    </div>
  );
};

export default OtherInformations;
