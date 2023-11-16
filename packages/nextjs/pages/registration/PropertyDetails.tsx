import React, { useState } from "react";
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

interface Props {}

const PropertyDetails = ({}: Props) => {
  const [propertyType, setPropertyType] = useState("realEstate");
  const [propertyImages, setPropertyImages] = useState<File[]>();
  const [deedOrTitle, setDeedOrTitle] = useState<File>();
  const [purchaseContract, setPurchaseContract] = useState<File>();
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="text-2xl font-['KronaOne'] leading-10">2. Property Details</div>
      <RadioBoxesInput
        name="propertyType"
        options={PropertyTypeOptions}
        onChange={newValue => setPropertyType(newValue)}
        value={propertyType}
        optionsClassName="w-[180px] h-[210px]"
      />
      <div className="flex flex-row flex-wrap gap-3 justify-start w-full">
        <TextInput
          name="propertyAddress"
          label="APN # or Street Address"
          info
          placeholder="e.g. CEO"
        />
        <TextInput name="propertyCity" label="City or Region" placeholder="e.g. San Bernardino" />
        <SelectInput
          name="propertyState"
          label="State or Region"
          placeholder="Select State"
          options={StateOptions}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-5 justify-start w-full">
        <TextInput name="propertySize" label="Lot Size" optional placeholder="e.g. 3500 sqft" />
        <SelectInput
          name="propertySubType"
          label="Sub-Type"
          options={PropertySubtypeOptions}
          optional
          placeholder="Select Sub-Type"
        />
        <SelectInput
          name="propertyZoning"
          label="Zoning"
          optional
          options={PropertyZoningOptions}
          placeholder="Select Zoning"
          onChange={() => {}}
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
          label="Drag and drop or click to upload"
          subtitle="You may change this after registering your property"
          optional
          onChange={newValue => setPropertyImages(newValue as File[])}
          value={propertyImages}
          multiple
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
          name="deedOrTitle"
          label="Deed or Title"
          subtitle="This document is stored securely on-chain via IPFS."
          optional
          onChange={newValue => setDeedOrTitle(newValue as File)}
          value={deedOrTitle}
        />
        <FileUploaderInput
          name="purchaseContract"
          label="Purchase Contract"
          subtitle="This document is stored securely on-chain via IPFS."
          optional
          onChange={newValue => setPurchaseContract(newValue as File)}
          value={purchaseContract}
        />
      </div>
    </div>
  );
};

export default PropertyDetails;
