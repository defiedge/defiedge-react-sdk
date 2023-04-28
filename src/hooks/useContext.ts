import React, { createContext } from "react";

type ContextValue = {
  errorMessage: Error;
  log: (...props: any) => void;
  displayError: (message: string | React.ReactNode | null, code?: any) => void;
};

export const Context = createContext<ContextValue | null>(null);

export const useContext = () => {
  const context = React.useContext(Context);
  if (!context) throw Error("ConnectKit Hook must be inside a Provider.");
  return context;
};
