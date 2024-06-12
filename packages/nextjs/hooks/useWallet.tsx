import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const useWallet = () => {
  // OFLINE
  // const { address, isConnected, isConnecting } = useAccount();
  // const localContext = {
  //   primaryWallet: {
  //     address,
  //     connected: isConnected,
  //   },
  //   isConnecting,
  //   authToken: address,
  // };

  // ONLINE
  let dynamicContext;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    dynamicContext = useDynamicContext();
  } catch (error) {}
  return {
    ...dynamicContext,
    isConnecting: dynamicContext?.loadingNetwork,
    // @ts-ignore
    connectWallet: () =>
      document
        .querySelector("#dynamic-widget")
        ?.shadowRoot?.querySelector<HTMLButtonElement>('[data-testid="ConnectButton"]')
        ?.click(),
  };
  // process.env.NEXT_PUBLIC_OFFLINE
  //   ? localContext
  //   :
};

export default useWallet;
