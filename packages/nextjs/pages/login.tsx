import { useEffect } from "react";
import { useRouter } from "next/router";
import useWallet from "~~/hooks/useWallet";

export default function Login() {
  const { primaryWallet, isConnecting, connectWallet } = useWallet();
  const router = useRouter();
  useEffect(() => {
    if (isConnecting) return;
    if (primaryWallet?.authenticated) {
      router.push("/");
    }
  }, [primaryWallet?.authenticated, isConnecting]);
  if (!isConnecting && !primaryWallet?.authenticated) connectWallet();
  return <></>;
}
