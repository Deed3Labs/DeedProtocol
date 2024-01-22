import React from "react";
import Link from "next/link";
import { RadioBoxesInput } from "~~/components/inputs/RadioBoxesInput";
import { SelectInput } from "~~/components/inputs/SelectInput";
import TextInput from "~~/components/inputs/TextInput";
import { PaymentOptions, StateOptions } from "~~/constants";
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
      <div className="text-2xl font-['KronaOne'] leading-10">4. Payment Information</div>
      <div>
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-bold font-['Montserrat'] leading-normal">
            Select Payment Type
          </div>
          <div className="text-center text-xs font-['Inter'] leading-none ml-1">info</div>
        </div>
        <div>
          <Link
            className="link link-accent"
            href="https://docs.deedprotocol.org/general-information/overview"
            target="_blank"
          >
            Learn more
          </Link>
          &nbsp; about our Payment Options.
        </div>
        <RadioBoxesInput
          name="paymentType"
          options={PaymentOptions}
          optionsClassName="w-[180px] h-[220px]"
          value={value?.paymentType}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default PaymentInformation;
