import { WagmiConfig, createClient } from "wagmi";
import {
  arbitrum,
  avalanche,
  bsc,
  mainnet,
  // mantle,
  moonbeam,
  optimism,
  polygon,
  polygonZkEvm,
  zkSync,
} from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import React, { FC, ReactNode } from "react";

const client = createClient(
  getDefaultClient({
    appName: "@defiedge/react",
    chains: [
      arbitrum,
      avalanche,
      // base,
      bsc,
      mainnet,
      // mantle,
      moonbeam,
      optimism,
      polygon,
      // xlayer,
      // linea,
      polygonZkEvm,
      zkSync,
    ],
  })
);

interface DefiedgeProviderProps {
  children: ReactNode;
}

const DefiedgeProvider: React.FC<DefiedgeProviderProps> = ({ children }) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiConfig>
  );
};

export default DefiedgeProvider;
