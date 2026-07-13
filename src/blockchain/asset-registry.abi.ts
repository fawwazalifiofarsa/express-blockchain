export const assetRegistryAbi = [
  {
    type: "function",
    name: "registerAsset",
    stateMutability: "nonpayable",
    inputs: [
      { name: "assetId", type: "string", internalType: "string" },
      { name: "metadataHash", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
  },
  {
    type: "event",
    name: "AssetRegistered",
    anonymous: false,
    inputs: [
      {
        name: "assetId",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "metadataHash",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "registeredAt",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
  },
] as const;
