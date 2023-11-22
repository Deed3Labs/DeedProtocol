import React from "react";
import { FileUploaderInput } from "~~/components/inputs/FileUploaderInput";
import { RadioBoxesInput } from "~~/components/inputs/RadioBoxesInput";
import { SelectInput } from "~~/components/inputs/SelectInput";
import TextInput from "~~/components/inputs/TextInput";
import {
  PropertySubtypeOptions,
  PropertyTypeOptions,
  PropertyZoningOptions,
  StateOptions,
} from "~~/constants";
import { LightChangeEvent } from "~~/models/light-change-event";
import {
  PropertyDetailsModel,
  PropertyRegistrationModel,
} from "~~/models/property-registration.model";

interface Props {
  value?: PropertyDetailsModel;
  onChange?: (ev: LightChangeEvent<PropertyRegistrationModel>) => void;
}

const PropertyDetails = ({ value, onChange }: Props) => {
  const handleChange = (ev: LightChangeEvent<PropertyDetailsModel>) => {
    const updatedValue = { ...value, [ev.name]: ev.value };
    onChange?.({
      name: "propertyDetails",
      value: updatedValue,
    });
  };
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="text-2xl font-['KronaOne'] leading-10">2. Property Details</div>
      <RadioBoxesInput
        name="propertyType"
        options={PropertyTypeOptions}
        label="Select Property Type"
        info
        optionsClassName="w-[180px] h-[210px]"
        onChange={handleChange}
        value={value?.propertyType}
      />
      <div className="flex flex-row flex-wrap gap-3 justify-start w-full">
        <TextInput
          name="propertyAddress"
          label="APN # or Street Address"
          info
          placeholder="e.g. CEO"
          value={value?.propertyAddress}
          onChange={handleChange}
        />
        <TextInput
          name="propertyCity"
          label="City or Region"
          placeholder="e.g. San Bernardino"
          value={value?.propertyCity}
          onChange={handleChange}
        />
        <SelectInput
          name="propertyState"
          label="State or Region"
          placeholder="Select State"
          options={StateOptions}
          value={value?.propertyState}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-5 justify-start w-full">
        <TextInput
          name="propertySize"
          label="Lot Size"
          optional
          placeholder="e.g. 3500 sqft"
          value={value?.propertySize}
          onChange={handleChange}
        />
        <SelectInput
          name="propertySubType"
          label="Sub-Type"
          options={PropertySubtypeOptions}
          optional
          placeholder="Select Sub-Type"
          value={value?.propertySubType}
          onChange={handleChange}
        />
        <SelectInput
          name="propertyZoning"
          label="Zoning"
          optional
          options={PropertyZoningOptions}
          placeholder="Select Zoning"
          value={value?.propertyZoning}
          onChange={handleChange}
        />
      </div>
      <div>
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-bold font-['Montserrat'] leading-normal">
            Property Image
          </div>
          <div className="text-center text-xs font-['Inter'] leading-none ml-1">info</div>
        </div>
        <FileUploaderInput
          name="propertyImages"
          label="Upload images of your property"
          subtitle="You may change this after registering your property"
          optional
          multiple
          value={value?.propertyImages}
          onChange={handleChange}
        />
      </div>
      <div>
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-bold font-['Montserrat'] leading-normal">
            Proof of Ownership
          </div>
          <div className="text-center text-xs font-['Inter'] leading-none ml-1">info</div>
        </div>
        <FileUploaderInput
          name="propertyDeedOrTitle"
          label="Deed or Title"
          subtitle="This document is stored securely on-chain via IPFS."
          value={value?.propertyDeedOrTitle}
          onChange={handleChange}
        />
        <FileUploaderInput
          name="propertyPurchaseContract"
          label="Purchase Contract"
          subtitle="This document is stored securely on-chain via IPFS."
          optional
          value={value?.propertyPurchaseContract}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default PropertyDetails;
