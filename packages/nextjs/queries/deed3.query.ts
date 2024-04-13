const Deed3Query = `
  query FetchDeedEntities(
    $PROPERTY_ADDRESS: String
    $PROPERTY_CITY: String
    $PROPERTY_STATE: String
    $PROPERTY_TYPE: String
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
              ]
            }
          }
          { isValidated: true }
        ]
      }
    ) {
      id
      deedId
      owner
      assetType
      deedMetadata {
        ownerInformation_type
        ownerInformation_name
        ownerInformation_position
        ownerInformation_entityName
        ownerInformation_entityType
        ownerInformation_ids {
          id
        }
        ownerInformation_operatingAgreement {
          id
        }
        ownerInformation_proofBill {
          id
        }
        ownerInformation_supportingDoc {
          id
        }
        propertyDetails_type
        propertyDetails_address
        propertyDetails_city
        propertyDetails_size
        propertyDetails_state
        propertyDetails_zoning
        propertyDetails_images {
          id
        }
        propertyDetails_subType
        propertyDetails_deedOrTitle {
          id
        }
        propertyDetails_purchaseContract {
          id
        }
        otherInformation_wrapper
        otherInformation_blockchain
      }
    }
  }
`;

export default Deed3Query;
