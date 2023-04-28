import { SupportedChainId } from '@defiedge/sdk/dist/src/types';
export { SupportedChainId } from '@defiedge/sdk/dist/src/types';
import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { useCallback, useState, useMemo, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { getStrategyInfo, getStrategyMetaData, getLiquidityRatio, getRanges, isStrategyTokenApproved, getUserDeshareBalance, approveStrategyToken, depositLP, removeLP } from '@defiedge/sdk';
import { useSwitchNetwork, useNetwork, useAccount, useSigner, useBalance, useToken, createClient, WagmiConfig } from 'wagmi';
import { ethers } from 'ethers';
import clsx from 'clsx';
import axios from 'axios';
import { useIsMounted, ConnectKitButton, getDefaultClient, ConnectKitProvider } from 'connectkit';
import { mainnet, bsc, polygon, arbitrum, optimism } from 'wagmi/chains';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "/*! tailwindcss v2.2.17 | MIT License | https://tailwindcss.com*/\n\n/*! modern-normalize v1.1.0 | MIT License | https://github.com/sindresorhus/modern-normalize */html{-moz-tab-size:4;-o-tab-size:4;tab-size:4;line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji}hr{height:0;color:inherit}abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],button{-webkit-appearance:button}::-moz-focus-inner{border-style:none;padding:0}legend{padding:0}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}button{background-color:transparent;background-image:none}fieldset,ol,ul{margin:0;padding:0}ol,ul{list-style:none}html{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}body{font-family:inherit;line-height:inherit}*,:after,:before{box-sizing:border-box;border:0 solid}hr{border-top-width:1px}img{border-style:solid}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}table{border-collapse:collapse}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}button,input,optgroup,select,textarea{padding:0;line-height:inherit;color:inherit}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}*,:after,:before{--tw-border-opacity:1;border-color:rgba(229,231,235,var(--tw-border-opacity))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.mt-2{margin-top:.5rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.mr-2{margin-right:.5rem}.flex{display:flex}.table{display:table}.h-8{height:2rem}.w-8{width:2rem}.w-full{width:100%}.max-w-lg{max-width:32rem}.flex-1{flex:1 1 0%}@keyframes spin{to{transform:rotate(1turn)}}@keyframes ping{75%,to{transform:scale(2);opacity:0}}@keyframes pulse{50%{opacity:.5}}@keyframes bounce{0%,to{transform:translateY(-25%);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,.2,1)}}.animate-spin{animation:spin 1s linear infinite}.appearance-none{-webkit-appearance:none;-moz-appearance:none;appearance:none}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.space-x-1>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(0.25rem*var(--tw-space-x-reverse));margin-left:calc(0.25rem*(1 - var(--tw-space-x-reverse)))}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(0.5rem*var(--tw-space-x-reverse));margin-left:calc(0.5rem*(1 - var(--tw-space-x-reverse)))}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.5rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.5rem*var(--tw-space-y-reverse))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem*var(--tw-space-y-reverse))}.rounded{border-radius:.25rem}.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}.rounded-xl{border-radius:.75rem}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.border{border-width:1px}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgba(255,255,255,var(--tw-bg-opacity))}.bg-opacity-20{--tw-bg-opacity:0.2}.p-1{padding:.25rem}.p-2{padding:.5rem}.p-4{padding:1rem}.px-1{padding-left:.25rem;padding-right:.25rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.py-0{padding-top:0;padding-bottom:0}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-4{padding-top:1rem;padding-bottom:1rem}.py-0\\.5{padding-top:.125rem;padding-bottom:.125rem}.py-2\\.5{padding-top:.625rem;padding-bottom:.625rem}.pt-0{padding-top:0}.pt-4{padding-top:1rem}.pt-0\\.5{padding-top:.125rem}.pr-6{padding-right:1.5rem}.pb-2{padding-bottom:.5rem}.pl-2{padding-left:.5rem}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}.text-xs{font-size:.75rem;line-height:1rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.font-medium{font-weight:500}.font-bold{font-weight:700}.uppercase{text-transform:uppercase}.leading-5{line-height:1.25rem}.tracking-wide{letter-spacing:.025em}.text-white{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration:underline}*,:after,:before{--tw-shadow:0 0 transparent}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06);box-shadow:var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow)}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}*,:after,:before{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,0.5);--tw-ring-offset-shadow:0 0 transparent;--tw-ring-shadow:0 0 transparent}";
styleInject(css_248z);

const Wallet = ({ network }) => {
    const isMounted = useIsMounted();
    const { switchNetwork } = useSwitchNetwork();
    const { chain } = useNetwork();
    if (!isMounted)
        return null;
    return (jsx(ConnectKitButton.Custom, { children: ({ isConnected, show, truncatedAddress, ensName }) => {
            if (isConnected && (chain === null || chain === void 0 ? void 0 : chain.id) !== network) {
                return (jsx("button", { className: "w-full py-4 bg-zinc-800 text-zinc-100 rounded-lg", onClick: () => switchNetwork === null || switchNetwork === void 0 ? void 0 : switchNetwork(network), children: "Switch Network" }));
            }
            return (jsx("button", { className: "w-full py-4 bg-zinc-800 text-zinc-100 rounded-lg", onClick: show, children: isConnected ? ensName !== null && ensName !== void 0 ? ensName : truncatedAddress : "Connect Wallet" }));
        } }));
};

const SingleInput = ({ amount, setAmount, token, balance, rawBalance, }) => {
    const handleTokenMax = useCallback(() => {
        if (rawBalance && token) {
            setAmount(ethers.utils.formatUnits(rawBalance, token.decimals));
        }
    }, [rawBalance, setAmount, token]);
    const handleAmountChange = useCallback((e) => {
        const value = e.target.value;
        if (!isNaN(value) && Number(value) >= 0) {
            setAmount(value);
        }
    }, [setAmount]);
    return (jsx(Fragment, { children: jsxs("div", { className: "border border-zinc-200/50 rounded-2xl w-full p-2 flex flex-col items-end bg-zinc-50", children: [jsxs("div", { className: "flex", children: [jsx("input", { value: amount, type: "number", className: "pt-4 pb-2 pl-2 pr-6 text-zinc-800 font-mono text-4xl focus:outline-none flex-1 w-full bg-transparent", placeholder: "0.00", onChange: (e) => handleAmountChange(e) }), jsx("div", { className: "pt-4 flex flex-col items-end space-y-2", children: jsx("div", { className: "py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-medium w-[64px] flex items-center justify-center", children: token === null || token === void 0 ? void 0 : token.symbol }) })] }), balance && (jsxs("span", { className: "text-zinc-500 text-sm px-2 hover:underline hover:cursor-pointer", onClick: handleTokenMax, children: ["Balance: ", balance !== null && balance !== void 0 ? balance : "0"] }))] }) }));
};

var SingleSideTokenType;
(function (SingleSideTokenType) {
    SingleSideTokenType[SingleSideTokenType["ZERO"] = 0] = "ZERO";
    SingleSideTokenType[SingleSideTokenType["ONE"] = 1] = "ONE";
})(SingleSideTokenType || (SingleSideTokenType = {}));
const LiquidityCard = ({ strategyAddress, network, color = "#2463EB", }) => {
    var _a, _b, _c;
    const isMounted = useIsMounted();
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { data: signer } = useSigner();
    const provider = signer === null || signer === void 0 ? void 0 : signer.provider;
    const [strategy, setStrategy] = useState(null);
    const [isToken0Approved, setIsToken0Approved] = useState(false);
    const [isToken1Approved, setIsToken1Approved] = useState(false);
    const [liquidityRatio, setLiquidityRatio] = useState(0);
    const [userShare, setUserShare] = useState();
    const [userShareFraction, setUserShareFraction] = useState(0);
    const [strategyAmount0, setStrategyAmount0] = useState(0);
    const [strategyAmount1, setStrategyAmount1] = useState(0);
    const [currentRange, setCurrentRange] = useState();
    const [amount0, setAmount0] = useState("");
    const [amount1, setAmount1] = useState("");
    const [removePercentage, setRemovePercentage] = useState("25");
    const [depositType, setDepositType] = useState("BOTH");
    const [singleSideToken, setSingleSideToken] = useState(strategy === null || strategy === void 0 ? void 0 : strategy.token0);
    const [depositError, setDepositError] = useState(null);
    const [withdrawError, setWithdrawError] = useState(null);
    const [rangeToken, setRangeToken] = useState(strategy === null || strategy === void 0 ? void 0 : strategy.token0);
    const singleSideTokenType = useMemo(() => (singleSideToken === null || singleSideToken === void 0 ? void 0 : singleSideToken.symbol) === (strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol)
        ? SingleSideTokenType.ZERO
        : SingleSideTokenType.ONE, [singleSideToken === null || singleSideToken === void 0 ? void 0 : singleSideToken.symbol, strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol]);
    // loading states
    const [depositLoading, setDepositLoading] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [approve0Loading, setApprove0Loading] = useState(false);
    const [approve1Loading, setApprove1Loading] = useState(false);
    useEffect(() => {
        if (!strategyAddress)
            return;
        Promise.all([
            getStrategyInfo(network, strategyAddress),
            getStrategyMetaData(network, strategyAddress),
        ]).then(([info, metadata]) => {
            setStrategy({ ...info, ...metadata });
            setSingleSideToken(info.token0);
            setRangeToken(info.token0);
        });
    }, [network, strategyAddress]);
    useEffect(() => {
        if (!provider)
            return;
        Promise.all([
            getLiquidityRatio(strategyAddress, provider),
            getRanges(strategyAddress, provider),
        ]).then(([liquidityRatio, ranges]) => {
            setLiquidityRatio(liquidityRatio);
            setCurrentRange(ranges[0]);
        });
    }, [provider, strategyAddress]);
    const fetchAllowances = useCallback(() => {
        if (!address || !provider)
            return;
        Promise.all([
            isStrategyTokenApproved(address, 0, amount0 !== null && amount0 !== void 0 ? amount0 : 0, strategyAddress, provider),
            isStrategyTokenApproved(address, 1, amount1 !== null && amount1 !== void 0 ? amount1 : 0, strategyAddress, provider),
        ]).then(([token0, token1]) => {
            setIsToken0Approved(token0);
            setIsToken1Approved(token1);
        });
    }, [address, amount0, amount1, provider, strategyAddress]);
    const { data: token0Balance, refetch: refetchBalance0 } = useBalance({
        address,
        token: strategy === null || strategy === void 0 ? void 0 : strategy.token0.id,
    });
    const { data: token1Balance, refetch: refetchBalance1 } = useBalance({
        address,
        token: strategy === null || strategy === void 0 ? void 0 : strategy.token1.id,
    });
    const { data: strategyToken } = useToken({
        address: strategyAddress,
    });
    useEffect(() => {
        if (depositType === "BOTH") {
            if (!amount0 || !amount1) {
                setDepositError("Enter Amount");
            }
            else if (amount0 &&
                token0Balance &&
                Number(amount0) > Number(token0Balance === null || token0Balance === void 0 ? void 0 : token0Balance.formatted)) {
                setDepositError(`Insufficient ${strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol} balance`);
            }
            else if (amount1 &&
                token1Balance &&
                Number(amount1) > Number(token1Balance === null || token1Balance === void 0 ? void 0 : token1Balance.formatted)) {
                setDepositError(`Insufficient ${strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol} balance`);
            }
            else {
                setDepositError(null);
            }
        }
        else if (depositType === "SINGLE") {
            if (singleSideTokenType === SingleSideTokenType.ZERO) {
                if (!amount0) {
                    setDepositError("Enter Amount");
                }
                else if (amount0 &&
                    token0Balance &&
                    Number(amount0) > Number(token0Balance === null || token0Balance === void 0 ? void 0 : token0Balance.formatted)) {
                    setDepositError(`Insufficient ${strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol} balance`);
                }
                else {
                    setDepositError(null);
                }
            }
            else if (singleSideTokenType === SingleSideTokenType.ONE) {
                if (!amount1) {
                    setDepositError("Enter Amount");
                }
                else if (amount1 &&
                    token1Balance &&
                    Number(amount1) > Number(token1Balance === null || token1Balance === void 0 ? void 0 : token1Balance.formatted)) {
                    setDepositError(`Insufficient ${strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol} balance`);
                }
                else {
                    setDepositError(null);
                }
            }
        }
    }, [
        amount0,
        amount1,
        depositType,
        singleSideTokenType,
        strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol,
        strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol,
        token0Balance,
        token1Balance,
    ]);
    useEffect(() => {
        if (!Number(userShare)) {
            setWithdrawError(`No Shares to Remove`);
        }
        else {
            setWithdrawError(null);
        }
    }, [userShare]);
    const fetchUserShares = useCallback(() => {
        if (!address || !provider)
            return;
        getUserDeshareBalance(address, strategyAddress, provider).then((data) => {
            setUserShare(data);
            if (strategyToken) {
                const fraction = Number(data) / Number(strategyToken.totalSupply.formatted);
                setUserShareFraction(fraction);
            }
        });
    }, [address, provider, strategyAddress, strategyToken]);
    const fetchLiquidity = useCallback(() => {
        axios
            .get(`https://api.defiedge.io/${Object.entries(SupportedChainId).find((e) => e[1] === network)[0]}/${strategyAddress}/liquidity`)
            .then(({ data }) => {
            setStrategyAmount0(data.amount0Total);
            setStrategyAmount1(data.amount1Total);
        })
            .catch((e) => {
            console.error(e);
        });
    }, [network, strategyAddress]);
    useEffect(() => {
        fetchAllowances();
        fetchUserShares();
        fetchLiquidity();
    }, [
        fetchAllowances,
        fetchUserShares,
        fetchLiquidity,
        network,
        strategyAddress,
    ]);
    const handleToken0Max = useCallback(() => {
        if (token0Balance && (strategy === null || strategy === void 0 ? void 0 : strategy.token0)) {
            const value = ethers.utils.formatUnits(token0Balance === null || token0Balance === void 0 ? void 0 : token0Balance.value, strategy === null || strategy === void 0 ? void 0 : strategy.token0.decimals);
            setAmount0(value);
            if (liquidityRatio && depositType === "BOTH") {
                setAmount1((Number(value) * liquidityRatio).toString());
            }
        }
    }, [depositType, liquidityRatio, strategy === null || strategy === void 0 ? void 0 : strategy.token0, token0Balance]);
    const handleToken1Max = useCallback(() => {
        if (token1Balance && (strategy === null || strategy === void 0 ? void 0 : strategy.token1)) {
            const value = ethers.utils.formatUnits(token1Balance === null || token1Balance === void 0 ? void 0 : token1Balance.value, strategy === null || strategy === void 0 ? void 0 : strategy.token1.decimals);
            setAmount1(value);
            if (liquidityRatio && depositType === "BOTH") {
                setAmount0((Number(value) / liquidityRatio).toString());
            }
        }
    }, [depositType, liquidityRatio, strategy === null || strategy === void 0 ? void 0 : strategy.token1, token1Balance]);
    const handleAmount0Change = useCallback((e) => {
        const value = e.target.value;
        setAmount0(value);
        if (liquidityRatio && depositType === "BOTH") {
            setAmount1((Number(value) * liquidityRatio).toString());
        }
    }, [depositType, liquidityRatio]);
    const handleAmount1Change = useCallback((e) => {
        const value = e.target.value;
        setAmount1(value);
        if (liquidityRatio && depositType === "BOTH") {
            setAmount0((Number(value) / liquidityRatio).toString());
        }
    }, [depositType, liquidityRatio]);
    const approveToken0 = useCallback(() => {
        if (!address || !provider)
            return;
        setApprove0Loading(true);
        approveStrategyToken(address, 0, strategyAddress, provider)
            .then((data) => {
            if (!data)
                return;
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
        if (!address || !provider)
            return;
        setApprove1Loading(true);
        approveStrategyToken(address, 1, strategyAddress, provider)
            .then((data) => {
            if (!data)
                return;
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
        if (!address || !provider)
            return;
        setDepositLoading(true);
        depositLP(address, amount0 !== null && amount0 !== void 0 ? amount0 : "0", amount1 !== null && amount1 !== void 0 ? amount1 : "0", strategyAddress, provider)
            .then((data) => {
            if (!data)
                return;
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
        amount1,
        provider,
        refetchBalance0,
        refetchBalance1,
        strategyAddress,
    ]);
    const remove = useCallback(() => {
        if (!address || !provider || !userShare)
            return;
        setWithdrawLoading(true);
        const sharesToRemove = Number(userShare) * (Number(removePercentage) / 100);
        removeLP(address, sharesToRemove, strategyAddress, provider)
            .then((data) => {
            if (!data)
                return;
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
    if (!isMounted)
        return null;
    return (jsx(Fragment, { children: jsxs("div", { className: "p-4 font-sans bg-zinc-100 rounded-lg flex flex-col w-full max-w-lg", children: [jsx("div", { className: "p-4 bg-white rounded-lg", children: jsxs("div", { className: "flex flex-col space-y-4 text-sm", children: [jsxs("div", { className: "flex flex-col", children: [jsx("span", { className: "text-zinc-800 font-bold tracking-wide text-lg", children: strategy === null || strategy === void 0 ? void 0 : strategy.title }), jsx("span", { className: "text-zinc-400 text-xs pt-0.5", children: strategy === null || strategy === void 0 ? void 0 : strategy.subTitle })] }), jsxs("div", { className: "flex flex-col space-y-2", children: [jsxs("div", { className: "flex items-center justify-between text-sm", children: [jsx("span", { className: "text-zinc-500", children: "TVL" }), jsxs("span", { children: ["$", (strategy === null || strategy === void 0 ? void 0 : strategy.aum) &&
                                                        parseFloat(strategy === null || strategy === void 0 ? void 0 : strategy.aum.toFixed(4)).toLocaleString("en-US")] })] }), jsxs("div", { className: "flex items-center justify-between text-sm", children: [jsx("span", { className: "text-zinc-500", children: "Share Price" }), jsxs("span", { children: ["$", (strategy === null || strategy === void 0 ? void 0 : strategy.sharePrice) &&
                                                        parseFloat(strategy === null || strategy === void 0 ? void 0 : strategy.sharePrice.toFixed(4)).toLocaleString("en-US")] })] }), jsxs("div", { className: "flex items-center justify-between text-sm", children: [jsx("span", { className: "text-zinc-500", children: "Returns Since Inception" }), jsxs("span", { children: [((_a = strategy === null || strategy === void 0 ? void 0 : strategy.sinceInception) === null || _a === void 0 ? void 0 : _a.USD) &&
                                                        parseFloat(strategy === null || strategy === void 0 ? void 0 : strategy.sinceInception.USD.toFixed(2)), "%"] })] })] })] }) }), isConnected && (chain === null || chain === void 0 ? void 0 : chain.id) === network ? (jsxs(Fragment, { children: [jsxs("div", { className: "p-4 mt-4 bg-white rounded-lg", children: [jsxs("div", { className: "flex items-center justify-between", children: [jsx("span", { className: "text-zinc-500 font-medium uppercase text-sm", children: "Current Range" }), jsxs("div", { className: "flex items-center space-x-2 bg-zinc-200 rounded-md p-1", children: [jsx("button", { className: clsx("appearance-none text-xs focus:outline-none px-4 py-2 text-zinc-800 rounded", (rangeToken === null || rangeToken === void 0 ? void 0 : rangeToken.symbol) === (strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol) &&
                                                        " bg-white"), onClick: () => {
                                                        setRangeToken(strategy === null || strategy === void 0 ? void 0 : strategy.token0);
                                                    }, children: strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol }), jsx("button", { className: clsx("appearance-none text-xs focus:outline-none px-4 py-2 text-zinc-800 rounded", (rangeToken === null || rangeToken === void 0 ? void 0 : rangeToken.symbol) === (strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol) &&
                                                        "bg-white"), onClick: () => {
                                                        setRangeToken(strategy === null || strategy === void 0 ? void 0 : strategy.token1);
                                                    }, children: strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol })] })] }), currentRange && (jsxs("p", { className: "mt-3 font-mono", children: [(rangeToken === null || rangeToken === void 0 ? void 0 : rangeToken.symbol) === (strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol)
                                            ? currentRange.lowerTickInA
                                            : currentRange.lowerTickInB, " ", "-", " ", (rangeToken === null || rangeToken === void 0 ? void 0 : rangeToken.symbol) === (strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol)
                                            ? currentRange.upperTickInB
                                            : currentRange.upperTickInA, " ", jsxs("span", { className: "pl-2 text-sm", children: [(rangeToken === null || rangeToken === void 0 ? void 0 : rangeToken.symbol) === (strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol)
                                                    ? strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol
                                                    : strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol, " ", "per", " ", (rangeToken === null || rangeToken === void 0 ? void 0 : rangeToken.symbol) === (strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol)
                                                    ? strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol
                                                    : strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol] })] }))] }), jsx("div", { className: "p-4 mt-4 bg-white rounded-lg", children: jsxs(Tab.Group, { children: [jsxs(Tab.List, { className: "flex space-x-1 rounded-xl bg-zinc-100 p-1", children: [jsx(Tab, { className: ({ selected }) => clsx("w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-700 focus:outline-none", selected
                                                    ? "bg-white shadow"
                                                    : "text-zinc-100 hover:bg-white/[0.12]"), onChange: () => {
                                                    refetchBalance0();
                                                    refetchBalance1();
                                                    fetchAllowances();
                                                }, children: "Deposit" }), jsx(Tab, { className: ({ selected }) => clsx("w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-700 focus:outline-none", selected
                                                    ? "bg-white shadow"
                                                    : "text-zinc-100 hover:bg-white/[0.12]"), onChange: () => {
                                                    fetchLiquidity();
                                                    fetchUserShares();
                                                }, children: "Withdraw" })] }), jsxs(Tab.Panels, { children: [jsx(Tab.Panel, { children: jsxs("div", { className: "px-1 mt-2", children: [liquidityRatio ? (jsxs("div", { className: "space-y-2", children: [jsxs("div", { className: "flex space-x-2 justify-end py-2", children: [jsxs("div", { className: "flex items-center space-x-2 bg-zinc-200 rounded-md p-1", children: [jsx("button", { className: clsx("appearance-none text-xs focus:outline-none px-4 py-2 text-zinc-800 rounded", depositType === "BOTH" && " bg-white"), onClick: () => setDepositType("BOTH"), children: "Both" }), jsx("button", { className: clsx("appearance-none text-xs focus:outline-none px-4 py-2 text-zinc-800 rounded", depositType === "SINGLE" && "bg-white"), onClick: () => setDepositType("SINGLE"), children: "Single" })] }), depositType === "SINGLE" && (jsxs("div", { className: "flex items-center space-x-2 bg-zinc-200 rounded-md p-1", children: [jsx("button", { className: clsx("appearance-none text-xs focus:outline-none px-4 py-2 text-zinc-800 rounded", (singleSideToken === null || singleSideToken === void 0 ? void 0 : singleSideToken.symbol) ===
                                                                                        (strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol) && " bg-white"), onClick: () => {
                                                                                        setAmount0("");
                                                                                        setSingleSideToken(strategy === null || strategy === void 0 ? void 0 : strategy.token0);
                                                                                    }, children: strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol }), jsx("button", { className: clsx("appearance-none text-xs focus:outline-none px-4 py-2 text-zinc-800 rounded", (singleSideToken === null || singleSideToken === void 0 ? void 0 : singleSideToken.symbol) ===
                                                                                        (strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol) && "bg-white"), onClick: () => {
                                                                                        setAmount1("");
                                                                                        setSingleSideToken(strategy === null || strategy === void 0 ? void 0 : strategy.token1);
                                                                                    }, children: strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol })] }))] }), depositType === "BOTH" ? (jsxs("div", { className: "space-y-2", children: [jsxs("div", { className: "border border-zinc-200/50 rounded-2xl w-full p-2 flex flex-col items-end bg-zinc-50", children: [jsxs("div", { className: "flex", children: [jsx("input", { value: amount0, type: "number", className: "pt-4 pb-2 pl-2 pr-6 text-zinc-800 font-mono text-4xl focus:outline-none flex-1 w-full bg-transparent", placeholder: "0.00", onChange: (e) => handleAmount0Change(e) }), jsx("div", { className: "pt-4 flex flex-col items-end space-y-2", children: jsx("div", { className: "py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-medium w-[64px] flex items-center justify-center", children: strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol }) })] }), token0Balance && (jsxs("span", { className: "text-zinc-500 text-sm px-2 hover:underline hover:cursor-pointer", onClick: handleToken0Max, children: ["Balance: ", (_b = token0Balance === null || token0Balance === void 0 ? void 0 : token0Balance.formatted) !== null && _b !== void 0 ? _b : "0"] }))] }), jsxs("div", { className: "border border-zinc-200/50 rounded-2xl w-full p-2 flex flex-col items-end bg-zinc-50", children: [jsxs("div", { className: "flex", children: [jsx("input", { value: amount1, type: "number", className: "pt-4 pb-2 pl-2 pr-6 text-zinc-800 font-mono text-4xl focus:outline-none flex-1 w-full bg-transparent", placeholder: "0.00", onChange: (e) => handleAmount1Change(e) }), jsx("div", { className: "pt-4 flex flex-col items-end space-y-2", children: jsx("div", { className: "py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-medium w-[64px] flex items-center justify-center", children: strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol }) })] }), token1Balance && (jsxs("span", { className: "text-zinc-500 text-sm px-2 hover:underline hover:cursor-pointer", onClick: handleToken1Max, children: ["Balance: ", (_c = token1Balance === null || token1Balance === void 0 ? void 0 : token1Balance.formatted) !== null && _c !== void 0 ? _c : "0"] }))] })] })) : (jsx(SingleInput, { amount: singleSideTokenType === SingleSideTokenType.ZERO
                                                                        ? amount0
                                                                        : amount1, setAmount: singleSideTokenType === SingleSideTokenType.ZERO
                                                                        ? setAmount0
                                                                        : setAmount1, balance: singleSideTokenType === SingleSideTokenType.ZERO
                                                                        ? token0Balance === null || token0Balance === void 0 ? void 0 : token0Balance.formatted
                                                                        : token1Balance === null || token1Balance === void 0 ? void 0 : token1Balance.formatted, rawBalance: singleSideTokenType === SingleSideTokenType.ZERO
                                                                        ? token0Balance === null || token0Balance === void 0 ? void 0 : token0Balance.value
                                                                        : token1Balance === null || token1Balance === void 0 ? void 0 : token1Balance.value, token: singleSideToken }))] })) : (jsx(SingleInput, { amount: singleSideTokenType === SingleSideTokenType.ZERO
                                                                ? amount0
                                                                : amount1, setAmount: singleSideTokenType === SingleSideTokenType.ZERO
                                                                ? setAmount0
                                                                : setAmount1, balance: singleSideTokenType === SingleSideTokenType.ZERO
                                                                ? token0Balance === null || token0Balance === void 0 ? void 0 : token0Balance.formatted
                                                                : token1Balance === null || token1Balance === void 0 ? void 0 : token1Balance.formatted, rawBalance: singleSideTokenType === SingleSideTokenType.ZERO
                                                                ? token0Balance === null || token0Balance === void 0 ? void 0 : token0Balance.value
                                                                : token1Balance === null || token1Balance === void 0 ? void 0 : token1Balance.value, token: singleSideToken })), jsx("div", { className: "mt-4", children: strategy &&
                                                                (!isToken0Approved || !isToken1Approved) ? (jsxs("div", { className: `flex items-center space-x-2`, children: [!isToken0Approved && (jsx("button", { className: `w-full p-4 rounded-lg text-sm bg-[${color}] bg-opacity-20 text-[#2463EB] font-medium disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed`, disabled: approve0Loading, onClick: () => approveToken0(), children: approve0Loading
                                                                            ? "Approving..."
                                                                            : `Approve ${strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol}` })), !isToken1Approved && (jsx("button", { className: `w-full p-4 rounded-lg text-sm bg-[${color}] bg-opacity-20 text-[#2463EB] font-medium disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed`, disabled: approve1Loading, onClick: () => approveToken1(), children: approve1Loading
                                                                            ? "Approving..."
                                                                            : `Approve ${strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol}` }))] })) : (jsx("button", { className: `w-full p-4 rounded-lg text-sm bg-[${color}] text-white font-medium disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed`, disabled: !!depositError || depositLoading, onClick: () => deposit(), children: depositError
                                                                    ? depositError
                                                                    : depositLoading
                                                                        ? "Depositing..."
                                                                        : "Deposit" })) })] }) }), jsx(Tab.Panel, { children: jsxs("div", { className: "px-1 mt-2", children: [jsxs("div", { className: "flex items-center justify-between mt-4", children: [jsxs("span", { className: "text-4xl text-zinc-800 font-medium", children: [removePercentage, "%"] }), jsx("div", { className: "flex items-center space-x-2", children: [25, 50, 75, 100].map((val, idx) => {
                                                                        return (jsx(Fragment, { children: jsx("button", { className: clsx("px-2 py-1 text-sm border rounded", removePercentage === val.toString()
                                                                                    ? "bg-[#2463EB] text-white"
                                                                                    : "border-zinc-200 bg-zinc-50 text-zinc-800"), onClick: () => setRemovePercentage(val.toString()), children: val === 100 ? "Max" : `${val}%` }, idx) }));
                                                                    }) })] }), jsx("input", { "aria-labelledby": "input slider", list: "percentages", max: "100", min: "1", step: "1", type: "range", className: "mt-3 w-full", value: removePercentage, onChange: (e) => setRemovePercentage(e.target.value) }), jsxs("div", { className: "flex flex-col space-y-2 mt-4", children: [jsxs("div", { className: "flex items-center justify-between text-sm", children: [jsx("span", { className: "text-zinc-500", children: "Your Share" }), jsx("span", { className: "font-medium", children: userShare &&
                                                                                parseFloat(Number(userShare).toFixed(4)) })] }), jsxs("div", { className: "flex items-center justify-between text-sm", children: [jsx("span", { className: "text-zinc-500", children: strategy === null || strategy === void 0 ? void 0 : strategy.token0.symbol }), jsx("span", { className: "font-medium", children: (strategy === null || strategy === void 0 ? void 0 : strategy.amount0) &&
                                                                                parseFloat((strategyAmount0 *
                                                                                    userShareFraction *
                                                                                    (Number(removePercentage) / 100)).toFixed(4)) })] }), jsxs("div", { className: "flex items-center justify-between text-sm", children: [jsx("span", { className: "text-zinc-500", children: strategy === null || strategy === void 0 ? void 0 : strategy.token1.symbol }), jsx("span", { className: "font-medium", children: (strategy === null || strategy === void 0 ? void 0 : strategy.amount1) &&
                                                                                parseFloat((strategyAmount1 *
                                                                                    userShareFraction *
                                                                                    (Number(removePercentage) / 100)).toFixed(4)) })] })] }), jsx("button", { className: `mt-6 w-full p-4 rounded-lg text-sm bg-[${color}] text-white font-medium disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed`, disabled: !!withdrawError || withdrawLoading, onClick: () => remove(), children: withdrawError
                                                                ? withdrawError
                                                                : withdrawLoading
                                                                    ? "Withdrawing..."
                                                                    : "Withdraw" })] }) })] })] }) })] })) : (jsx("div", { className: "pt-4", children: jsx(Wallet, { network: network }) }))] }) }));
};

const client = createClient(getDefaultClient({
    appName: "@defiedge/react",
    chains: [mainnet, bsc, polygon, arbitrum, optimism],
}));
const DefiedgeProvider = ({ children }) => {
    return (jsx(Fragment, { children: jsx(WagmiConfig, { client: client, children: jsx(ConnectKitProvider, { children: children }) }) }));
};

export { DefiedgeProvider, LiquidityCard };
//# sourceMappingURL=index.es.js.map
