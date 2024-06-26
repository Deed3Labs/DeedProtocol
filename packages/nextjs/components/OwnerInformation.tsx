import React from "react";
import Link from "next/link";
import { AddressInput } from "./scaffold-eth";
import { FileUploaderInput } from "~~/components/inputs/FileUploaderInput";
import { RadioBoxesInput } from "~~/components/inputs/RadioBoxesInput";
import { SelectInput } from "~~/components/inputs/SelectInput";
import TextInput from "~~/components/inputs/TextInput";
import { EntityTypeOptions, OwnerTypeOptions, StateOptions } from "~~/constants";
import useWallet from "~~/hooks/useWallet";
import { DeedInfoModel, OwnerInformationModel } from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";

interface Props {
  value?: OwnerInformationModel;
  onChange?: (ev: LightChangeEvent<DeedInfoModel>) => void;
  readOnly?: boolean;
}

const OwnerInformation = ({ value, onChange, readOnly }: Props) => {
  const { primaryWallet } = useWallet();

  const handleChange = (ev: LightChangeEvent<OwnerInformationModel>) => {
    const updatedValue = { ...value, [ev.name]: ev.value };
    onChange?.({ name: "ownerInformation", value: updatedValue });
  };

  return (
    <div className="flex flex-col mt-6 gap-6">
      <div className="text-5xl font-['Coolvetica'] font-extra-condensed font-bold uppercase">
        1. Owner Information
      </div>

      <RadioBoxesInput
        name="ownerType"
        label="Current Owner Type"
        info
        description={
          <>
            How do you currently hold this property? -&nbsp;
            <Link
              href="https://docs.deedprotocol.org/legal-framework/identity-verification"
              target="_blank"
            >
              Learn more
            </Link>
          </>
        }
        options={OwnerTypeOptions}
        optionsClassName="w-auto h-[200px]"
        onChange={handleChange}
        value={value?.ownerType}
        readOnly={readOnly}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-3 justify-start w-full">
        {value?.ownerType === "legal" && (
          <TextInput
            name="entityName"
            label="Entity Name"
            info
            placeholder="e.g. My Business Name, LLC."
            value={value?.entityName}
            onChange={handleChange}
            readOnly={readOnly}
          />
        )}
        <TextInput
          name="ownerName"
          label="First & Last Name"
          info
          placeholder="e.g. Johnny Appleseed"
          value={value?.ownerName}
          onChange={handleChange}
          readOnly={readOnly}
        />
        <TextInput
          name="ownerSuffix"
          label="Suffix"
          optional
          placeholder="e.g. Jr. or Sr."
          value={value?.ownerSuffix}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </div>
      <div className="flex flex-col">
        <label className="justify-start items-center inline-flex mb-3" htmlFor="owner">
          Wallet
        </label>
        <AddressInput
          className="input input-md sm:input-lg sm:text-[16px] flex flex-grow"
          name="walletAddress"
          placeholder="0x..."
          value={value?.walletAddress ?? primaryWallet?.address ?? ""}
          onChange={newValue => handleChange({ name: "walletAddress", value: newValue })}
        />
      </div>
      {value?.ownerType === "legal" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-3 justify-start w-full">
          <TextInput
            name="ownerPosition"
            label="Position"
            placeholder="e.g. CEO"
            value={value?.ownerPosition}
            onChange={handleChange}
            readOnly={readOnly}
          />
          <SelectInput
            name="ownerState"
            label="State of Incorporation"
            placeholder="Select State"
            options={StateOptions}
            value={value?.ownerState}
            onChange={handleChange}
            readOnly={readOnly}
          />
          <SelectInput
            name="ownerEntityType"
            label="Entity Type"
            options={EntityTypeOptions}
            placeholder="e.g. Corporation"
            value={value?.ownerEntityType}
            onChange={handleChange}
            readOnly={readOnly}
          />
        </div>
      )}
      <div className="mt-8">
        <label className="justify-start items-center inline-flex">
          <div className="text-base font-normal">Identity Verification</div>
          <span className="text-center text-xs font-normal font-['General_Sans'] leading-none ml-1">
            info
          </span>
        </label>
        <div className="text-zinc-400">
          <Link
            href="https://docs.deedprotocol.org/legal-framework/identity-verification#organizations-traditional-or-hybrid"
            target="_blank"
          >
            Learn more
          </Link>
          &nbsp;about Identity Verification.
        </div>
        <FileUploaderInput
          name="ids"
          label="ID or Passport"
          subtitle="This document is submited securely off-chain."
          value={value?.ids}
          onChange={handleChange}
          readOnly={readOnly}
          isRestricted={true}
        />
        <FileUploaderInput
          name="proofBill"
          label="Utility Bill or Other Document"
          subtitle="This document is submited securely off-chain."
          optional
          value={value?.proofBill}
          onChange={handleChange}
          readOnly={readOnly}
          isRestricted={true}
        />
      </div>
      {value?.ownerType === "legal" && (
        <div className="mt-8">
          <label className="justify-start items-center inline-flex">
            <div className="text-base font-normal">Entity Verification</div>
            <span className="text-center text-xs font-normal font-['General_Sans'] leading-none ml-1">
              info
            </span>
          </label>
          <div className="text-zinc-400">
            <Link
              href="https://docs.deedprotocol.org/legal-framework/identity-verification"
              target="_blank"
            >
              Learn more
            </Link>
            &nbsp;about Entity Verification.
          </div>
          <FileUploaderInput
            name="articleIncorporation"
            label="Articles of Incorporation"
            subtitle="This document is submited securely off-chain."
            value={value?.articleIncorporation}
            onChange={handleChange}
            readOnly={readOnly}
            isRestricted={true}
          />
          <FileUploaderInput
            name="operatingAgreement"
            label="Operating Agreement"
            subtitle="This document is submited securely off-chain."
            optional
            value={value?.operatingAgreement}
            onChange={handleChange}
            readOnly={readOnly}
            isRestricted={true}
          />
          <FileUploaderInput
            name="supportingDoc"
            label="Any other Supporting Documents"
            subtitle="This document is submited securely off-chain."
            optional
            multiple
            value={value?.supportingDoc}
            onChange={handleChange}
            readOnly={readOnly}
            isRestricted={true}
          />
        </div>
      )}
    </div>
  );
};

export default OwnerInformation;
