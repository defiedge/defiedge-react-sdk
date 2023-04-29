import { WagmiConfig, createClient } from "wagmi";
import { mainnet, bsc, polygon, arbitrum, optimism } from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import React, { FC, ReactNode } from "react";

const client = createClient(
  getDefaultClient({
    appName: "@defiedge/react",
    chains: [mainnet, bsc, polygon, arbitrum, optimism],
  })
);

interface DefiedgeProviderProps {
  children: ReactNode;
}

const DefiedgeProvider: FC<DefiedgeProviderProps> = ({ children }) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiConfig>
  );
};

export default DefiedgeProvider;
