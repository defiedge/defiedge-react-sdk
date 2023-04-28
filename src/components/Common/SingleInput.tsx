import React, { FC, useCallback } from "react";
import { BigNumber, ethers } from "ethers";
import { Token } from "@defiedge/sdk/dist/src/types/strategyQueryData";

interface SingleInputProps {
  token: Token | undefined;
  amount: string;
  setAmount: (amount: string) => void;
  balance: string | undefined;
  rawBalance: BigNumber | undefined;
}

const SingleInput: FC<SingleInputProps> = ({
  amount,
  setAmount,
  token,
  balance,
  rawBalance,
}) => {
  const handleTokenMax = useCallback(() => {
    if (rawBalance && token) {
      setAmount(ethers.utils.formatUnits(rawBalance, token.decimals));
    }
  }, [rawBalance, setAmount, token]);

  const handleAmountChange = useCallback(
    (e: any) => {
      const value = e.target.value;

      if (!isNaN(value) && Number(value) >= 0) {
        setAmount(value);
      }
    },
    [setAmount]
  );

  return (
    <>
      <div className="border border-zinc-200/50 rounded-2xl w-full p-2 flex flex-col items-end bg-zinc-50">
        <div className="flex">
          <input
            value={amount}
            type="number"
            className="pt-4 pb-2 pl-2 pr-6 text-zinc-800 font-mono text-4xl focus:outline-none flex-1 w-full bg-transparent"
            placeholder="0.00"
            onChange={(e) => handleAmountChange(e)}
          />
          <div className="pt-4 flex flex-col items-end space-y-2">
            <div className="py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-medium w-[64px] flex items-center justify-center">
              {token?.symbol}
            </div>
          </div>
        </div>
        {balance && (
          <span
            className="text-zinc-500 text-sm px-2 hover:underline hover:cursor-pointer"
            onClick={handleTokenMax}
          >
            Balance: {balance ?? "0"}
          </span>
        )}
      </div>
    </>
  );
};

export default SingleInput;
