"use client";
import { persistor, store } from "@/redux/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import {
  PersistGate,
} from "redux-persist/integration/react";
import ProviderWrapper from "./ProviderWrapper";
const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
       
      <ProviderWrapper>{children}</ProviderWrapper>
      </PersistGate>

    </Provider>
  );
};

export default ReduxProvider;
