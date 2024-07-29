import { fetchPanelData } from '../reducers/panelDataSlice';

export const loadPanelData = () => async (dispatch) => {
  try {
    await dispatch(fetchPanelData());
  } catch (error) {
    console.error('Error loading panel data:', error);
    // Handle error if needed
  }
};
