import "../../css/index.css";

import {
  Address,
  useAccount,
  useBalance,
  useNetwork,
  useSigner,
  useToken,
} from "wagmi";
import { BigNumber, ethers } from "ethers";
import React,{
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  Strategy,
  Token,
} from "@defiedge/sdk/dist/src/types/strategyQueryData";
import {
  approveStrategyToken,
  depositLP,
  getLiquidity,
  getLiquidityRatio,
  getRanges,
  getSSDStrategies,
  getStrategyInfo,
  getStrategyMetaData,
  getUserDeshareBalance,
  isStrategyTokenApproved,
  removeLP,
} from "@defiedge/sdk";
import { formatEther, isAddress } from "ethers/lib/utils.js";

import type { Strategy as MetadataStrategy } from "@defiedge/sdk/dist/src/types/strategyMetaQuery";
import SingleInput from "../Common/SingleInput";
import { SupportedChainId } from "@defiedge/sdk/dist/src/types";
import { Tab } from "@headlessui/react";
import Wallet from "../Wallet";
import clsx from "clsx";
import { useIsMounted } from "connectkit";
import { useSSW } from "../../hooks";

interface LiquidityCardProps {
  allowedTokenForSingleSide?: string;
  color?: string;
  network: SupportedChainId;
  strategyAddress: string;
}

type DepositType = "BOTH" | "SINGLE";

enum SingleSideTokenType {
  ZERO,
  ONE,
}

const LiquidityCard: React.FC<LiquidityCardProps> = ({
  allowedTokenForSingleSide,
  color = "#2463EB",
  network,
  strategyAddress,
}) => {
  strategyAddress = strategyAddress?.toLowerCase();

  const isMounted = useIsMounted();

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const provider = signer?.provider as ethers.providers.JsonRpcProvider;

  const [strategy, setStrategy] =
    useState<(Strategy & MetadataStrategy) | null>(null);

  const [isToken0Approved, setIsToken0Approved] = useState<boolean>(false);
  const [isToken1Approved, setIsToken1Approved] = useState<boolean>(false);
  const [liquidityRatio, setLiquidityRatio] = useState<number>(0);
  const [userShare, setUserShare] = useState<BigNumber | undefined>();
  const [userShareFraction, setUserShareFraction] = useState<number>(0);
  const [strategyAmount0, setStrategyAmount0] = useState<number>(0);
  const [strategyAmount1, setStrategyAmount1] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [currentRange, setCurrentRange] =
    useState<
      | {
        lowerTickInA: number;
        upperTickInA: number;
        lowerTickInB: number;
        upperTickInB: number;
      }
      | undefined
    >();

  const { isSSWDeposit, isToken1DefaultToken, isLoading: isSSWLoading } = useSSW(
    network,
    strategyAddress,
    provider
  );

  const [allowedToken0, allowedToken1] = useMemo(() => {
    if (!allowedTokenForSingleSide || !strategy) return [true, true];

    const allowedToken0 =
      allowedTokenForSingleSide.toLowerCase() ===
      (isAddress(allowedTokenForSingleSide)
        ? strategy.token0.id.toLowerCase()
        : strategy.token0.symbol.toLowerCase());

    const allowedToken1 =
      allowedTokenForSingleSide.toLowerCase() ===
      (isAddress(allowedTokenForSingleSide)
        ? strategy.token1.id.toLowerCase()
        : strategy.token1.symbol.toLowerCase());
    return [allowedToken0, allowedToken1];
  }, [allowedTokenForSingleSide, strategy]);

  const [amount0, setAmount0] = useState<string>("");
  const [amount1, setAmount1] = useState<string>("");
  const [removePercentage, setRemovePercentage] = useState<string>("25");

  const [depositType, setDepositType] = useState<DepositType>("BOTH");
  const [singleSideToken, setSingleSideToken] = useState<Token | undefined>(
    allowedToken0 ? strategy?.token0 : strategy?.token1
  );
  const [depositError, setDepositError] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [rangeToken, setRangeToken] = useState<Token | undefined>(
    strategy?.token0
  );

  const singleSideTokenType = useMemo(
    () =>
      isSSWDeposit
        ? isToken1DefaultToken
          ? SingleSideTokenType.ONE
          : SingleSideTokenType.ZERO
        : singleSideToken?.symbol === strategy?.token0.symbol
          ? SingleSideTokenType.ZERO
          : SingleSideTokenType.ONE,
    [singleSideToken?.symbol, strategy?.token0.symbol]
  );

  useEffect(() => {
    if (isSSWDeposit) setDepositType("SINGLE");
  }, [isSSWDeposit]);

  // loading states
  const [depositLoading, setDepositLoading] = useState<boolean>(false);
  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);
  const [approve0Loading, setApprove0Loading] = useState<boolean>(false);
  const [approve1Loading, setApprove1Loading] = useState<boolean>(false);
  const [token0Max, setToken0Max] = useState<boolean>(false);
  const [token1Max, setToken1Max] = useState<boolean>(false);

  useEffect(() => {
    if (!strategyAddress) return;

    Promise.all([
      getStrategyInfo(network, strategyAddress),
      getStrategyMetaData(network, strategyAddress),
    ])
      .then(([info, metadata]) => {
        setStrategy({ ...info, ...metadata });

        const allowedToken0 =
          !allowedTokenForSingleSide ||
          allowedTokenForSingleSide.toLowerCase() ===
          (isAddress(allowedTokenForSingleSide)
            ? info.token0.id.toLowerCase()
            : info.token0.symbol.toLowerCase());
        setSingleSideToken(allowedToken0 ? info.token0 : info.token1);
        setRangeToken(info.token0);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setLoading(false));
  }, [network, allowedTokenForSingleSide, strategyAddress]);

  useEffect(() => {
    if (!provider) return;

    Promise.all([
      getLiquidityRatio(strategyAddress, provider),
      getRanges(strategyAddress, provider),
    ])
      .then(([liquidityRatio, ranges]) => {
        setLiquidityRatio(liquidityRatio);
        setCurrentRange(ranges[0] as any);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [provider, strategyAddress]);

  const fetchAllowances = useCallback(() => {
    if (!address || !provider) return;

    Promise.all([
      isStrategyTokenApproved(
        address,
        0,
        (isSSWDeposit ? isToken1DefaultToken ? amount1 : (amount0) : amount0) ?? 0,
        strategyAddress,
        provider
      ),
      isSSWDeposit ? Promise.resolve(true) : isStrategyTokenApproved(
        address,
        1,
        amount1 ?? 0,
        strategyAddress,
        provider
      ),
    ])
      .then(([token0, token1]) => {
        if (isSSWDeposit) {
          if (isToken1DefaultToken) {
            setIsToken0Approved(true);
            setIsToken1Approved(token0);
          } else {
            setIsToken0Approved(token0);
            setIsToken1Approved(true);
          }
        } else {
          setIsToken0Approved(token0);
          setIsToken1Approved(token1);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, [address, amount0, amount1, provider, strategyAddress]);

  const { data: token0Balance, refetch: refetchBalance0 } = useBalance({
    address,
    token: strategy?.token0.id as Address,
  });

  const { data: token1Balance, refetch: refetchBalance1 } = useBalance({
    address,
    token: strategy?.token1.id as Address,
  });

  const { data: strategyToken } = useToken({
    address: strategyAddress as Address,
  });

  useEffect(() => {
    if (depositType === "BOTH") {
      if (!amount0 || !amount1) {
        setDepositError("Enter Amount");
      } else if (
        amount0 &&
        token0Balance &&
        Number(amount0) > Number(token0Balance?.formatted)
      ) {
        setDepositError(`Insufficient ${strategy?.token0.symbol} balance`);
      } else if (
        amount1 &&
        token1Balance &&
        Number(amount1) > Number(token1Balance?.formatted)
      ) {
        setDepositError(`Insufficient ${strategy?.token1.symbol} balance`);
      } else {
        setDepositError(null);
      }
    } else if (depositType === "SINGLE") {
      if (singleSideTokenType === SingleSideTokenType.ZERO) {
        if (!amount0) {
          setDepositError("Enter Amount");
        } else if (
          amount0 &&
          token0Balance &&
          Number(amount0) > Number(token0Balance?.formatted)
        ) {
          setDepositError(`Insufficient ${strategy?.token0.symbol} balance`);
        } else {
          setDepositError(null);
        }
      } else if (singleSideTokenType === SingleSideTokenType.ONE) {
        if (!amount1) {
          setDepositError("Enter Amount");
        } else if (
          amount1 &&
          token1Balance &&
          Number(amount1) > Number(token1Balance?.formatted)
        ) {
          setDepositError(`Insufficient ${strategy?.token1.symbol} balance`);
        } else {
          setDepositError(null);
        }
      }
    }
  }, [
    amount0,
    amount1,
    depositType,
    singleSideTokenType,
    strategy?.token0.symbol,
    strategy?.token1.symbol,
    token0Balance,
    token1Balance,
  ]);

  useEffect(() => {
    if (!userShare) return;

    if (!+(userShare.toString() ?? 0)) {
      setWithdrawError(`No Shares to Remove`);
    } else {
      setWithdrawError(null);
    }
  }, [userShare]);

  const fetchUserShares = useCallback(() => {
    if (!address || !provider) return;

    getUserDeshareBalance(address, strategyAddress, provider, true)
      .then((data) => {
        setUserShare(data);

        if (strategyToken?.totalSupply) {
          const fraction =
            Number(formatEther(data)) /
            Number(strategyToken.totalSupply.formatted);

          setUserShareFraction(fraction);
        }
      })
      .catch(console.warn);
  }, [address, provider, strategyAddress, strategyToken?.totalSupply]);

  const fetchLiquidity = useCallback(() => {
    if (!provider) return;

    getLiquidity(strategyAddress, provider)
      .then((data) => {
        setStrategyAmount0(data.amount0Total);
        setStrategyAmount1(data.amount1Total);
      })
      .catch(console.warn);
  }, [provider, strategyAddress]);

  useEffect(() => {
    fetchAllowances();
    fetchUserShares();
    fetchLiquidity();
  }, [fetchAllowances, fetchUserShares, fetchLiquidity]);

  const handleToken0Max = useCallback(() => {
    if (token0Balance && strategy?.token0) {
      const bal = ethers.utils.formatUnits(
        token0Balance?.value,
        strategy?.token0.decimals
      );
      setAmount0(bal);
      setToken0Max(true);

      if (liquidityRatio && depositType === "BOTH") {
        setAmount1((Number(bal) * liquidityRatio).toString());
      }
    }
  }, [depositType, liquidityRatio, strategy?.token0, token0Balance]);

  const handleToken1Max = useCallback(() => {
    if (token1Balance && strategy?.token1) {
      const bal = ethers.utils.formatUnits(
        token1Balance?.value,
        strategy?.token1.decimals
      );

      setAmount1(bal);
      setToken1Max(true);

      if (liquidityRatio && depositType === "BOTH") {
        setAmount0((Number(bal) / liquidityRatio).toString());
      }
    }
  }, [depositType, liquidityRatio, strategy?.token1, token1Balance]);

  const handleAmount0Change = useCallback(
    (e: any) => {
      const inputValue = e.target.value;

      setAmount0(inputValue);
      if (liquidityRatio && depositType === "BOTH") {
        setAmount1((Number(inputValue) * liquidityRatio).toString());
      }
    },
    [depositType, liquidityRatio]
  );

  const handleAmount1Change = useCallback(
    (e: any) => {
      const inputValue = e.target.value;

      setAmount1(inputValue);
      if (liquidityRatio && depositType === "BOTH") {
        setAmount0((Number(inputValue) / liquidityRatio).toString());
      }
    },
    [depositType, liquidityRatio]
  );

  const approveToken0 = useCallback(() => {
    if (!address || !provider) return;

    setApprove0Loading(true);

    approveStrategyToken(address, 0, strategyAddress, provider, amount0)
      .then((data) => {
        if (!data) return;

        data.wait(1).then(() => {
          // TODO: show toast
          fetchAllowances();
          setApprove0Loading(false);
          console.log("transaction success");
        });
      })
      .catch((e) => {
        setApprove0Loading(false);
        console.error(e);
      });
  }, [address, fetchAllowances, provider, strategyAddress]);

  const approveToken1 = useCallback(() => {
    if (!address || !provider) return;

    setApprove1Loading(true);

    approveStrategyToken(address, 1, strategyAddress, provider, amount1)
      .then((data) => {
        if (!data) return;

        data.wait(1).then(() => {
          fetchAllowances();
          setApprove1Loading(false);
          // TODO: show toast
          console.log("transaction success");
        });
      })
      .catch((e) => {
        setApprove1Loading(false);
        console.error(e);
      });
  }, [address, fetchAllowances, provider, strategyAddress]);

  const deposit = useCallback(() => {
    if (!address || !provider) return;

    setDepositLoading(true);

    depositLP(
      address,
      (token0Max ? token0Balance?.value ?? amount0 : amount0) ?? "0",
      (token1Max ? token1Balance?.value ?? amount1 : amount1) ?? "0",
      strategyAddress,
      provider
    )
      .then((data) => {
        if (!data) return;

        data.wait(1).then(() => {
          refetchBalance0();
          refetchBalance1();
          // TODO: show toast
          setDepositLoading(false);
          console.log("transaction success");
        });
      })
      .catch((e) => {
        setDepositLoading(false);
        console.error(e);
      });
  }, [
    address,
    amount0,
    token0Max,
    token1Max,
    token0Balance?.value,
    token1Balance?.value,
    amount1,
    provider,
    refetchBalance0,
    refetchBalance1,
    strategyAddress,
  ]);

  const remove = useCallback(() => {
    if (!address || !provider || !userShare) return;

    setWithdrawLoading(true);

    const sharesToRemove = userShare.mul(
      BigNumber.from(removePercentage).div(BigNumber.from(100))
    );

    removeLP(address, sharesToRemove, strategyAddress, provider)
      .then((data) => {
        if (!data) return;

        data.wait(1).then(() => {
          fetchUserShares();
          // TODO: show toast
          setWithdrawLoading(false);
          console.log("transaction success");
        });
      })
      .catch((e) => {
        setWithdrawLoading(false);
        console.error(e);
      });
  }, [
    address,
    fetchUserShares,
    provider,
    removePercentage,
    strategyAddress,
    userShare,
  ]);

  console.log({
    isToken0Approved,
    isToken1Approved,
    isToken1DefaultToken,
  });

  if (!isMounted) return null;

  if (loading || isSSWLoading)
    return <span className="text-xs opacity-80">Loading Widget...</span>;

  if (!strategy) {
    return <span className="text-xs opacity-80">Failed to load widget!</span>;
  }

  return (
    <>
      <div className="p-4 font-sans bg-zinc-100 rounded-lg flex flex-col w-full max-w-lg">
        <div className="p-4 bg-white rounded-lg">
          <div className="flex flex-col space-y-4 text-sm">
            <div className="flex flex-col">
              <span className="text-zinc-800 font-bold tracking-wide text-lg">
                {strategy.title}
              </span>
              <span className="text-zinc-400 text-xs pt-0.5">
                {strategy.subTitle}
              </span>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">TVL</span>
                <span className="text-black/80" title={strategy.aum.toString()}>
                  ${Number(strategy.aum).toLocaleString("en-US")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Fees APR</span>
                <span className="text-black/80">
                  {strategy.feesApr.USD.toLocaleString("en-US")}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {isConnected && chain?.id === network ? (
          <>
            <div className="p-4 mt-4 bg-white rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium uppercase text-sm">
                  Current Range
                </span>
                <div className="flex items-center space-x-2 bg-zinc-200 rounded-md p-1">
                  <button
                    className={clsx(
                      "appearance-none text-xs focus:outline-none px-4 py-2 text-zinc-800 rounded",
                      rangeToken?.symbol === strategy.token0.symbol &&
                      " bg-white"
                    )}
                    onClick={() => {
                      setRangeToken(strategy.token0);
                    }}
                  >
                    {strategy.token0.symbol}
                  </button>
                  <button
                    className={clsx(
                      "appearance-none text-xs focus:outline-none px-4 py-2 text-zinc-800 rounded",
                      rangeToken?.symbol === strategy.token1.symbol &&
                      "bg-white"
                    )}
                    onClick={() => {
                      setRangeToken(strategy.token1);
                    }}
                  >
                    {strategy.token1.symbol}
                  </button>
                </div>
              </div>
              {currentRange && (
                <p className="mt-3 font-mono">
                  {rangeToken?.symbol === strategy.token0.symbol
                    ? currentRange.lowerTickInA
                    : currentRange.lowerTickInB}{" "}
                  -{" "}
                  {rangeToken?.symbol === strategy.token1.symbol
                    ? currentRange.upperTickInB
                    : currentRange.upperTickInA}{" "}
                  <span className="pl-2 text-sm">
                    {rangeToken?.symbol === strategy.token0.symbol
                      ? strategy.token1.symbol
                      : strategy.token0.symbol}{" "}
                    per{" "}
                    {rangeToken?.symbol === strategy.token1.symbol
                      ? strategy.token1.symbol
                      : strategy.token0.symbol}
                  </span>
                </p>
              )}
            </div>

            <div className="p-4 mt-4 bg-white rounded-lg">
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-zinc-100 p-1">
                  <Tab
                    key="deposit"
                    className={({ selected }) =>
                      clsx(
                        "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-700 focus:outline-none",
                        selected
                          ? "bg-white shadow"
                          : "text-zinc-100 hover:bg-white/[0.12]"
                      )
                    }
                    onChange={() => {
                      refetchBalance0();
                      refetchBalance1();
                      fetchAllowances();
                    }}
                  >
                    Deposit
                  </Tab>
                  <Tab
                    key="remove"
                    className={({ selected }) =>
                      clsx(
                        "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-700 focus:outline-none",
                        selected
                          ? "bg-white shadow"
                          : "text-zinc-100 hover:bg-white/[0.12]"
                      )
                    }
                    onChange={() => {
                      fetchLiquidity();
                      fetchUserShares();
                    }}
                  >
                    Withdraw
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel key="deposit">
                    <div className="px-1 mt-2">
                      {liquidityRatio ? (
                        <div className="space-y-2">
                          {isSSWDeposit ? null : (
                            <div className="flex space-x-2 justify-end py-2">
                              <div className="flex items-center space-x-2 bg-zinc-200 rounded-md p-1">
                                <button
                                  className={clsx(
                                    "appearance-none text-xs focus:outline-none px-4 py-2 text-zinc-800 rounded",
                                    depositType === "BOTH" && " bg-white"
                                  )}
                                  onClick={() => setDepositType("BOTH")}
                                >
                                  Both
                                </button>
                                <button
                                  className={clsx(
                                    "appearance-none text-xs focus:outline-none px-4 py-2 text-zinc-800 rounded",
                                    depositType === "SINGLE" && "bg-white"
                                  )}
                                  onClick={() => setDepositType("SINGLE")}
                                >
                                  Single
                                </button>
                              </div>
                              {depositType === "SINGLE" && (
                                <div className="flex items-center space-x-2 bg-zinc-200 rounded-md p-1">
                                  {allowedToken0 ? (
                                    <button
                                      className={clsx(
                                        "appearance-none text-xs focus:outline-none px-4 py-2 text-zinc-800 rounded",
                                        singleSideToken?.symbol ===
                                        strategy.token0.symbol && " bg-white"
                                      )}
                                      onClick={() => {
                                        setAmount0("");
                                        setSingleSideToken(strategy.token0);
                                      }}
                                    >
                                      {strategy.token0.symbol}
                                    </button>
                                  ) : null}
                                  {allowedToken1 ? (
                                    <button
                                      className={clsx(
                                        "appearance-none text-xs focus:outline-none px-4 py-2 text-zinc-800 rounded",
                                        singleSideToken?.symbol ===
                                        strategy.token1.symbol && "bg-white"
                                      )}
                                      onClick={() => {
                                        setAmount1("");
                                        setSingleSideToken(strategy.token1);
                                      }}
                                    >
                                      {strategy.token1.symbol}
                                    </button>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          )}
                          {depositType === "BOTH" ? (
                            <div className="space-y-2">
                              <div className="border border-zinc-200/50 rounded-2xl w-full p-2 flex flex-col items-end bg-zinc-50">
                                <div className="flex">
                                  <input
                                    value={amount0}
                                    type="number"
                                    className="pt-4 pb-2 pl-2 pr-6 text-zinc-800 font-mono text-4xl focus:outline-none flex-1 w-full bg-transparent"
                                    placeholder="0.00"
                                    onInput={() => {
                                      setToken0Max(false);
                                    }}
                                    onChange={(e) => {
                                      handleAmount0Change(e);
                                    }}
                                  />
                                  <div className="pt-4 flex flex-col items-end space-y-2">
                                    <div className="py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-medium w-[64px] flex items-center justify-center">
                                      {strategy.token0.symbol}
                                    </div>
                                  </div>
                                </div>
                                {token0Balance && (
                                  <span className="text-zinc-500 text-sm px-2">
                                    Balance: {token0Balance?.formatted ?? "0"}{" "}
                                    <button
                                      onClick={handleToken0Max}
                                      className="hover:underline hover:cursor-pointer"
                                    >
                                      Max
                                    </button>
                                  </span>
                                )}
                              </div>
                              <div className="border border-zinc-200/50 rounded-2xl w-full p-2 flex flex-col items-end bg-zinc-50">
                                <div className="flex">
                                  <input
                                    value={amount1}
                                    type="number"
                                    className="pt-4 pb-2 pl-2 pr-6 text-zinc-800 font-mono text-4xl focus:outline-none flex-1 w-full bg-transparent"
                                    placeholder="0.00"
                                    onInput={() => {
                                      setToken1Max(false);
                                    }}
                                    onChange={(e) => handleAmount1Change(e)}
                                  />
                                  <div className="pt-4 flex flex-col items-end space-y-2">
                                    <div className="py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-medium w-[64px] flex items-center justify-center">
                                      {strategy.token1.symbol}
                                    </div>
                                  </div>
                                </div>
                                {token1Balance && (
                                  <span className="text-zinc-500 text-sm px-2 hover:underline hover:cursor-pointer">
                                    Balance: {token1Balance?.formatted ?? "0"}{" "}
                                    <button
                                      onClick={handleToken1Max}
                                      className="hover:underline hover:cursor-pointer"
                                    >
                                      Max
                                    </button>
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <SingleInput
                              amount={
                                singleSideTokenType === SingleSideTokenType.ZERO
                                  ? amount0
                                  : amount1
                              }
                              setAmount={(amount) => {
                                singleSideTokenType === SingleSideTokenType.ZERO
                                  ? (setAmount0(amount), setToken0Max(false))
                                  : (setAmount1(amount), setToken1Max(false));
                              }}
                              balance={
                                singleSideTokenType === SingleSideTokenType.ZERO
                                  ? token0Balance?.formatted
                                  : token1Balance?.formatted
                              }
                              rawBalance={
                                singleSideTokenType === SingleSideTokenType.ZERO
                                  ? token0Balance?.value
                                  : token1Balance?.value
                              }
                              token={singleSideToken}
                            />
                          )}
                        </div>
                      ) : (
                        <SingleInput
                          amount={
                            singleSideTokenType === SingleSideTokenType.ZERO
                              ? amount0
                              : amount1
                          }
                          setAmount={(amount) => {
                            singleSideTokenType === SingleSideTokenType.ZERO
                              ? (setAmount0(amount), setToken0Max(false))
                              : (setAmount1(amount), setToken1Max(false));
                          }}
                          balance={
                            singleSideTokenType === SingleSideTokenType.ZERO
                              ? token0Balance?.formatted
                              : token1Balance?.formatted
                          }
                          rawBalance={
                            singleSideTokenType === SingleSideTokenType.ZERO
                              ? token0Balance?.value
                              : token1Balance?.value
                          }
                          token={singleSideToken}
                        />
                      )}

                      <div className="mt-4">
                        {strategy &&
                          (!isToken0Approved || !isToken1Approved) ? (
                          <div className={`flex items-center space-x-2`}>
                            {!isToken0Approved && (
                              <button
                                className={`w-full p-4 rounded-lg text-sm bg-[${color}] bg-opacity-20 text-[#2463EB] font-medium disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed`}
                                disabled={approve0Loading}
                                onClick={() => approveToken0()}
                              >
                                {approve0Loading
                                  ? "Approving..."
                                  : `Approve ${strategy.token0.symbol}`}
                              </button>
                            )}
                            {!isToken1Approved && (
                              <button
                                className={`w-full p-4 rounded-lg text-sm bg-[${color}] bg-opacity-20 text-[#2463EB] font-medium disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed`}
                                disabled={approve1Loading}
                                onClick={() => approveToken1()}
                              >
                                {approve1Loading
                                  ? "Approving..."
                                  : `Approve ${strategy.token1.symbol}`}
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            className={`w-full p-4 rounded-lg text-sm bg-[${color}] text-white font-medium disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed`}
                            disabled={!!depositError || depositLoading}
                            onClick={() => deposit()}
                          >
                            {depositError
                              ? depositError
                              : depositLoading
                                ? "Depositing..."
                                : "Deposit"}
                          </button>
                        )}
                      </div>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel key="remove">
                    <div className="px-1 mt-2">
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-4xl text-zinc-800 font-medium">
                          {removePercentage}%
                        </span>
                        <div className="flex items-center space-x-2">
                          {[25, 50, 75, 100].map((val, idx) => {
                            return (
                              <>
                                <button
                                  key={idx}
                                  className={clsx(
                                    "px-2 py-1 text-sm border rounded",
                                    removePercentage === val.toString()
                                      ? "bg-[#2463EB] text-white"
                                      : "border-zinc-200 bg-zinc-50 text-zinc-800"
                                  )}
                                  onClick={() =>
                                    setRemovePercentage(val.toString())
                                  }
                                >
                                  {val === 100 ? "Max" : `${val}%`}
                                </button>
                              </>
                            );
                          })}
                        </div>
                      </div>
                      <input
                        aria-labelledby="input slider"
                        list="percentages"
                        max="100"
                        min="1"
                        step="1"
                        type="range"
                        className="mt-3 w-full"
                        value={removePercentage}
                        onChange={(e) => setRemovePercentage(e.target.value)}
                      />

                      <div className="flex flex-col space-y-2 mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-zinc-500">Your Share</span>
                          <span className="font-medium">
                            {userShare &&
                              +parseFloat(formatEther(userShare)).toFixed(4)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-zinc-500">
                            {strategy.token0.symbol}
                          </span>
                          <span className="font-medium">
                            {strategyAmount0 &&
                              parseFloat(
                                (
                                  strategyAmount0 *
                                  +userShareFraction *
                                  (Number(removePercentage) / 100)
                                ).toFixed(4)
                              )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-zinc-500">
                            {strategy.token1.symbol}
                          </span>
                          <span className="font-medium">
                            {strategyAmount1 &&
                              parseFloat(
                                (
                                  strategyAmount1 *
                                  userShareFraction *
                                  (Number(removePercentage) / 100)
                                ).toFixed(4)
                              )}
                          </span>
                        </div>
                      </div>

                      <button
                        className={`mt-6 w-full p-4 rounded-lg text-sm bg-[${color}] text-white font-medium disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed`}
                        disabled={!!withdrawError || withdrawLoading}
                        onClick={() => remove()}
                      >
                        {withdrawError
                          ? withdrawError
                          : withdrawLoading
                            ? "Withdrawing..."
                            : "Withdraw"}
                      </button>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </>
        ) : (
          <div className="pt-4">
            <Wallet network={network} />
          </div>
        )}
      </div>
    </>
  );
};

export default LiquidityCard;
