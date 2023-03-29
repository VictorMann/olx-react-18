import  { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'user',
  initialState: {
    name: 'Bob Marley'
  },
  reducers: {
    setName(state, action) {
      state.name = action.payload;
    },
  }
});

export const { setName } = slice.actions;
export default slice.reducer;