import { useScaffoldContract } from "../../scaffold-eth";

const useDeedContract = () => {
  const { data } = useScaffoldContract({
    contractName: "DeedNFT",
  });

  return data;
};
export default useDeedContract;
