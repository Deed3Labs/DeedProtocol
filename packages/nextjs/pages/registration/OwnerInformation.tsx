import React, { useState } from "react";
import Link from "next/link";
import { FileUploader } from "~~/components/inputs/FileUploader";
import { RadioBoxes } from "~~/components/inputs/RadioBoxes";
import { SelectInput } from "~~/components/inputs/SelectInput";
import TextInput from "~~/components/inputs/TextInput";
import { EntityTypeOptions, OwnerTypeOptions } from "~~/constants";

interface Props {}

const OwnerInformation = ({}: Props) => {
  const [ownerType, setOwnerType] = useState<"individual" | "legal">("individual");
  const [proofBill, setProofBill] = useState<File>();
  const [ids, setIds] = useState<File>();
  const [articleIncorporation, setArticleIncorporation] = useState<File>();
  const [operatingAgreement, setOperatingAgreement] = useState<File>();
  const [supportingDocs, setSupportingDocs] = useState<File[]>();

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="text-2xl font-['KronaOne'] leading-10">1. Owner Information</div>
      <div>
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-bold font-['Montserrat'] leading-normal">
            Current Owner Type
          </div>
          <div className="text-center text-xs font-['Inter'] leading-none ml-1">info</div>
        </div>
        <RadioBoxes
          fieldName="ownerType"
          onChange={newValue => setOwnerType(newValue as any)}
          options={OwnerTypeOptions}
          value={ownerType}
          optionsClassName="w-[180px] h-[180px]"
        ></RadioBoxes>
      </div>
      <div className="flex flex-row flex-wrap gap-3 justify-start w-full">
        {ownerType === "legal" && (
          <TextInput
            name="entityName"
            label="Entity Name"
            info
            placeholder="e.g. My Business Name, LLC."
          />
        )}
        <TextInput
          name="ownerName"
          label="First & Last Name"
          info
          placeholder="e.g. Johnny Appleseed"
        />
        <TextInput name="ownerSuffix" label="Suffix" optional placeholder="e.g. Jr. or Sr." />
      </div>
      {ownerType === "legal" && (
        <div className="flex flex-row flex-wrap gap-3 justify-start w-full">
          <TextInput name="ownerPosition" label="Position" placeholder="e.g. CEO" />
          <SelectInput
            name="entityType"
            label="Entity Type"
            options={EntityTypeOptions}
            onChange={() => {}}
            placeholder="e.g. LLC, Corporation, etc."
          />
        </div>
      )}
      <div className="mt-8">
        <label className="justify-start items-center inline-flex mb-3">
          <div className="text-base font-bold font-['Montserrat']">Identity Verification</div>
          <span className="text-center text-xs font-normal font-['Inter'] leading-none ml-1">
            info
          </span>
        </label>
        <div>
          <Link
            className="text-accent"
            href="https://docs.deedprotocol.org/legal-framework/identity-verification#organizations-traditional-or-hybrid"
            target="_blank"
          >
            Learn more
          </Link>
          &nbsp;about Identity Verification.
        </div>
        <FileUploader
          name="ids"
          label="ID or Passport"
          subtitle="This document is submited securely off-chain."
          onChange={newValue => setIds(newValue as File)}
          value={ids}
        />
        <FileUploader
          name="proofBill"
          label="Utility Bill or Other Document"
          subtitle="This document is submited securely off-chain."
          optional
          onChange={newValue => setProofBill(newValue as File)}
          value={proofBill}
        />
      </div>
      <div className="mt-8">
        <label className="justify-start items-center inline-flex mb-3">
          <div className="text-base font-bold font-['Montserrat']">Entity Verification</div>
          <span className="text-center text-xs font-normal font-['Inter'] leading-none ml-1">
            info
          </span>
        </label>
        <div>
          <Link
            className="text-accent"
            href="https://docs.deedprotocol.org/legal-framework/identity-verification"
            target="_blank"
          >
            Learn more
          </Link>
          &nbsp;about Entity Verification.
        </div>
        <FileUploader
          name="articleIncorporation"
          label="Articles of Incorporation"
          subtitle="This document is submited securely off-chain."
          onChange={newValue => setArticleIncorporation(newValue as File)}
          value={articleIncorporation}
        />
        <FileUploader
          name="operatingAgreement"
          label="Operating Agreement"
          subtitle="This document is submited securely off-chain."
          optional
          onChange={newValue => setOperatingAgreement(newValue as File)}
          value={operatingAgreement}
        />
        <FileUploader
          name="supportingDoc"
          label="Any other Supporting Documents"
          subtitle="This document is submited securely off-chain."
          optional
          onChange={newValue => setSupportingDocs(newValue as File[])}
          value={supportingDocs}
          multiple
        />
      </div>
    </div>
  );
};

export default OwnerInformation;
