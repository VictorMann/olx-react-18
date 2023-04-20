import  { createSlice } from '@reduxjs/toolkit';

import { AdType } from '../../types';

let ad: AdType = {};

const slice = createSlice({
  name: 'modalAdItem',
  initialState: {
    opened: false,
    ad,
  },
  reducers: {
    setOpen(state, action) {
      state.opened = action.payload;
    },
    setAd(state, action) {
      state.ad = {...action.payload};
    }
  }
});

export const { setOpen, setAd } = slice.actions;
export default slice.reducer;