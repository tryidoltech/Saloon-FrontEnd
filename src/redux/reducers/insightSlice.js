import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrlDashboard = import.meta.env.VITE_API_DASHBOARD;

export const fetchInsightData = createAsyncThunk('insight/fetchInsightData', async () => {
  const response = await axios.get(apiUrlDashboard);
  const data = response.data;
  return {
    newUser: data.new_clients.length,
    oldUser: data.total_clients.length - data.new_clients.length,
    totalCount: data.total_clients.length,
  };
});

const insightSlice = createSlice({
  name: 'insight',
  initialState: {
    newUser: 0,
    oldUser: 0,
    totalCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInsightData.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default insightSlice.reducer;
