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

  // Inline style for the grid layout
  const radioInputGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr', // Ensures single-column layout
    gap: '20px', // Space between options
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="text-4xl font-['Coolvetica'] font-condensed uppercase">
        3. Other Information
      </div>
      <div style={radioInputGridStyle}> {/* Apply the inline style here */}
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
      </div>
    </div>
  );
};

export default OtherInformation;
