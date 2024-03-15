import { useEffect, useState } from "react";
import FileValidation from "./FileValidation";
import { useSignMessage } from "wagmi";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { FileFieldKeyLabel, FileValidationState } from "~~/models/file.model";
import { getSupportedFiles } from "~~/services/file.service";

interface Props {
  deedData: DeedInfoModel;
  isDraft: boolean;
  onSave: (deed: DeedInfoModel) => Promise<void>;
  onRefresh: () => void;
}

const ValidationProcedures = ({ deedData, onSave, isDraft, onRefresh }: Props) => {
  const [supportedFiles, setSupportedFiles] = useState<Map<string, FileFieldKeyLabel>>();
  const { data: signMessageData, signMessageAsync } = useSignMessage();

  useEffect(() => {
    const map = new Map<string, FileFieldKeyLabel>();
    getSupportedFiles(deedData, undefined, false, isDraft, true).forEach(x => {
      map.set(x.label, x);
    });
    setSupportedFiles(map);
  }, [deedData]);

  useEffect(() => {
    if (signMessageData) {
      deedData.signatureTx = signMessageData;
      onSave(deedData);
    }
  }, [signMessageData]);

  const handleStateChange = (id: string, state: FileValidationState) => {
    if (!deedData.validations) deedData.validations = [];
    const validationEntry = deedData.validations.find(x => x[0] === id);

    if (!validationEntry) {
      deedData.validations.push([id, state]);
    } else {
      validationEntry[1] = state;
    }
    onSave(deedData).then(onRefresh);
  };

  const handleSign = async () => {
    await signMessageAsync({
      message: "Please sign this message to confirm that you agree to tokenize your asset.",
    });
  };

  return (
    <table className="table-auto border">
      <thead>
        <tr>
          <td colSpan={2} className="border">
            <div className="uppercase flex flex-row items-center gap-2 bg-base-300 p-8">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 14.6667C0.000733333 15.4027 0.59726 15.9993 1.33333 16H14.6667C15.4027 15.9993 15.9993 15.4027 16 14.6667V1.33333C15.9993 0.59726 15.4027 0.000733333 14.6667 0H1.33333C0.59726 0.000733333 0.000733333 0.59726 0 1.33333V14.6667ZM1.33333 14.6667V1.33333H14.6667L14.6673 14.6667H1.33333ZM8.66667 12V6H6V7.33333H7.33333V12H5.33333V13.3333H10.6667V12H8.66667ZM7 3.88889C7 3.33661 7.44773 2.88889 8 2.88889C8.55227 2.88889 9 3.33661 9 3.88889C9 4.4412 8.55227 4.88887 8 4.88887C7.44773 4.88887 7 4.4412 7 3.88889Z"
                  fill="#C7C7CC"
                />
              </svg>
              <div>Validation Procedures</div>
            </div>
          </td>
        </tr>
      </thead>
      {supportedFiles && (
        <tbody>
          <tr>
            <td className="border">
              <div className="text-center py-8 px-2">01</div>
            </td>
            <td className="border">
              <div className="text-secondary py-8 px-4 uppercase">Property validation</div>
            </td>
          </tr>
          <tr>
            <td className="border" rowSpan={3}></td>
            <td className="border">
              <div className="py-8 px-4">
                <FileValidation
                  id="IdentityVerification"
                  label="Identity Verification"
                  description="Complete KYC Procedures"
                  fileLabels={[
                    "ID or Passport",
                    "Utility Bill or Other Document",
                    "Article of Incorporation",
                    "Operating Agreement",
                    "Any other Supporting Documents",
                  ]}
                  supportedFiles={supportedFiles}
                  onStateChanged={handleStateChange}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                ></FileValidation>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border">
              <div className="py-8 px-4">
                <FileValidation
                  id={"EntityVerification"}
                  label="Entity Verification"
                  description="Complete KYB Procedures"
                  fileLabels={["Property Images"]}
                  onStateChanged={handleStateChange}
                  supportedFiles={supportedFiles}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                ></FileValidation>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border">
              <div className="py-8 px-4">
                <FileValidation
                  id="OwnershipVerification"
                  label="Ownership Verification"
                  description="Complete KYB Procedures"
                  fileLabels={["Deed or Title", "Purchase Contract"]}
                  onStateChanged={handleStateChange}
                  supportedFiles={supportedFiles}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                ></FileValidation>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border">
              <div className="text-center py-8 px-2">02</div>
            </td>
            <td className="border">
              <div className="text-secondary py-8 px-4 uppercase">PREP, FILING & NOTARIZATION</div>
            </td>
          </tr>
          <tr>
            <td className="border" rowSpan={3}></td>
            <td className="border">
              <div className="py-8 px-4">
                <FileValidation
                  id="Agreement"
                  label="Agreement"
                  description="Complete KYB Procedures"
                  fileLabels={["Agreement"]}
                  button={
                    <button className="btn btn-primary m-1 btn-outline btn-square rounded-lg w-fit px-2 uppercase">
                      View Agreements
                    </button>
                  }
                  supportedFiles={supportedFiles}
                  onStateChanged={handleStateChange}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                ></FileValidation>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border">
              <div className="py-8 px-4">
                <FileValidation
                  id="DocumentNotorization"
                  label="Document Notorization"
                  description="Complete KYB Procedures"
                  fileLabels={["Document Notorization"]}
                  button={
                    // @ts-ignore
                    deedData.validations?.find(x => x[0] === "DocumentNotorization")?.[1] !==
                    "Not Started" ? undefined : (
                      <button
                        className="btn btn-primary m-1 btn-outline btn-square rounded-lg w-fit px-2 uppercase"
                        onClick={() => handleStateChange("DocumentNotorization", "Processing")}
                      >
                        Begin Process
                      </button>
                    )
                  }
                  supportedFiles={supportedFiles}
                  onStateChanged={handleStateChange}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                ></FileValidation>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border">
              <div className="py-8 px-4">
                <FileValidation
                  id="StateCountyFillings"
                  label="State & County Fillings"
                  description="Complete KYB Procedures"
                  fileLabels={["State & County Fillings"]}
                  onStateChanged={handleStateChange}
                  supportedFiles={supportedFiles}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                ></FileValidation>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border">
              <div className="text-center py-8 px-2">03</div>
            </td>
            <td className="border">
              <div className="text-secondary py-8 px-4 uppercase">Confirmation & Minting</div>
            </td>
          </tr>

          <tr>
            <td className="border" rowSpan={1}></td>
            <td className="border">
              <div className="py-8 px-4">
                <FileValidation
                  id="DigitalConfirmation"
                  label="Digital confirmation"
                  description="Complete KYB Procedures"
                  fileLabels={["Deed or Title"]}
                  button={
                    <button
                      className="btn btn-primary m-1 btn-outline btn-square rounded-lg w-fit px-2 uppercase"
                      onClick={handleSign}
                    >
                      Click to sign
                    </button>
                  }
                  onStateChanged={handleStateChange}
                  supportedFiles={supportedFiles}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                ></FileValidation>
              </div>
            </td>
          </tr>
        </tbody>
      )}
    </table>
  );
};

export default ValidationProcedures;
