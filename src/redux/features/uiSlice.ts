 
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type TUiState = {
  loginModal:{
    isOpen: boolean;
    tabValue: "login" | "register";
  };
};

const initialState: TUiState = {
  loginModal: {
    isOpen: false,
    tabValue: "login",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoginModalOpen: (state, action: PayloadAction<{ isOpen: boolean }>) => {
      const { isOpen } = action.payload;
      state.loginModal.isOpen = isOpen;
    },
    setLoginModalTab: (state, action: PayloadAction<{ tabValue: "login" | "register" }>) => {
      const { tabValue } = action.payload;
      state.loginModal.tabValue = tabValue;
    },
  },
});

export const { setLoginModalOpen, setLoginModalTab } = uiSlice.actions;
export default uiSlice.reducer;
