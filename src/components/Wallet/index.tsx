import React from "react";
import { ConnectKitButton } from "connectkit";
import useIsMounted from "../../hooks/useIsMounted";

const Wallet = () => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
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
