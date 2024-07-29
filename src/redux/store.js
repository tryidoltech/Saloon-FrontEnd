import { configureStore } from "@reduxjs/toolkit";
import panelDataReducer from "../redux/reducers/panelDataSlice";
import insightReducer from "../redux/reducers/insightSlice";
import apptDashCardsReducer from "../redux/reducers/apptDashCardsSlice";

const store = configureStore({
  reducer: {
    panelData: panelDataReducer,
    insight: insightReducer,
    apptDashCards: apptDashCardsReducer,
  },
});

export default store;
