import {
  isStrategySingleSidedDeposit,
  isToken1DefaultTokenForStrategy,
} from "@defiedge/sdk";
import { SupportedChainId } from "@defiedge/sdk/dist/src/types";
import { useEffect, useState } from "react";

export function useSSW(
  chainId: SupportedChainId,
  strategyAddress: string,
  jsonProvider: any
) {
  const [isSSWDeposit, setIsSSWDeposit] = useState<boolean>(false);
  const [isToken1DefaultToken, setIsToken1DefaultToken] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    isStrategySingleSidedDeposit(chainId, strategyAddress)
      .then((ssw) => {
        if (ssw && jsonProvider) {
          return isToken1DefaultTokenForStrategy(
            strategyAddress,
            jsonProvider
          ).then((isToken1DefaultToken) => {
            setIsSSWDeposit(ssw);
            setIsToken1DefaultToken(isToken1DefaultToken);
          });
        } else setIsSSWDeposit(ssw);
      })
      .catch(() => setIsSSWDeposit(false))
      .finally(() => setIsLoading(false));
  }, [chainId, strategyAddress, jsonProvider]);

  return { isSSWDeposit, isToken1DefaultToken, isLoading };
}
