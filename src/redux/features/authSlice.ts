
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../service/auth/type";

type TAuthState = {
  user: User | null;
};

const initialState: TAuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      const { user } = action.payload;
      state.user = user;
    },
    userLogout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, userLogout } = authSlice.actions;
export default authSlice.reducer;
