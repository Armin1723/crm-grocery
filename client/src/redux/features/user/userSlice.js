import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  reducers: {
    setUser(state, action) {
      if(action.payload === null) {
        localStorage.removeItem("user");
        return null;
      }
      localStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
