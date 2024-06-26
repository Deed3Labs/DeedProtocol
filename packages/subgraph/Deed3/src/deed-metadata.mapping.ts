import {
    Bytes,
    JSONValue,
    dataSource,
    json,
    log,
    JSONValueKind,
} from "@graphprotocol/graph-ts";
import { DeedMetadata, FileInfo } from "../generated/schema";

export function handleMetadata(content: Bytes): void {
    const cid = dataSource.stringParam();
    log.debug("Received deed with CID {}", [cid.toString()]);
    let deedMetadata = new DeedMetadata(cid);
    const value = json.fromBytes(content).toObject();

    const ownerInformation = value.mustGet("ownerInformation").toObject();
    const propertyDetails = value.mustGet("propertyDetails").toObject();
    const otherInformation = value.mustGet("otherInformation").toObject();

    // #1 - Owner Information
    log.debug("Handling Owner Information", [cid.toString()]);
    deedMetadata.ownerInformation_name = ownerInformation
        .mustGet("ownerName")
        .toString();
    deedMetadata.ownerInformation_type = ownerInformation
        .mustGet("ownerType")
        .toString();
    deedMetadata.ownerInformation_entityName = ownerInformation.isSet(
        "entityName"
    )
        ? ownerInformation.mustGet("entityName").toString()
        : null;
    deedMetadata.ownerInformation_position = ownerInformation.isSet(
        "ownerPosition"
    )
        ? ownerInformation.mustGet("ownerPosition").toString()
        : null;
    deedMetadata.ownerInformation_entityType = ownerInformation.isSet(
        "ownerEntityType"
    )
        ? ownerInformation.mustGet("ownerEntityType").toString()
        : null;

    // Files
    deedMetadata.ownerInformation_articleIncorporation = ownerInformation.isSet(
        "articleIncorporation"
    )
        ? parseFileEntity(ownerInformation.mustGet("articleIncorporation"), cid)
        : null;
    deedMetadata.ownerInformation_ids = ownerInformation.isSet("ids")
        ? parseFileEntity(ownerInformation.mustGet("ids"), cid)
        : null;
    deedMetadata.ownerInformation_operatingAgreement = ownerInformation.isSet(
        "operatingAgreement"
    )
        ? parseFileEntity(ownerInformation.mustGet("operatingAgreement"), cid)
        : null;
    deedMetadata.ownerInformation_proofBill = ownerInformation.isSet(
        "proofBill"
    )
        ? parseFileEntity(ownerInformation.mustGet("proofBill"), cid)
        : null;

    const supportingDocEntity: string[] = [];
    let supportingDoc = ownerInformation.isSet("supportingDoc")
        ? ownerInformation.mustGet("supportingDoc").toArray()
        : [];
    for (let i = 0; i < supportingDoc.length; i++) {
        let res = parseFileEntity(supportingDoc[i], cid);
        supportingDocEntity.push(res);
    }
    deedMetadata.ownerInformation_supportingDoc = supportingDocEntity;

    // #2 - Property Details
    log.debug("Handling Property Details", [cid.toString()]);
    deedMetadata.propertyDetails_type = propertyDetails
        .mustGet("propertyType")
        .toString();
    deedMetadata.propertyDetails_subType = propertyDetails.isSet(
        "propertySubType"
    )
        ? propertyDetails.mustGet("propertySubType").toString()
        : null;
    deedMetadata.propertyDetails_address = propertyDetails
        .mustGet("propertyAddress")
        .toString();
    deedMetadata.propertyDetails_latitude = propertyDetails
        .mustGet("propertyLatitude")
        .toString();
    deedMetadata.propertyDetails_longitude = propertyDetails
        .mustGet("propertyLongitude")
        .toString();
    deedMetadata.propertyDetails_city = propertyDetails
        .mustGet("propertyCity")
        .toString();
    deedMetadata.propertyDetails_state = propertyDetails
        .mustGet("propertyState")
        .toString();
    deedMetadata.propertyDetails_zoning = propertyDetails.isSet(
        "propertyZoning"
    )
        ? propertyDetails.mustGet("propertyZoning").toString()
        : null;
    deedMetadata.propertyDetails_size = propertyDetails.isSet("propertySize")
        ? propertyDetails.mustGet("propertySize").toString()
        : null;

    // Files
    deedMetadata.propertyDetails_deedOrTitle = propertyDetails.isSet(
        "propertyDeedOrTitle"
    )
        ? parseFileEntity(propertyDetails.mustGet("propertyDeedOrTitle"), cid)
        : null;
    deedMetadata.propertyDetails_purchaseContract = propertyDetails.isSet(
        "propertyPurchaseContract"
    )
        ? parseFileEntity(
              propertyDetails.mustGet("propertyPurchaseContract"),
              cid
          )
        : null;

    let propertyImages = propertyDetails.get("propertyImages");
    if (propertyImages) {
        const propertyImagesArr = propertyImages.toArray();
        const parsedPropertyImages: string[] = [];
        for (let i = 0; i < propertyImagesArr.length; i++) {
            let res = parseFileEntity(propertyImagesArr[i], cid);
            parsedPropertyImages.push(res.toString());
        }
        deedMetadata.propertyDetails_images = parsedPropertyImages;
    } else {
        deedMetadata.propertyDetails_images = [];
    }

    // #3 - Other Information
    log.debug("Handling Other Information", [cid.toString()]);
    deedMetadata.otherInformation_wrapper = otherInformation
        .mustGet("wrapper")
        .toString();

    deedMetadata.save();
}

function parseFileEntity(file: JSONValue, hash: string): string {
    let fileInfo: FileInfo | null;
    if (file.kind == JSONValueKind.STRING) {
        fileInfo = FileInfo.load(hash + "-" + file.toString());
        if (fileInfo == null) {
            fileInfo = new FileInfo(hash + "-" + file.toString());
        }
        fileInfo.fileId = file.toString();
        fileInfo.restricted = false;
    } else {
        let fileObject = file.toObject();
        fileInfo = FileInfo.load(
            hash + "-" + fileObject.mustGet("fileId").toString()
        );
        if (!fileInfo) {
            fileInfo = new FileInfo(
                hash + "-" + fileObject.mustGet("fileId").toString()
            );
        }
        fileInfo.fileId = fileObject.mustGet("fileId").toString();
        fileInfo.name = fileObject.mustGet("fileName").toString();
        fileInfo.type = fileObject.mustGet("mimetype").toString();
        fileInfo.size = fileObject.mustGet("size").toBigInt();
        fileInfo.timestamp = fileObject.isSet("timestamp")
            ? fileObject.mustGet("timestamp").toString()
            : null;
        fileInfo.restricted = fileObject.mustGet("restricted").toBool();
    }
    fileInfo.save();
    return fileInfo.id;
}
