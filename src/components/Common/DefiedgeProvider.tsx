import { WagmiConfig, createClient } from "wagmi";
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  mainnet,
  mantle,
  moonbeam,
  optimism,
  polygon,
  polygonZkEvm,
  zkSync,
} from "chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import React, { FC, ReactNode } from "react";

const client = createClient(
  getDefaultClient({
    appName: "@defiedge/react",
    chains: [
      arbitrum,
      avalanche,
      base,
      bsc,
      mainnet,
      mantle,
      moonbeam,
      optimism,
      polygon,
      polygonZkEvm,
      zkSync,
    ],
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
