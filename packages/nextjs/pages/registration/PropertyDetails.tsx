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
import { DeedInfoModel, PropertyDetailsModel } from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";

interface Props {
  value?: PropertyDetailsModel;
  onChange?: (ev: LightChangeEvent<DeedInfoModel>) => void;
  readOnly?: boolean;
}

const PropertyDetails = ({ value, onChange, readOnly }: Props) => {
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
        readOnly={readOnly}
      />
      <div className="flex flex-row flex-wrap gap-3 justify-start w-full">
        <TextInput
          name="propertyAddress"
          label="APN # and Street Address"
          info
          placeholder="e.g. 123 Main Street"
          value={value?.propertyAddress}
          onChange={handleChange}
          readOnly={readOnly}
        />
        <TextInput
          name="propertyCity"
          label="City or Region"
          placeholder="e.g. San Bernardino"
          value={value?.propertyCity}
          onChange={handleChange}
          readOnly={readOnly}
        />
        <SelectInput
          name="propertyState"
          label="State or Region"
          placeholder="Select State"
          options={StateOptions}
          value={value?.propertyState}
          onChange={handleChange}
          readOnly={readOnly}
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
          readOnly={readOnly}
        />
        <SelectInput
          name="propertySubType"
          label="Sub-Type"
          options={PropertySubtypeOptions}
          optional
          placeholder="Select Sub-Type"
          value={value?.propertySubType}
          onChange={handleChange}
          readOnly={readOnly}
        />
        <SelectInput
          name="propertyZoning"
          label="Zoning"
          optional
          options={PropertyZoningOptions}
          placeholder="Select Zoning"
          value={value?.propertyZoning}
          onChange={handleChange}
          readOnly={readOnly}
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
          readOnly={readOnly}
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
          readOnly={readOnly}
        />
        <FileUploaderInput
          name="propertyPurchaseContract"
          label="Purchase Contract"
          subtitle="This document is stored securely on-chain via IPFS."
          optional
          value={value?.propertyPurchaseContract}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default PropertyDetails;
