import { configureStore } from "@reduxjs/toolkit";
import certificateSlice from "./slicer/certificateSlice";
import userSlice from "./slicer/userSlice";
import historySlice from "./slicer/historySlice";

const store = configureStore({
  reducer: {
    certificates: certificateSlice,
    users: userSlice,
    history: historySlice,
  },
});

export default store;
