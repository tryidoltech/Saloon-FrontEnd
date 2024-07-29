import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrlDashboard = import.meta.env.VITE_API_DASHBOARD;

export const fetchApptDashCardsData = createAsyncThunk('apptDashCards/fetchApptDashCardsData', async () => {
  const response = await axios.get(apiUrlDashboard);
  return response.data;
});

const apptDashCardsSlice = createSlice({
  name: 'apptDashCards',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchApptDashCardsData.fulfilled, (state, action) => {
      const data = action.payload;
      return [
        {
          status: 'Pending Appointment',
          count: data.pending_appointment.length,
          color: '#0BF4C8', // Update the color as per your requirement
        },
        {
          status: 'Confirmed Appointment',
          count: data.confirmed_services.length,
          color: '#FAD85D', // Update the color as per your requirement
        },
        {
          status: 'Checkin Appointment',
          count: data.checkedIn_services.length,
          color: '#F08E71', // Update the color as per your requirement
        },
        {
          status: 'Paid Appointment',
          count: data.paid_services.length,
          color: '#F2A0FF', // Update the color as per your requirement
        }
      ];
    });
  },
});

export default apptDashCardsSlice.reducer;
