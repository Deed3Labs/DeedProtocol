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
      <div className="grid grid-cols-4 flex-wrap gap-3 justify-start w-full">
        <TextInput
          className="col-span-2"
          name="cardNumber"
          label="Card Number"
          info
          placeholder="e.g. 1234 5678 1234 5678"
          value={value?.cardNumber}
          onChange={handleChange}
        />
        <TextInput
          name="cardExpiry"
          label="Expiration Date"
          placeholder="e.g. 02/2026"
          value={value?.cardExpiry}
          onChange={handleChange}
        />
        <TextInput
          name="cardCVV"
          label="Security Code (CVV)"
          placeholder="e.g. 123"
          value={value?.cardCVV}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-4 flex-wrap gap-3 justify-start w-full">
        <TextInput
          className="col-span-3"
          name="cardholderName"
          label="Cardholder Name"
          info
          placeholder="e.g. Johnny Appleseed"
          value={value?.cardholderName}
          onChange={handleChange}
        />
        <TextInput
          name="suffix"
          label="Suffix"
          optional
          placeholder="e.g. Jr. or Sr."
          value={value?.suffix}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-8 flex-wrap gap-3 justify-start w-full">
        <TextInput
          className="col-span-3"
          name="billingAddress"
          label="Billing Address"
          info
          placeholder="e.g. 123 Main Street, Unit 222"
          value={value?.billingAddress}
          onChange={handleChange}
        />
        <TextInput
          className="col-span-2"
          name="city"
          label="City or Region"
          placeholder="e.g. San Bernardino"
          value={value?.city}
          onChange={handleChange}
        />
        <SelectInput
          className="col-span-2"
          name="state"
          label="State or Region"
          placeholder="Select State"
          options={StateOptions}
          value={value?.state}
          onChange={handleChange}
        />
        <TextInput
          name="zip"
          label="Zip Code"
          placeholder="e.g. 92401"
          value={value?.zip}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default PaymentInformation;
