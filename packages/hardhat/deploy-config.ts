export const deployConfig = {
  goerli: {
    manager: "0x5D5C160A4Bb3444752ba35EEE16c4523E2398CAB",
  },
  sepolia: {
    isBaseNetwork: false,
    manager: "0xD30aee396a54560581a3265Fd2194B0edB787525",
    router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
    usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
  mumbai: {
    isBaseNetwork: true,
    manager: "0xD30aee396a54560581a3265Fd2194B0edB787525",
    router: "0x1035CabC275068e0F4b745A29CEDf38E13aF41b1",
  },
  base: {
    isBaseNetwork: false,
    manager: "0xD30aee396a54560581a3265Fd2194B0edB787525",
    router: "0x1035CabC275068e0F4b745A29CEDf38E13aF41b1",
  },
  BinanceSmartChain: {
    isBaseNetwork: false,
    manager: "0xD30aee396a54560581a3265Fd2194B0edB787525",
    router: "0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f",
  },
} as const;
