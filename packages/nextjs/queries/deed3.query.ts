import { execute } from "../.graphclient";
import { ExplorerPageSize } from "~~/constants";
import { PropertiesFilterModel } from "~~/models/properties-filter.model";

const Deed3Query = (
  filterVerified: boolean,
  filterPropertySize: boolean,
  filterOwnerWallet: boolean,
) => ` 
  query FetchDeedEntities(
    $PROPERTY_ADDRESS: String
    $PROPERTY_CITY: String
    $PROPERTY_STATE: String
    $PROPERTY_TYPE: String
    $VALIDATED: Boolean
    $CURRENT_PAGE: Int
    $PAGE_SIZE: Int
    $PROPERTY_SIZE: String
    $OWNER_WALLET: Bytes
  ) {
    deedEntities(
      where: {
        and: [
          {
            deedMetadata_: {
              and: [
                {
                  or: [
                    { propertyDetails_address_contains_nocase: $PROPERTY_ADDRESS }
                    { propertyDetails_city_contains_nocase: $PROPERTY_CITY }
                    { propertyDetails_state_contains_nocase: $PROPERTY_STATE }
                  ]
                }
                { propertyDetails_type: $PROPERTY_TYPE }
                ${filterPropertySize ? "{ propertyDetails_size_contains: $PROPERTY_SIZE }" : ""}
              ]
            }
          }
          ${filterVerified ? "{ isValidated: $VALIDATED }" : ""}
          ${filterOwnerWallet ? "{ owner: $OWNER_WALLET }" : ""}
        ]
      }
      first: $PAGE_SIZE
      skip: $CURRENT_PAGE
    ) {
      id
      deedId
      owner
      assetType
      isValidated
      deedMetadata {
        ownerInformation_type
        ownerInformation_name
        ownerInformation_position
        ownerInformation_entityName
        ownerInformation_entityType
        propertyDetails_type
        propertyDetails_address
        propertyDetails_city
        propertyDetails_size
        propertyDetails_state
        propertyDetails_zoning
        propertyDetails_images {
          fileId
        }
        propertyDetails_subType
        otherInformation_wrapper
      }
    }
  }
`;

export function fetchDeeds(
  filter?: PropertiesFilterModel,
  currentPage?: number,
  pageSize?: number,
) {
  return execute(
    Deed3Query(filter?.validated !== "all", !!filter?.propertySize, !!filter?.ownerWallet),
    {
      PROPERTY_ADDRESS: filter?.search ?? "",
      PROPERTY_CITY: filter?.search ?? "",
      PROPERTY_STATE: filter?.search ?? "",
      PROPERTY_TYPE: filter?.propertyType ?? "realEstate",
      PROPERTY_SIZE: filter?.propertySize ?? "",
      OWNER_WALLET: filter?.ownerWallet ?? "",
      VALIDATED: (filter?.validated ?? "true") === "true",
      CURRENT_PAGE: currentPage ?? 0,
      PAGE_SIZE: pageSize ?? ExplorerPageSize,
    },
  ).then(res => res.data.deedEntities);
}
