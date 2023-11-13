import React, { useState } from "react";
import Link from "next/link";
import { RadioBoxes } from "~~/components/inputs/RadioBoxes";
import { BlockchainOptions, WrapperOptions } from "~~/constants";

interface Props {}

const OtherInformations = ({}: Props) => {
  const [blockchain, setBlockchain] = useState("gnosis");
  const [wrapper, setWrapper] = useState("trust");
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div>
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-bold font-['Montserrat'] leading-normal">
            Property Image
          </div>
          <div className="text-center text-xs font-['Inter'] leading-none ml-1">info</div>
        </div>
        <RadioBoxes
          fieldName="blockchain"
          options={BlockchainOptions}
          onChange={newValue => setBlockchain(newValue)}
          value={blockchain}
          optionsClassName="w-[180px] h-[220px]"
        />
      </div>
      <div>
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-bold font-['Montserrat'] leading-normal">
            Advanced settings
          </div>
        </div>
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-bold font-['Montserrat'] leading-normal">
            Customize your Weapper type
          </div>
        </div>
        <div>
          <Link
            className="text-accent"
            href="https://docs.deedprotocol.org/legal-framework/property-wrappers"
            target="_blank"
          >
            Learn more
          </Link>
          &nbsp;about each Wrapper type.
        </div>
        <RadioBoxes
          fieldName="wrapper"
          options={WrapperOptions}
          optionsClassName="w-full"
          onChange={newValue => setWrapper(newValue)}
          value={wrapper}
        />
      </div>
    </div>
  );
};

export default OtherInformations;
