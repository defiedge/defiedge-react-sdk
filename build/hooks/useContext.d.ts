import React from "react";
type ContextValue = {
    errorMessage: Error;
    log: (...props: any) => void;
    displayError: (message: string | React.ReactNode | null, code?: any) => void;
};
export declare const Context: React.Context<ContextValue | null>;
export declare const useContext: () => ContextValue;
export {};
