import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../User/reducer";

export interface ProjectState {
  userReducer: {
    currentUser: any;
  }
}
const store = configureStore({
  reducer: {
    userReducer,
  }
});


export default store;