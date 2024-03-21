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
      {/* Adjust RadioBoxesInput to fill the grid row */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
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
          onChange={handleChange}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default OtherInformation;
