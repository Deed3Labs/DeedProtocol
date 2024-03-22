import React from "react";
import Link from "next/link";
import { RadioBoxesInput } from "~~/components/inputs/RadioBoxesInput";
import { PaymentOptions } from "~~/constants";
import { DeedInfoModel, PaymentInformationModel } from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";

interface Props {
  value?: PaymentInformationModel;
  onChange?: (ev: LightChangeEvent<DeedInfoModel>) => void;
}

const PaymentInformation = ({ value, onChange }: Props) => {
  const handleChange = (ev: LightChangeEvent<PaymentInformationModel>) => {
    const updatedValue = { ...value, [ev.name]: ev.value };
    onChange?.({ name: "paymentInformation", value: updatedValue });
  };
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="text-5xl font-['Coolvetica'] font-extra-condensed font-bold uppercase">
        4. Payment Information
      </div>
      <RadioBoxesInput
        name="paymentType"
        label="Select Payment Type"
        info
        description={
          <>
            <Link
              href="https://docs.deedprotocol.org/how-it-works/property-registration-guide"
              target="_blank"
            >
              Learn more
            </Link>
            &nbsp; about our Payment Options.
          </>
        }
        options={PaymentOptions}
        optionsClassName="w-auto h-[220px]"
        value={value?.paymentType}
        onChange={handleChange}
      />
    </div>
  );
};

export default PaymentInformation;
