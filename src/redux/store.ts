import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

import { baseApi } from "./service";

import authReducer from "@/redux/features/authSlice";
import uiReducer from "@/redux/features/uiSlice";
import cartReducer from "@/redux/features/cartSlice";

/* -------------------------------------------------------------------------- */
/*                               Persist Config                               */
/* -------------------------------------------------------------------------- */

const cartPersistConfig = {
  key: "cart",
  storage,
};

const persistedCartReducer = persistReducer(
  cartPersistConfig,
  cartReducer
);

/* -------------------------------------------------------------------------- */
/*                                   Store                                    */
/* -------------------------------------------------------------------------- */

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,

    auth: authReducer,

    cart: persistedCartReducer,

    ui: uiReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

/* -------------------------------------------------------------------------- */
/*                                 Persistor                                  */
/* -------------------------------------------------------------------------- */

export const persistor = persistStore(store);

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;