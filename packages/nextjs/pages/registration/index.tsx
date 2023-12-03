import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import OtherInformations from "./OtherInformations";
import OwnerInformation from "./OwnerInformation";
import PropertyDetails from "./PropertyDetails";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { NextPage } from "next";
import { useDeedNftMint, useDeedNftValidate } from "~~/hooks/contracts/deed-nft-hooks";
import { LightChangeEvent } from "~~/models/light-change-event";
import {
  OwnerInformationModel,
  PropertyDetailsModel,
  PropertyRegistrationModel,
} from "~~/models/property-registration.model";
import { isDev } from "~~/utils/is-dev";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

// const steps = [
//   "Owner Information",
//   "Property Details",
//   "Other Informations",
//   "Payment",
//   "Wait for validation",
// ];

const fakeData: PropertyRegistrationModel = {
  ownerInformation: {
    ownerName: "John Doe",
    ownerSuffix: "Jr.",
    ownerType: "individual",
    entityName: "",
    ownerPosition: "",
    ownerState: "CA",
    ownerEntityType: "LLC",
  } as OwnerInformationModel,
  propertyDetails: {
    propertyType: "realEstate",
    propertyAddress: "1234 Main St",
    propertyCity: "San Francisco",
    propertyState: "CA",
    propertyZoning: "commercial",
    propertySize: "0.5 acres",
    propertySubType: "land",
  } as PropertyDetailsModel,
  otherInformation: {
    blockchain: "gnosis",
    wrapper: "llc",
  },
};

const defaultData: PropertyRegistrationModel = {
  otherInformation: {
    blockchain: "gnosis",
    wrapper: "llc",
  },
  ownerInformation: {
    ownerType: "individual",
  },
  propertyDetails: {},
} as PropertyRegistrationModel;

const RegistrationForm: NextPage = () => {
  // const [step, setStep] = useState(0);
  const { query, isReady } = useRouter();
  const id = query.id;
  const { writeAsync } = useDeedNftMint();
  const { writeValidateAsync: writeValidateAsync } = useDeedNftValidate();

  const { authToken } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<PropertyRegistrationModel>(defaultData);

  (window as any).enableFakeData = () => {
    if (isDev() && !id) {
      const createFile = (id: string, content: string) => {
        const myFile = new File([content], `${id}.txt`, {
          type: "text/plain",
          lastModified: Date.now(),
        });
        const fileInput = document.querySelector(`#${id}`) as HTMLInputElement;
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(myFile);
        fileInput.files = dataTransfer.files;
        return myFile;
      };

      setFormData(fakeData);

      setFormData(prevState => ({
        ...prevState,
        ownerInformation: { ...formData.ownerInformation, ids: createFile("ids", "ids") },
      }));

      setFormData(prevState => ({
        ...prevState,
        ownerInformation: {
          ...formData.ownerInformation,
          articleIncorporation: createFile("articleIncorporation", "articleIncorporation"),
        },
      }));

      setFormData(prevState => ({
        ...prevState,
        propertyDetails: {
          ...formData.propertyDetails,
          propertyDeedOrTitle: createFile("propertyDeedOrTitle", "propertyDeedOrTitle"),
        },
      }));
    }
  };

  useEffect(() => {
    if (id && authToken) {
      fetchDeedInfo(+id, authToken)
        .then(async data => {
          if (data.status != 200) {
            notification.error(await data.text());
          } else {
            setFormData(await data.json());
            setIsLoading(false);
          }
        })
        .catch(e => {
          // console.log(e);
          notification.error(e);
        });
    }
  }, [id, authToken]);

  const handleChange = (ev: LightChangeEvent<PropertyRegistrationModel>) => {
    setFormData(prevState => ({ ...prevState, [ev.name]: ev.value }));
  };

  const fetchDeedInfo = async (tokenId: number, authToken: string) => {
    const id = notification.loading("Loading details...");
    const chainId = getTargetNetwork().id;
    const res = await fetch(`http://localhost:3000/api/deed-info/${tokenId}?chainId=${chainId}`, {
      headers: [["authorization", authToken]],
    });
    notification.remove(id);
    return res;
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    writeAsync(formData);
  };
  const onAssetValidationClicked = (ev: React.MouseEvent) => {
    ev.preventDefault();
    if (id) {
      writeValidateAsync(+id, true);
    }
  };

  const validate = () => {
    if (!formData.ownerInformation.ids) {
      notification.error("Owner Information ids is required", { duration: 3000 });
      return false;
    }

    if (!formData.ownerInformation.articleIncorporation) {
      notification.error("Owner Information articleIncorporation is required", { duration: 3000 });
      return false;
    }

    if (!formData.propertyDetails.propertyDeedOrTitle) {
      notification.error("Property details Deed or Title is required", { duration: 3000 });
      return false;
    }

    for (const field of Object.values(formData.ownerInformation)) {
      if (field instanceof File && field.size / 1024 > 500) {
        notification.error(`${field.name} is too big. Max size is 500kb`, { duration: 3000 });
        return false;
      }
    }

    for (const field of Object.values(formData.propertyDetails)) {
      if (field instanceof File && field.size / 1024 > 500) {
        notification.error(`${field.name} is too big. Max size is 500kb`, { duration: 3000 });
        return false;
      }
    }

    for (const field of Object.values(formData.otherInformation)) {
      if (field instanceof File && field.size / 1024 > 500) {
        notification.error(`${field.name} is too big. Max size is 500kb`);
        return false;
      }
    }

    return true;
  };

  return (
    <div className="container pt-10">
      {isReady && (!id || !isLoading) && (
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
            ))}a
          </ul> */}
            <form onSubmit={handleSubmit}>
              <OwnerInformation value={formData.ownerInformation} onChange={handleChange} />
              <PropertyDetails value={formData.propertyDetails} onChange={handleChange} />
              <OtherInformations value={formData.otherInformation} onChange={handleChange} />
              <div className="m-8 w-full text-right">
                {id ? (
                  <button
                    onClick={e => onAssetValidationClicked(e)}
                    className="btn btn-lg bg-gray-600"
                  >
                    Validate
                  </button>
                ) : (
                  <input type="submit" className="btn btn-lg bg-gray-600" />
                )}
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
      )}
    </div>
  );
};

export default RegistrationForm;
