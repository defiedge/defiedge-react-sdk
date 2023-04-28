import React, { FC, useEffect } from "react";
import { ConnectKitButton, useIsMounted } from "connectkit";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { SupportedChainId } from "@defiedge/sdk/dist/src/types";

interface WalletProps {
  network: SupportedChainId;
}

const Wallet: FC<WalletProps> = ({ network }) => {
  const isMounted = useIsMounted();

  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  if (!isMounted) return null;

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        if (isConnected && chain?.id !== network) {
          return (
            <button
              className="w-full py-4 bg-zinc-800 text-zinc-100 rounded-lg"
              onClick={() => switchNetwork?.(network)}
            >
              Switch Network
            </button>
          );
        }

        return (
          <button
            className="w-full py-4 bg-zinc-800 text-zinc-100 rounded-lg"
            onClick={show}
          >
            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default Wallet;
