import { fetchInsightData } from '../reducers/insightSlice';

export const loadInsightData = () => async (dispatch) => {
  await dispatch(fetchInsightData());
};
