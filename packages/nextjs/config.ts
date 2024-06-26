import * as chains from "viem/chains";

const CONFIG = {
  // The network where your DApp lives in
  targetNetwork:
    chains[process.env.NEXT_PUBLIC_TARGET_NETWORK as keyof typeof chains] || chains.arbitrum,

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect on the local network
  pollingInterval: 30000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,

  /**
   * Auto connect:
   * 1. If the user was connected into a wallet before, on page reload reconnect automatically
   * 2. If user is not connected to any wallet:  On reload, connect to burner wallet if burnerWallet.enabled is true && burnerWallet.onlyLocal is false
   */
  walletAutoConnect: true,
  dynamicEnvironementId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
  paymentLink: process.env.NEXT_PUBLIC_PAYMENT_LINK!,
  ipfsGateway: process.env.NEXT_PUBLIC_OFFLINE
    ? "http://localhost:5001/"
    : process.env.NEXT_PINATA_GATEWAY,
  appName: "Deed3.io",
} as const;

export default CONFIG;
