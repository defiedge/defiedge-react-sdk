import { FC } from "react";
import { SupportedChainId } from "@defiedge/sdk/dist/src/types";
interface LiquidityCardProps {
    strategyAddress: string;
    network: SupportedChainId;
    color?: string;
}
declare const LiquidityCard: FC<LiquidityCardProps>;
export default LiquidityCard;
