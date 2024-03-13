import { useEffect, useState } from "react";
import FileValidation from "./FileValidation";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { FileFieldKey, FileKeyValueLabel, FileValidationState } from "~~/models/file.model";
import { getSupportedFiles } from "~~/services/file.service";

interface Props {
  deedData: DeedInfoModel;
  onSave: (deed: DeedInfoModel) => void;
}

const ValidationProcedures = ({ deedData, onSave }: Props) => {
  const [supportedFiles, setSupportedFiles] = useState<Map<string, FileKeyValueLabel>>();
  useEffect(() => {
    const map = new Map<string, FileKeyValueLabel>();
    getSupportedFiles(deedData, undefined, false, true).forEach(x => {
      map.set(x.label, x);
    });
    setSupportedFiles(map);
  }, [deedData]);

  const handleStateChange = (key: FileFieldKey, state: FileValidationState) => {
    if (key[1]) {
      // @ts-ignore
      deedData[key[0]][key[1]].state = state;
    } else {
      // @ts-ignore
      deedData[key[0]].state = state;
    }
    onSave(deedData);
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
                  fill-rule="evenodd"
                  clip-rule="evenodd"
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
                  label="Identity Verification"
                  description="Complete KYC Procedures"
                  fileFields={[
                    supportedFiles.get("ID or Passport")!,
                    supportedFiles.get("Utility Bill or Other Document")!,
                    supportedFiles.get("Article of Incorporation")!,
                    supportedFiles.get("Operating Agreement")!,
                    supportedFiles.get("Any other Supporting Documents")!,
                  ]}
                  onStateChanged={state =>
                    handleStateChange(supportedFiles.get("ID or Passport")!.key, state)
                  }
                ></FileValidation>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border">
              <div className="py-8 px-4">
                <FileValidation
                  label="Entity Verification"
                  description="Complete KYB Procedures"
                  fileFields={[supportedFiles.get("Property Images")!]}
                  onStateChanged={state =>
                    handleStateChange(supportedFiles.get("Property Images")!.key, state)
                  }
                ></FileValidation>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border">
              <div className="py-8 px-4">
                <FileValidation
                  label="Ownership Verification"
                  description="Complete KYB Procedures"
                  fileFields={[
                    supportedFiles.get("Deed or Title")!,
                    supportedFiles.get("Purchase Contract")!,
                  ]}
                  onStateChanged={state =>
                    handleStateChange(supportedFiles.get("Deed or Title")!.key, state)
                  }
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
                  label="Legal Wrapper"
                  description="Complete KYB Procedures"
                  fileFields={[supportedFiles.get("Agreement")!]}
                  button={
                    <button className="btn btn-primary m-1 btn-outline btn-square rounded-lg w-fit px-2 uppercase">
                      View Agreements
                    </button>
                  }
                  onStateChanged={state =>
                    handleStateChange(supportedFiles.get("Agreement")!.key, state)
                  }
                ></FileValidation>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border">
              <div className="py-8 px-4">
                <FileValidation
                  label="Document Notorization"
                  description="Complete KYB Procedures"
                  fileFields={[supportedFiles.get("Process")!]}
                  button={
                    <button
                      className="btn btn-primary m-1 btn-outline btn-square rounded-lg w-fit px-2 uppercase"
                      onClick={() =>
                        handleStateChange(supportedFiles.get("Process")!.key, "Processing")
                      }
                    >
                      Begin Process
                    </button>
                  }
                  onStateChanged={state =>
                    handleStateChange(supportedFiles.get("Agreement")!.key, state)
                  }
                ></FileValidation>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border">
              <div className="py-8 px-4">
                <FileValidation
                  label="State & County Fillings"
                  description="Complete KYB Procedures"
                  fileFields={[supportedFiles.get("State & County Fillings")!]}
                  onStateChanged={state =>
                    handleStateChange(supportedFiles.get("State & County Fillings")!.key, state)
                  }
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
                  label="Digital confirmation"
                  description="Complete KYB Procedures"
                  fileFields={[supportedFiles.get("Deed or Title")!]}
                  button={
                    <button className="btn btn-primary m-1 btn-outline btn-square rounded-lg w-fit px-2 uppercase">
                      Click to sign
                    </button>
                  }
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
