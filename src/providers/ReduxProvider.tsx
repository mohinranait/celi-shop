"use client";
import { store } from "@/redux/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import ProviderWrapper from "./ProviderWrapper";
const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <ProviderWrapper>{children}</ProviderWrapper>
    </Provider>
  );
};

export default ReduxProvider;
