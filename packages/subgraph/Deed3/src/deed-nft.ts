import {
    BigInt,
    Bytes,
    store,
    dataSource,
    json,
    JSONValue,
    TypedMap,
} from "@graphprotocol/graph-ts";
import {
    DeedNFT,
    DeedNFTAssetTypeSet,
    DeedNFTAssetValidationSet,
    DeedNFTBurned,
    DeedNFTIpfsDetailsSet,
    DeedNFTMinted,
    Transfer,
} from "../generated/DeedNFT/DeedNFT";
import {
    DeedEntity,
    DeedMetadata,
    FileInfo,
    OtherInformation,
    OwnerInformation,
    PropertyDetails,
} from "../generated/schema";

export function handleDeedNFTMinted(event: DeedNFTMinted): void {
    let deedContract = DeedNFT.bind(event.address);
    let entityId = getDeedEntityId(event.address, event.params.deedId);
    let deed = new DeedEntity(entityId);
    deed.owner = deedContract.ownerOf(event.params.deedId);
    deed.minter = event.params.minter;
    deed.assetType = event.params.deedInfo.assetType;
    deed.isValidated = event.params.deedInfo.isValidated;
    deed.ipfsHash = deedContract.tokenURI(event.params.deedId);
    deed.save();
}

export function handleDeedNFTAssetValidationSet(
    event: DeedNFTAssetValidationSet
): void {
    let deed = DeedEntity.load(
        getDeedEntityId(event.address, event.params.deedId)
    )!;
    deed.isValidated = event.params.isValid;
    if (event.params.isValid) {
        let deedContract = DeedNFT.bind(event.address);
        deed.deedInfo = getIpfsUri(deedContract.tokenURI(event.params.deedId));
    } else {
        deed.deedInfo = null;
    }
    deed.save();
}

export function handleDeedNFTBurned(event: DeedNFTBurned): void {
    store.remove(
        "DeedEntity",
        getDeedEntityId(event.address, event.params.deedId)
    );
}

export function handleDeedNFTIpfsDetailsSet(
    event: DeedNFTIpfsDetailsSet
): void {
    let deed = DeedEntity.load(
        getDeedEntityId(event.address, event.params.deedId)
    )!;
    if (deed.isValidated) {
        deed.deedInfo = getIpfsUri(event.params.newIpfsDetailsHash);
        deed.save();
    }
}

export function handleTransfer(event: Transfer): void {
    let deed = DeedEntity.load(
        getDeedEntityId(event.address, event.params.tokenId)
    );

    if (deed == null) {
        return;
    }

    deed.owner = event.params.to;
    deed.save();
}

export function handleDeedNFTAssetTypeSet(event: DeedNFTAssetTypeSet): void {
    let deed = DeedEntity.load(
        getDeedEntityId(event.address, event.params.deedId)
    )!;
    deed.assetType = event.params.newAssetType;
    deed.save();
}

export function handleMetadata(content: Bytes): void {
    const cid = dataSource.stringParam();
    let deedMetadata = new DeedMetadata(cid);
    const value = json.fromBytes(content).toObject();
    if (value) {
        const ownerInformation = value.mustGet("ownerInformation").toObject();
        const propertyDetails = value.mustGet("propertyDetails").toObject();
        const otherInformation = value.mustGet("otherInformation").toObject();

        const ownerInformationEntity = new OwnerInformation(cid);
        const propertyDetailsEntity = new PropertyDetails(cid);
        const otherInformationEntity = new OtherInformation(cid);

        // #1 - Owner Information
        ownerInformationEntity.ownerName = ownerInformation
            .mustGet("ownerName")
            .toString();
        ownerInformationEntity.ownerType = ownerInformation
            .mustGet("ownerType")
            .toString();
        ownerInformationEntity.entityName = ownerInformation.isSet("entityName")
            ? ownerInformation.mustGet("entityName").toString()
            : null;
        ownerInformationEntity.ownerPosition = ownerInformation.isSet(
            "ownerPosition"
        )
            ? ownerInformation.mustGet("ownerPosition").toString()
            : null;
        ownerInformationEntity.ownerEntityType = ownerInformation.isSet(
            "ownerEntityType"
        )
            ? ownerInformation.mustGet("ownerEntityType").toString()
            : null;

        // Files
        ownerInformationEntity.articleIncorporation = parseFileEntity(
            ownerInformation.mustGet("articleIncorporation").toObject()
        );
        ownerInformationEntity.ids = parseFileEntity(
            ownerInformation.mustGet("ids").toObject()
        );

        ownerInformationEntity.operatingAgreement = ownerInformation.isSet(
            "operatingAgreement"
        )
            ? parseFileEntity(
                  ownerInformation.mustGet("operatingAgreement").toObject()
              )
            : null;
        ownerInformationEntity.proofBill = ownerInformation.isSet("proofBill")
            ? parseFileEntity(ownerInformation.mustGet("proofBill").toObject())
            : null;
        ownerInformationEntity.supportingDoc = [];
        let supportingDoc = ownerInformation.isSet("supportingDoc")
            ? ownerInformation.mustGet("supportingDoc").toArray()
            : [];
        for (let i = 0; i < supportingDoc.length; i++) {
            let res = parseFileEntity(supportingDoc[i].toObject());
            if (res) {
                ownerInformationEntity.supportingDoc!.push(res);
            }
        }

        ownerInformationEntity.save();

        // #2 - Property Details

        propertyDetailsEntity.propertyType = propertyDetails
            .mustGet("propertyType")
            .toString();
        propertyDetailsEntity.propertySubType = propertyDetails.isSet(
            "propertySubType"
        )
            ? propertyDetails.mustGet("propertySubType").toString()
            : null;
        propertyDetailsEntity.propertyAddress = propertyDetails
            .mustGet("propertyAddress")
            .toString();
        propertyDetailsEntity.propertyCity = propertyDetails
            .mustGet("propertyCity")
            .toString();
        propertyDetailsEntity.propertyState = propertyDetails
            .mustGet("propertyState")
            .toString();
        propertyDetailsEntity.propertyZoning = propertyDetails.isSet(
            "propertyZoning"
        )
            ? propertyDetails.mustGet("propertyZoning").toString()
            : null;
        propertyDetailsEntity.propertySize = propertyDetails.isSet(
            "propertySize"
        )
            ? propertyDetails.mustGet("propertySize").toString()
            : null;

        // Files
        propertyDetailsEntity.propertyDeedOrTitle = parseFileEntity(
            propertyDetails.mustGet("propertyDeedOrTitle").toObject()
        );
        propertyDetailsEntity.propertyImages = [];
        let propertyImages = ownerInformation.isSet("propertyImages")
            ? ownerInformation.mustGet("propertyImages").toArray()
            : [];
        for (let i = 0; i < propertyImages.length; i++) {
            let res = parseFileEntity(propertyImages[i].toObject());
            if (res) {
                propertyDetailsEntity.propertyImages!.push(res);
            }
        }
        propertyDetailsEntity.propertyPurchaseContract = propertyDetails.isSet(
            "propertyPurchaseContract"
        )
            ? parseFileEntity(
                  propertyDetails.mustGet("propertyPurchaseContract").toObject()
              )
            : null;

        propertyDetailsEntity.save();

        // #3 - Other Information
        otherInformationEntity.blockchain = otherInformation
            .mustGet("blockchain")
            .toString();
        otherInformationEntity.wrapper = otherInformation
            .mustGet("wrapper")
            .toString();

        otherInformationEntity.save();

        deedMetadata.ownerInformation = ownerInformationEntity.id;
        deedMetadata.propertyDetails = propertyDetailsEntity.id;
        deedMetadata.otherInformation = otherInformationEntity.id;

        deedMetadata.save();
    }
}

function parseFileEntity(file: TypedMap<string, JSONValue>): string {
    let fileInfo = new FileInfo(file.mustGet("hash").toString());
    fileInfo.name = file.mustGet("name").toString();
    fileInfo.type = file.mustGet("type").toString();
    fileInfo.size = file.mustGet("size").toBigInt();
    fileInfo.restricted = file.mustGet("restricted").toBool();
    fileInfo.lastModified = file.mustGet("lastModified").toBigInt();
    fileInfo.save();
    return fileInfo.id;
}

function getDeedEntityId(address: Bytes, deedId: BigInt): string {
    return address.toHexString() + "_" + deedId.toString();
}

function getIpfsUri(hash: string): string {
    return `https://silver-ready-lemur-896.mypinata.cloud/ipfs/QmXFsiDPdzKGwg8rqEPU18w95yKRKQxmkFiK43SRLDHbLi?pinataGatewayToken=CZV2x_TVl8TapFi2Zw7GGFUQ9OdNHAsv38DMB9oV94y7-BljoAWndolyFXt0dY8y`;
}
