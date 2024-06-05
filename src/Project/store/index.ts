import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../User/reducer";
import brewReducer from "../Home/brewReducer"

export interface ProjectState {
  userReducer: {
    currentUser: any;
  }
  brewReducer: {
    currentBrews: any[]
  }
  
}
const store = configureStore({
  reducer: {
    userReducer,
    brewReducer,
  }
});

export default store;