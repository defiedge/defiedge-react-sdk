import { WagmiConfig, createClient } from "wagmi";
import {
  arbitrum,
  base,
  bsc,
  mainnet,
  moonbeam,
  optimism,
  mantle,
  polygon,
} from "chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import React, { FC, ReactNode } from "react";

const client = createClient(
  getDefaultClient({
    appName: "@defiedge/react",
    chains: [arbitrum, base, bsc, mainnet, moonbeam, optimism, mantle, polygon],
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
