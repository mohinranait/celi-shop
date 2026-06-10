
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TRatingModal } from "@/components/modals/CommentModal";


type TUiState = {
  loginModal: {
    isOpen: boolean;
    tabValue: "login" | "register";
  };
  commentModalOpen: null | TRatingModal,
};

const initialState: TUiState = {
  loginModal: {
    isOpen: false,
    tabValue: "login",
  },
  commentModalOpen: null,
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

    setCommentModal: (state, action: PayloadAction<null | TRatingModal>) => {
      state.commentModalOpen = action.payload ? action?.payload : null;
    },

  },
});

export const { setLoginModalOpen, setLoginModalTab, setCommentModal } = uiSlice.actions;
export default uiSlice.reducer;
