const contracts = {
  5: [
    {
      chainId: "5",
      name: "goerli",
      contracts: {
        DeedNFT: {
          address: "0x4E0325c42449b7457A7124264Ab8a2Bc13964B5C",
          abi: [
            {
              inputs: [],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "approved",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "Approval",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bool",
                  name: "approved",
                  type: "bool",
                },
              ],
              name: "ApprovalForAll",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "deedId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "enum DeedNFT.AssetType",
                  name: "newAssetType",
                  type: "uint8",
                },
              ],
              name: "DeedNFTAssetTypeSet",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "deedId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "bool",
                  name: "isValid",
                  type: "bool",
                },
              ],
              name: "DeedNFTAssetValidationSet",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "deedId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "bytes",
                  name: "newIpfsDetailsHash",
                  type: "bytes",
                },
              ],
              name: "DeedNFTIpfsDetailsSet",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "deedId",
                  type: "uint256",
                },
                {
                  components: [
                    {
                      internalType: "bytes",
                      name: "ipfsDetailsHash",
                      type: "bytes",
                    },
                    {
                      internalType: "enum DeedNFT.AssetType",
                      name: "assetType",
                      type: "uint8",
                    },
                    {
                      internalType: "uint256",
                      name: "price",
                      type: "uint256",
                    },
                    {
                      internalType: "string",
                      name: "deedAddress",
                      type: "string",
                    },
                    {
                      internalType: "bool",
                      name: "isValidated",
                      type: "bool",
                    },
                  ],
                  indexed: false,
                  internalType: "struct DeedNFT.DeedInfo",
                  name: "deedInfo",
                  type: "tuple",
                },
              ],
              name: "DeedNFTMinted",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "deedId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "newPrice",
                  type: "uint256",
                },
              ],
              name: "DeedNFTPriceUpdated",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "previousAdminRole",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "newAdminRole",
                  type: "bytes32",
                },
              ],
              name: "RoleAdminChanged",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "sender",
                  type: "address",
                },
              ],
              name: "RoleGranted",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "sender",
                  type: "address",
                },
              ],
              name: "RoleRevoked",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "Transfer",
              type: "event",
            },
            {
              inputs: [],
              name: "DEFAULT_ADMIN_ROLE",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "VALIDATOR_ROLE",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "minter",
                  type: "address",
                },
              ],
              name: "addValidator",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "approve",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "balanceOf",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "canSubdivide",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "getApproved",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_deedId",
                  type: "uint256",
                },
              ],
              name: "getDeedInfo",
              outputs: [
                {
                  components: [
                    {
                      internalType: "bytes",
                      name: "ipfsDetailsHash",
                      type: "bytes",
                    },
                    {
                      internalType: "enum DeedNFT.AssetType",
                      name: "assetType",
                      type: "uint8",
                    },
                    {
                      internalType: "uint256",
                      name: "price",
                      type: "uint256",
                    },
                    {
                      internalType: "string",
                      name: "deedAddress",
                      type: "string",
                    },
                    {
                      internalType: "bool",
                      name: "isValidated",
                      type: "bool",
                    },
                  ],
                  internalType: "struct DeedNFT.DeedInfo",
                  name: "",
                  type: "tuple",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
              ],
              name: "getRoleAdmin",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "grantRole",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "hasRole",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
              ],
              name: "isApprovedForAll",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_owner",
                  type: "address",
                },
                {
                  internalType: "bytes",
                  name: "_ipfsDetailsHash",
                  type: "bytes",
                },
                {
                  internalType: "enum DeedNFT.AssetType",
                  name: "_assetType",
                  type: "uint8",
                },
                {
                  internalType: "string",
                  name: "_deedAddress",
                  type: "string",
                },
              ],
              name: "mintAsset",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "name",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "ownerOf",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "minter",
                  type: "address",
                },
              ],
              name: "removeValidator",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "renounceRole",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "revokeRole",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "safeTransferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
                {
                  internalType: "bytes",
                  name: "data",
                  type: "bytes",
                },
              ],
              name: "safeTransferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "approved",
                  type: "bool",
                },
              ],
              name: "setApprovalForAll",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_deedId",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "_isValid",
                  type: "bool",
                },
              ],
              name: "setAssetValidation",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_deedId",
                  type: "uint256",
                },
                {
                  internalType: "bytes",
                  name: "_ipfsDetailsHash",
                  type: "bytes",
                },
              ],
              name: "setIpfsDetailsHash",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_deedId",
                  type: "uint256",
                },
                {
                  internalType: "uint32",
                  name: "_newPrice",
                  type: "uint32",
                },
              ],
              name: "setPrice",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes4",
                  name: "interfaceId",
                  type: "bytes4",
                },
              ],
              name: "supportsInterface",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "symbol",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "tokenURI",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "transferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        FundsManager: {
          address: "0xC71F7B1cb487dC5518655C3874DC206E9F0D35E7",
          abi: [
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "contract IERC20",
                  name: "token",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "sender",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "caller",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "newBalance",
                  type: "uint256",
                },
              ],
              name: "FundsStored",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "contract IERC20",
                  name: "token",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "destination",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "caller",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "newBalance",
                  type: "uint256",
                },
              ],
              name: "FundsWithdrawn",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "accountsMapping",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_id",
                  type: "uint256",
                },
                {
                  internalType: "contract IERC20",
                  name: "_token",
                  type: "address",
                },
              ],
              name: "balanceOf",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_id",
                  type: "uint256",
                },
                {
                  internalType: "contract IERC20",
                  name: "_token",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "_amount",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "_sender",
                  type: "address",
                },
              ],
              name: "store",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_id",
                  type: "uint256",
                },
                {
                  internalType: "contract IERC20",
                  name: "_token",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "_amount",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "_recipient",
                  type: "address",
                },
              ],
              name: "widthdraw",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        LeaseAgreement: {
          address: "0xcCaC3b5B0284Ba2ECa48Eb1943D0625C5Dac0b79",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_leaseNFT",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_paymentToken",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_deedNFT",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_subdivisionNFT",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_fundsManager",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              name: "LeaseAgentRemoved",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "agent",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "percentage",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              name: "LeaseAgentSet",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
                {
                  components: [
                    {
                      internalType: "address",
                      name: "lessor",
                      type: "address",
                    },
                    {
                      internalType: "address",
                      name: "lessee",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "rentAmount",
                      type: "uint256",
                    },
                    {
                      components: [
                        {
                          internalType: "uint256",
                          name: "amount",
                          type: "uint256",
                        },
                        {
                          internalType: "bool",
                          name: "paid",
                          type: "bool",
                        },
                      ],
                      internalType: "struct LeaseAgreement.Deposit",
                      name: "securityDeposit",
                      type: "tuple",
                    },
                    {
                      internalType: "uint256",
                      name: "latePaymentFee",
                      type: "uint256",
                    },
                    {
                      internalType: "uint32",
                      name: "gracePeriod",
                      type: "uint32",
                    },
                    {
                      components: [
                        {
                          internalType: "uint256",
                          name: "startDate",
                          type: "uint256",
                        },
                        {
                          internalType: "uint256",
                          name: "endDate",
                          type: "uint256",
                        },
                        {
                          internalType: "uint256",
                          name: "rentDueDate",
                          type: "uint256",
                        },
                        {
                          internalType: "uint256",
                          name: "distributableDate",
                          type: "uint256",
                        },
                      ],
                      internalType: "struct LeaseAgreement.LeaseDates",
                      name: "dates",
                      type: "tuple",
                    },
                    {
                      internalType: "uint256",
                      name: "extensionCount",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "propertyTokenId",
                      type: "uint256",
                    },
                    {
                      internalType: "address",
                      name: "agent",
                      type: "address",
                    },
                    {
                      internalType: "uint8",
                      name: "agentPercentage",
                      type: "uint8",
                    },
                    {
                      internalType: "uint256",
                      name: "unclaimedRentAmount",
                      type: "uint256",
                    },
                  ],
                  indexed: false,
                  internalType: "struct LeaseAgreement.Lease",
                  name: "lease",
                  type: "tuple",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              name: "LeaseCreated",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              name: "LeaseDepositSubmited",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "newDueDate",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              name: "LeaseDueDateChanged",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "endDate",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "rentAmount",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "extensionCount",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              name: "LeaseExtended",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "fundsManager",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              name: "LeaseFundsManagerSet",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "unclaimedRentAmount",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              name: "LeasePaymentMade",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "paymentToken",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              name: "LeasePaymentTokenSet",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "lessorAmount",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "agentAmount",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "distributableDate",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              name: "LeaseRentDistributed",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              name: "LeaseTerminated",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "_agent",
                  type: "address",
                },
                {
                  internalType: "uint8",
                  name: "_percentage",
                  type: "uint8",
                },
              ],
              name: "addAgent",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
              ],
              name: "calculateRentPaymentInfo",
              outputs: [
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "rentAmount",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "totalBalance",
                      type: "uint256",
                    },
                    {
                      internalType: "uint32",
                      name: "unpaidMonths",
                      type: "uint32",
                    },
                    {
                      internalType: "uint256",
                      name: "rentDueDate",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct LeaseAgreement.RentPaymentInfo",
                  name: "rentInfo",
                  type: "tuple",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_lessee",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "_startDate",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "_endDate",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "_rentAmount",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "_securityDepositAmount",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "_propertyTokenId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "_latePaymentFee",
                  type: "uint256",
                },
                {
                  internalType: "uint32",
                  name: "_gracePeriod",
                  type: "uint32",
                },
              ],
              name: "createLease",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "deedNFT",
              outputs: [
                {
                  internalType: "contract DeedNFT",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
              ],
              name: "distributeRent",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "extensionPeriod",
                  type: "uint256",
                },
              ],
              name: "extendLease",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "fundsManager",
              outputs: [
                {
                  internalType: "contract FundsManager",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "leaseCounter",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "leaseNFT",
              outputs: [
                {
                  internalType: "contract ILeaseNFT",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              name: "leases",
              outputs: [
                {
                  internalType: "address",
                  name: "lessor",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "lessee",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "rentAmount",
                  type: "uint256",
                },
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                    {
                      internalType: "bool",
                      name: "paid",
                      type: "bool",
                    },
                  ],
                  internalType: "struct LeaseAgreement.Deposit",
                  name: "securityDeposit",
                  type: "tuple",
                },
                {
                  internalType: "uint256",
                  name: "latePaymentFee",
                  type: "uint256",
                },
                {
                  internalType: "uint32",
                  name: "gracePeriod",
                  type: "uint32",
                },
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "startDate",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "endDate",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "rentDueDate",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "distributableDate",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct LeaseAgreement.LeaseDates",
                  name: "dates",
                  type: "tuple",
                },
                {
                  internalType: "uint256",
                  name: "extensionCount",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "propertyTokenId",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "agent",
                  type: "address",
                },
                {
                  internalType: "uint8",
                  name: "agentPercentage",
                  type: "uint8",
                },
                {
                  internalType: "uint256",
                  name: "unclaimedRentAmount",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_leaseId",
                  type: "uint256",
                },
              ],
              name: "payRent",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "paymentToken",
              outputs: [
                {
                  internalType: "contract IERC20",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
              ],
              name: "removeAgent",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_leaseId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "_newDueDate",
                  type: "uint256",
                },
              ],
              name: "setDueDate",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_fundsManager",
                  type: "address",
                },
              ],
              name: "setFundsManager",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_paymentToken",
                  type: "address",
                },
              ],
              name: "setPaymentToken",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "subdivisionNFT",
              outputs: [
                {
                  internalType: "contract SubdivisionNFT",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
              ],
              name: "submitDeposit",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "leaseId",
                  type: "uint256",
                },
              ],
              name: "terminateLease",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        LeaseNFT: {
          address: "0x11A03C3E32e119E05fe9663a7aB445BF3e3Cb679",
          abi: [
            {
              inputs: [],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "approved",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "Approval",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bool",
                  name: "approved",
                  type: "bool",
                },
              ],
              name: "ApprovalForAll",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "Transfer",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "approve",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "balanceOf",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "burn",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "getApproved",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
              ],
              name: "isApprovedForAll",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "mintToken",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "name",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "ownerOf",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "safeTransferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
                {
                  internalType: "bytes",
                  name: "data",
                  type: "bytes",
                },
              ],
              name: "safeTransferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "approved",
                  type: "bool",
                },
              ],
              name: "setApprovalForAll",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_leaseAgreementAddress",
                  type: "address",
                },
              ],
              name: "setLeaseAgreementAddress",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes4",
                  name: "interfaceId",
                  type: "bytes4",
                },
              ],
              name: "supportsInterface",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "symbol",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "tokenURI",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "transferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        SubdivisionNFT: {
          address: "0x434B8Ee84eaF2327d0e327125BAaE416Ed0c2fF3",
          abi: [
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_uri",
                  type: "string",
                },
                {
                  internalType: "address",
                  name: "_deedNFT",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bool",
                  name: "approved",
                  type: "bool",
                },
              ],
              name: "ApprovalForAll",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "bytes",
                  name: "ipfsDetailsHash",
                  type: "bytes",
                },
              ],
              name: "IpfsDetailsSet",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "previousAdminRole",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "newAdminRole",
                  type: "bytes32",
                },
              ],
              name: "RoleAdminChanged",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "sender",
                  type: "address",
                },
              ],
              name: "RoleGranted",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "sender",
                  type: "address",
                },
              ],
              name: "RoleRevoked",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "subdivisionId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "deedId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "bytes",
                  name: "ipfsDetailsHash",
                  type: "bytes",
                },
              ],
              name: "SubdivisionBurned",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
                {
                  components: [
                    {
                      internalType: "bytes",
                      name: "ipfsDetailsHash",
                      type: "bytes",
                    },
                    {
                      internalType: "address",
                      name: "owner",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "parentDeed",
                      type: "uint256",
                    },
                  ],
                  indexed: false,
                  internalType: "struct SubdivisionNFT.SubdivisionInfo",
                  name: "info",
                  type: "tuple",
                },
              ],
              name: "SubdivisionInfoSet",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "subdivisionId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "deedId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "bytes",
                  name: "ipfsDetailsHash",
                  type: "bytes",
                },
              ],
              name: "SubdivisionMinted",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256[]",
                  name: "ids",
                  type: "uint256[]",
                },
                {
                  indexed: false,
                  internalType: "uint256[]",
                  name: "values",
                  type: "uint256[]",
                },
              ],
              name: "TransferBatch",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "value",
                  type: "uint256",
                },
              ],
              name: "TransferSingle",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "string",
                  name: "value",
                  type: "string",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
              ],
              name: "URI",
              type: "event",
            },
            {
              inputs: [],
              name: "DEFAULT_ADMIN_ROLE",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "MINTER_ROLE",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
              ],
              name: "balanceOf",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address[]",
                  name: "accounts",
                  type: "address[]",
                },
                {
                  internalType: "uint256[]",
                  name: "ids",
                  type: "uint256[]",
                },
              ],
              name: "balanceOfBatch",
              outputs: [
                {
                  internalType: "uint256[]",
                  name: "",
                  type: "uint256[]",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  components: [
                    {
                      internalType: "bytes",
                      name: "ipfsDetailsHash",
                      type: "bytes",
                    },
                    {
                      internalType: "address",
                      name: "owner",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "parentDeed",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct SubdivisionNFT.SubdivisionInfo[]",
                  name: "_infos",
                  type: "tuple[]",
                },
              ],
              name: "batchMint",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "_subTokenId",
                  type: "uint256",
                },
              ],
              name: "burnSubdivision",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "deedNFT",
              outputs: [
                {
                  internalType: "contract DeedNFT",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_subTokenId",
                  type: "uint256",
                },
              ],
              name: "getParentDeed",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
              ],
              name: "getRoleAdmin",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "grantRole",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "hasRole",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
              ],
              name: "isApprovedForAll",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_owner",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "_subTokenId",
                  type: "uint256",
                },
              ],
              name: "isOwnerOfSubdivision",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  components: [
                    {
                      internalType: "bytes",
                      name: "ipfsDetailsHash",
                      type: "bytes",
                    },
                    {
                      internalType: "address",
                      name: "owner",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "parentDeed",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct SubdivisionNFT.SubdivisionInfo",
                  name: "_info",
                  type: "tuple",
                },
              ],
              name: "mintSubdivision",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "renounceRole",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "revokeRole",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256[]",
                  name: "ids",
                  type: "uint256[]",
                },
                {
                  internalType: "uint256[]",
                  name: "amounts",
                  type: "uint256[]",
                },
                {
                  internalType: "bytes",
                  name: "data",
                  type: "bytes",
                },
              ],
              name: "safeBatchTransferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
                {
                  internalType: "bytes",
                  name: "data",
                  type: "bytes",
                },
              ],
              name: "safeTransferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "approved",
                  type: "bool",
                },
              ],
              name: "setApprovalForAll",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_subTokenId",
                  type: "uint256",
                },
                {
                  internalType: "bytes",
                  name: "_ipfsDetailsHash",
                  type: "bytes",
                },
              ],
              name: "setIpfsDetailsHash",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes4",
                  name: "interfaceId",
                  type: "bytes4",
                },
              ],
              name: "supportsInterface",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              name: "uri",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
  17000: [
    {
      chainId: "17000",
      name: "holesky",
      contracts: {
        DeedNFT: {
          address: "0xCe4Ec1d7EcfA897424888F68f9742F7988225B09",
          abi: [
            {
              inputs: [],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "approved",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "Approval",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bool",
                  name: "approved",
                  type: "bool",
                },
              ],
              name: "ApprovalForAll",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  components: [
                    {
                      internalType: "string",
                      name: "ipfsDetailsHash",
                      type: "string",
                    },
                    {
                      internalType: "enum DeedNFT.AssetType",
                      name: "assetType",
                      type: "uint8",
                    },
                    {
                      internalType: "uint256",
                      name: "price",
                      type: "uint256",
                    },
                    {
                      internalType: "string",
                      name: "deedAddress",
                      type: "string",
                    },
                  ],
                  indexed: false,
                  internalType: "struct DeedNFT.DeedInfo",
                  name: "_deedInfo",
                  type: "tuple",
                },
              ],
              name: "DeedMinted",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "previousAdminRole",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "newAdminRole",
                  type: "bytes32",
                },
              ],
              name: "RoleAdminChanged",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "sender",
                  type: "address",
                },
              ],
              name: "RoleGranted",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "sender",
                  type: "address",
                },
              ],
              name: "RoleRevoked",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "Transfer",
              type: "event",
            },
            {
              inputs: [],
              name: "DEFAULT_ADMIN_ROLE",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "VALIDATOR_ROLE",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "minter",
                  type: "address",
                },
              ],
              name: "addValidator",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "approve",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "balanceOf",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "canSubdivide",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "getApproved",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_tokenId",
                  type: "uint256",
                },
              ],
              name: "getDeedInfo",
              outputs: [
                {
                  components: [
                    {
                      internalType: "string",
                      name: "ipfsDetailsHash",
                      type: "string",
                    },
                    {
                      internalType: "enum DeedNFT.AssetType",
                      name: "assetType",
                      type: "uint8",
                    },
                    {
                      internalType: "uint256",
                      name: "price",
                      type: "uint256",
                    },
                    {
                      internalType: "string",
                      name: "deedAddress",
                      type: "string",
                    },
                  ],
                  internalType: "struct DeedNFT.DeedInfo",
                  name: "",
                  type: "tuple",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
              ],
              name: "getRoleAdmin",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "grantRole",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "hasRole",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
              ],
              name: "isApprovedForAll",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_to",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_ipfsDetailsHash",
                  type: "string",
                },
                {
                  internalType: "enum DeedNFT.AssetType",
                  name: "_assetType",
                  type: "uint8",
                },
                {
                  internalType: "string",
                  name: "_deedAddress",
                  type: "string",
                },
              ],
              name: "mintAsset",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "name",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "ownerOf",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "minter",
                  type: "address",
                },
              ],
              name: "removeValidator",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "renounceRole",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "role",
                  type: "bytes32",
                },
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "revokeRole",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "safeTransferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
                {
                  internalType: "bytes",
                  name: "data",
                  type: "bytes",
                },
              ],
              name: "safeTransferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "approved",
                  type: "bool",
                },
              ],
              name: "setApprovalForAll",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_deedId",
                  type: "uint256",
                },
                {
                  internalType: "uint32",
                  name: "_newPrice",
                  type: "uint32",
                },
              ],
              name: "setPrice",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes4",
                  name: "interfaceId",
                  type: "bytes4",
                },
              ],
              name: "supportsInterface",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "symbol",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "tokenURI",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "transferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
