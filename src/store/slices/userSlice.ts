import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  data: any;
  loading: boolean;
}

const initialState: UserState = {
  data: null,
  loading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.data = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearUser(state) {
      state.data = null;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
