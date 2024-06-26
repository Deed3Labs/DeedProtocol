import React, { useMemo } from "react";
import Link from "next/link";
import { FileUploaderInput } from "~~/components/inputs/FileUploaderInput";
import { RadioBoxesInput } from "~~/components/inputs/RadioBoxesInput";
import { SelectInput } from "~~/components/inputs/SelectInput";
import TextInput from "~~/components/inputs/TextInput";
import {
  PropertySubtypeOptions,
  PropertyTypeOptions,
  PropertyZoningOptions,
  StateOptions,
  VehicleMakeOptions,
  getVehicleModelsOptions,
} from "~~/constants";
import { DeedInfoModel, PropertyDetailsModel } from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";

interface Props {
  value: PropertyDetailsModel;
  onChange?: (ev: LightChangeEvent<DeedInfoModel>) => void;
  readOnly?: boolean;
  isDraft?: boolean;
}

const PropertyDetails = ({ value, onChange, readOnly, isDraft = false }: Props) => {
  const vehicleModelsOptions = useMemo(
    () => getVehicleModelsOptions(value.vehicleMake),
    [value.vehicleMake],
  );

  const handleChange = (ev: LightChangeEvent<PropertyDetailsModel>) => {
    const updatedValue = { ...value, [ev.name]: ev.value };
    onChange?.({
      name: "propertyDetails",
      value: updatedValue,
    });
  };

  return (
    <div className="flex flex-col mt-6 gap-6">
      <div className="text-5xl font-['Coolvetica'] font-extra-condensed font-bold uppercase">
        2. Property Details
      </div>
      <RadioBoxesInput
        name="propertyType"
        label="Select Property Type"
        description={
          <>
            <Link
              href="https://docs.deedprotocol.org/how-it-works/property-registration-guide#step-2-submit-property-details"
              target="_blank"
            >
              Learn more
            </Link>
            &nbsp; about Property Types.
          </>
        }
        info
        options={PropertyTypeOptions}
        optionsClassName="w-auto h-[220px]"
        onChange={handleChange}
        value={value?.propertyType}
        readOnly={readOnly}
      />

      {value?.propertyType === "vehicle" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-3 justify-start w-full">
            {/* Vehicle-specific text inputs */}
            <TextInput
              name="vehicleIdentificationNumber"
              label="Vehicle Identification Number (VIN)"
              placeholder="e.g. 1HGBH41JXMN109186"
              value={value?.vehicleIdentificationNumber}
              onChange={handleChange}
              readOnly={readOnly}
            />
            <TextInput
              name="yearOfManufacture"
              label="Year of Manufacture"
              placeholder="e.g. 1981"
              value={value?.yearOfManufacture}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-3 justify-start w-full">
            {/* Vehicle-specific select inputs */}
            <TextInput
              name="currentMileage"
              label="Current Mileage"
              placeholder="e.g. 135,000 mi"
              value={value?.currentMileage}
              onChange={handleChange}
              readOnly={readOnly}
            />
            <SelectInput
              name="vehicleMake"
              label="Vehicle Make"
              options={VehicleMakeOptions}
              placeholder="Select Make"
              value={value?.vehicleMake}
              onChange={handleChange}
              readOnly={readOnly}
            />
            <SelectInput
              name="vehicleModel"
              label="Vehicle Model"
              options={vehicleModelsOptions}
              placeholder="Select Model"
              value={value?.vehicleModel}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-3 justify-start w-full">
            {/* Real Estate-specific text inputs */}
            <TextInput
              name="propertyAddress"
              label="APN # or Street Address"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-3 justify-start w-full">
            {/* Real Estate-specific select inputs */}
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
        </>
      )}
      <div>
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-normal leading-normal">Property Image</div>
          <div className="text-center text-xs font-['General_Sans'] leading-none ml-1">info</div>
        </div>
        <div className="text-zinc-400">
          Upload image -&nbsp;
          <Link href="w" target="_blank">
            Learn more
          </Link>
        </div>
        <FileUploaderInput
          name="propertyImages"
          label="Property Image"
          subtitle="You may change this after registering your property"
          optional
          multiple
          value={value?.propertyImages}
          onChange={handleChange}
          readOnly={readOnly}
          isRestricted={isDraft}
        />
      </div>
      <div className="flex flex-col">
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-normal leading-normal">Proof of Ownership</div>
          <div className="text-center text-xs font-['General_Sans'] leading-none ml-1">info</div>
        </div>
        <div className="text-zinc-400">
          <Link
            href="https://docs.deedprotocol.org/how-it-works/property-registration-guide#step-3-provide-proof-of-ownership"
            target="_blank"
          >
            Learn more
          </Link>
          &nbsp;about property ownership validation.
        </div>
        <FileUploaderInput
          name="propertyDeedOrTitle"
          label="Deed or Title"
          subtitle="This document is stored securely on-chain via IPFS."
          value={value?.propertyDeedOrTitle}
          onChange={handleChange}
          readOnly={readOnly}
          isRestricted={true}
        />
        <FileUploaderInput
          name="propertyPurchaseContract"
          label="Purchase Contract"
          subtitle="This document is stored securely on-chain via IPFS."
          optional
          value={value?.propertyPurchaseContract}
          onChange={handleChange}
          readOnly={readOnly}
          isRestricted={true}
        />
      </div>
    </div>
  );
};

export default PropertyDetails;
