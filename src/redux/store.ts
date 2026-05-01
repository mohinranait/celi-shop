import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './service'
import authReducer from "@/redux/features/authSlice";
import uiReducer from "@/redux/features/uiSlice";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;