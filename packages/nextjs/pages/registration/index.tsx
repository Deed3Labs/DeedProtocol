import React from "react";
import Link from "next/link";
import OtherInformations from "./OtherInformations";
import OwnerInformation from "./OwnerInformation";
import PropertyDetails from "./PropertyDetails";
import { NextPage } from "next";
import { useDeedNftMint } from "~~/hooks/contracts/deed-nft-hooks";
import PropertyRegistrationModel from "~~/models/property-registration.model";

// const steps = [
//   "Owner Information",
//   "Property Details",
//   "Other Informations",
//   "Payment",
//   "Wait for validation",
// ];

const RegistrationForm: NextPage = () => {
  // const [step, setStep] = useState(0);
  const { writeAsync, isLoading, isIdle, isSuccess, data } = useDeedNftMint();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    writeAsync(Object.fromEntries(formData.entries()) as unknown as PropertyRegistrationModel);
  };

  return (
    <div className="container pt-10">
      <div className="flex flex-row flex-wrap-reverse gap-8 lg:flex-nowrap lg:justify-evenly w-full px-8 xl:px-32">
        <div className="flex flex-col w-full lg:w-fit">
          <div className="text-3xl font-normal font-['KronaOne']">
            First, we’ll need to <br />
            collect some information
          </div>
          <div className="text-base font-normal font-['Montserrat'] mt-3">
            You’ll need to complete the form below in order to register, transfer and mint the new
            <br />
            Digital Deed that will now represent your property.&nbsp;
            <Link
              className="link link-accent"
              href="https://docs.deedprotocol.org/how-it-works/property-registration-guide"
              target="_blank"
            >
              Learn about Property Registration.
            </Link>
          </div>
          {/* <ul className="steps steps-vertical">
            {steps.map((s, i) => (
              <li
                key={s}
                className={`step ${step >= i ? "step-success" : ""}`}
                onClick={() => setStep(i)}
              ></li>
            ))}
          </ul> */}
          <form onSubmit={handleSubmit}>
            <OwnerInformation />
            <PropertyDetails />
            <OtherInformations />
            <div className="m-8 w-full text-right">
              <input type="submit" className="btn btn-lg bg-gray-600" />
            </div>
            <div>
              {isLoading && (
                <div>
                  Transaction Hash: {data?.hash}
                  <div className="loading loading-spinner"></div>
                </div>
              )}
              {!isLoading && isSuccess && <div>Succeed</div>}
            </div>
          </form>
        </div>
        <div className="bg-base-100 p-9 w-full lg:w-96 h-fit relative lg:sticky lg:top-32 lg:max-h-[75vh] overflow-y-auto">
          <div className="text-base font-bold font-['Montserrat'] leading-normal">
            After your registration is validated you’ll be able to:
          </div>
          <div className="flex flex-row gap-2 my-2">
            <div className="h-6 p-3 rounded-full bg-secondary opacity-10 mt-1"></div>
            <div className="flex flex-col">
              <div>Manage your property</div>
              <div className="text-secondary-content">
                Update property details, view earnings, add managers and etc.
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2 my-2">
            <div className="h-6 p-3 rounded-full bg-secondary opacity-10 mt-1"></div>
            <div className="flex flex-col">
              <div>Sell or Lease your Property</div>
              <div className="text-secondary-content">
                Accept offers, stage auctions and lease properties all in one place.
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2 my-2">
            <div className="h-6 p-3 rounded-full bg-secondary opacity-10 mt-1"></div>
            <div className="flex flex-col">
              <div>Advertise your Property</div>
              <div className="text-secondary-content">
                Customize your pages by adding photos, videos and renderings.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
