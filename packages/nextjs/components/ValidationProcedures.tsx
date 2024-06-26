import { useEffect, useState } from "react";
import FileValidation from "./FileValidation";
import { useSignMessage } from "wagmi";
import useValidationClient from "~~/clients/validations.client";
import useIsOwner from "~~/hooks/useIsOwner.hook";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { FileFieldKeyLabel, FileValidationModel } from "~~/models/file.model";
import { getSupportedFiles } from "~~/services/file.service";
import { notification } from "~~/utils/scaffold-eth";

interface Props {
  deedData: DeedInfoModel;
  onSave: (deed: DeedInfoModel) => Promise<void>;
  onRefresh: () => void;
}

const ValidationProcedures = ({ deedData, onSave, onRefresh }: Props) => {
  const [supportedFiles, setSupportedFiles] = useState<Map<string, FileFieldKeyLabel>>();
  const { data: signMessageData, signMessageAsync } = useSignMessage();
  const validationClient = useValidationClient();
  const isOwner = useIsOwner(deedData);

  useEffect(() => {
    const map = new Map<string, FileFieldKeyLabel>();
    getSupportedFiles(deedData, undefined, false, !!deedData.mintedId, true).forEach(x => {
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

  const handleValidationChange = async (validation: FileValidationModel) => {
    const notificationId = notification.loading("Publishing validation...");
    const res = await validationClient.saveValidation(validation);
    notification.remove(notificationId);
    if (res) {
      notification.success("Successfully updated");
    } else {
      notification.error("Error while publishing validation");
    }
  };

  const handleSign = async () => {
    await signMessageAsync({
      message:
        "Please sign this message to confirm that you agree to tokenize your asset and that the document you provided are valid.",
    });
  };

  return (
    <table className="table-auto border w-full">
      <thead>
        <tr>
          <td colSpan={2} className="border border-white border-opacity-10">
            <div className="text-[12px] font-normal text-white uppercase tracking-widest flex flex-row items-center gap-2 bg-base-300 py-8 px-6">
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
            <td className="border border-white border-opacity-10">
              <div className="text-center py-5 px-5">01</div>
            </td>
            <td className="border border-white border-opacity-10">
              <div className="text-[11px] font-normal text-zinc-400 py-5 px-4 uppercase tracking-widest">
                Property validation
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-white border-opacity-10" rowSpan={3} />
            <td className="border border-white border-opacity-10">
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
                  onStateChanged={handleValidationChange}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-white border-opacity-10">
              <div className="py-8 px-4">
                <FileValidation
                  id="EntityVerification"
                  label="Entity Verification"
                  description="Complete KYB Procedures"
                  fileLabels={["Property Images"]}
                  onStateChanged={handleValidationChange}
                  supportedFiles={supportedFiles}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-white border-opacity-10">
              <div className="py-8 px-4">
                <FileValidation
                  id="OwnershipVerification"
                  label="Ownership Verification"
                  description="Complete KYB Procedures"
                  fileLabels={["Deed or Title", "Purchase Contract"]}
                  onStateChanged={handleValidationChange}
                  supportedFiles={supportedFiles}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-white border-opacity-10">
              <div className="text-center py-5 px-5">02</div>
            </td>
            <td className="border border-white border-opacity-10">
              <div className="text-[11px] font-normal text-zinc-400 py-5 px-4 uppercase tracking-widest">
                PREP, FILING & NOTARIZATION
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-white border-opacity-10" rowSpan={3} />
            <td className="border border-white border-opacity-10">
              <div className="py-8 px-4">
                <FileValidation
                  id="Agreement"
                  label="Agreement"
                  description="Complete KYB Procedures"
                  fileLabels={["Agreement"]}
                  button={
                    <button className="btn btn-sm btn-primary ml-1 border-white border-opacity-10 btn-square rounded-lg w-fit px-2 text-[9px] font-normal uppercase tracking-widest">
                      View Agreements
                    </button>
                  }
                  supportedFiles={supportedFiles}
                  onStateChanged={handleValidationChange}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-white border-opacity-10">
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
                        className="btn btn-sm btn-primary m-1 border-white border-opacity-10 btn-square rounded-lg w-fit px-2 text-[9px] font-normal uppercase tracking-widest"
                        onClick={() =>
                          handleValidationChange({
                            registrationId: deedData.id!,
                            key: "DocumentNotorization",
                            state: "Processing",
                          })
                        }
                      >
                        Begin Process
                      </button>
                    )
                  }
                  supportedFiles={supportedFiles}
                  onStateChanged={handleValidationChange}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-white border-opacity-10">
              <div className="py-8 px-4">
                <FileValidation
                  id="StateCountyFillings"
                  label="State & County Fillings"
                  description="Complete KYB Procedures"
                  fileLabels={["State & County Fillings"]}
                  onStateChanged={handleValidationChange}
                  supportedFiles={supportedFiles}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-white border-opacity-10">
              <div className="text-center py-5 px-5">03</div>
            </td>
            <td className="border border-white border-opacity-10">
              <div className="text-[11px] font-normal text-zinc-400 py-5 px-4 uppercase tracking-widest">
                Confirmation & Minting
              </div>
            </td>
          </tr>

          <tr>
            <td className="border border-white border-opacity-10" rowSpan={1} />
            <td className="border border-white border-opacity-10">
              <div className="py-8 px-4">
                <FileValidation
                  id="DigitalConfirmation"
                  label="Digital confirmation"
                  description="Complete KYB Procedures"
                  fileLabels={["Deed or Title"]}
                  button={
                    <button
                      className={`btn btn-sm btn-primary m-1 border-white border-opacity-10 btn-square rounded-lg w-fit px-2 text-[9px] font-normal uppercase tracking-widest ${
                        deedData.signatureTx ? "btn-success pointer-events-none" : ""
                      }`}
                      onClick={handleSign}
                      disabled={!isOwner}
                      title="Only the owner can sign this deed."
                    >
                      {deedData.signatureTx ? "Signed" : "Click to sign"}
                    </button>
                  }
                  onStateChanged={handleValidationChange}
                  supportedFiles={supportedFiles}
                  deedData={deedData}
                  onSave={onSave}
                  onRefresh={onRefresh}
                />
              </div>
            </td>
          </tr>
        </tbody>
      )}
    </table>
  );
};

export default ValidationProcedures;
