import { FC } from "react";
import { BigNumber } from "ethers";
import { Token } from "@defiedge/sdk/dist/src/types/strategyQueryData";
interface SingleInputProps {
    token: Token | undefined;
    amount: string;
    setAmount: (amount: string) => void;
    balance: string | undefined;
    rawBalance: BigNumber | undefined;
}
declare const SingleInput: FC<SingleInputProps>;
export default SingleInput;
