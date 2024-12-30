import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import abi from "../abi.json";

export default function Wallet({ provider, open, isConnected, address }) {
  const [text, setText] = useState("0 $WBoBi");

  useEffect(() => {
    async function execute() {
      if (provider && isConnected && address) {
        const signer = await provider.getSigner();

        const contract = new Contract(
          "0xA05edB1Def7cbf8f61B7C1aaE2786439796EB198",
          abi,
          signer
        );

        const balance = await contract.balanceOf(address);

        const formattedEther = ethers.utils.formatEther(balance);
        const float = parseFloat(formattedEther);
        const formattedBalance = Math.round(float * 100000) / 100000;

        setText(`${formattedBalance} $WBoBi`);
      }
    }

    execute();
  }, [provider, isConnected, address]);

  return (
    <button
      onClick={() => {
        if (!isConnected) {
          open();
        }
      }}
      className="connect-wallet-btn connect-wallet-state-btn"
    >
      {isConnected ? text : "MetaMask"}
    </button>
  );
}
