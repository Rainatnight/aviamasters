import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  open: boolean;
  firstOpen: boolean;
  isShowPreviewModal: boolean;
  isOnboarding: boolean;
  isPepeAvailable: boolean;
  isShowDropModal: boolean;
}

const initialState: UIState = {
  open: false,
  firstOpen: true,
  isShowPreviewModal: false,
  isOnboarding: false,
  isPepeAvailable: false,
  isShowDropModal: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    open: (state) => {
      state.open = true;
    },
    close: (state) => {
      state.open = false;
    },
    toggle: (state) => {
      state.open = !state.open;
    },
    setFirstOpen: (state) => {
      state.firstOpen = false;
    },
    setIsShowPreviewModal: (state, action: PayloadAction<boolean>) => {
      state.isShowPreviewModal = action.payload;
    },
    setIsOnboarding: (state, action: PayloadAction<boolean>) => {
      if (action.payload === true) {
        state.isShowPreviewModal = false;
      }

      state.isOnboarding = action.payload;
    },
    setIsPepeAvailable: (state, action: PayloadAction<boolean>) => {
      state.isPepeAvailable = action.payload;
    },
    setIsShowDropModal: (state, action: PayloadAction<boolean>) => {
      state.isShowDropModal = action.payload;
    },
  },
});

export const { open, close, toggle, setFirstOpen, setIsShowPreviewModal, setIsOnboarding, setIsPepeAvailable, setIsShowDropModal } = uiSlice.actions;
export default uiSlice.reducer;
