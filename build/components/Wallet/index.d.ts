import { FC } from "react";
import { SupportedChainId } from "@defiedge/sdk/dist/src/types";
interface WalletProps {
    network: SupportedChainId;
}
declare const Wallet: FC<WalletProps>;
export default Wallet;
