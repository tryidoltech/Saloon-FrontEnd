// reducers/panelDataSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import bookingImg from '../../assets/booking.png';
import weekBookingImg from '../../assets/week_booking.png';
import totCustImg from '../../assets/tot_cust.png';
import newCustImg from '../../assets/new_cust.png';

const apiUrlDashboard = import.meta.env.VITE_API_DASHBOARD;

export const fetchPanelData = createAsyncThunk('panelData/fetchPanelData', async () => {
  try {
    const response = await axios.get(apiUrlDashboard);
    return response.data;
  } catch (error) {
    console.error('Error fetching panel data:', error);
    throw error;
  }
});

const panelDataSlice = createSlice({
  name: 'panelData',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPanelData.fulfilled, (state, action) => {
      const data = action.payload;
      return [
        {
          id: '1',
          heading: 'Today Booking',
          img: bookingImg,
          panelinfo: data.todays_services.length,
        },
        {
          id: '2',
          heading: 'Week Booking',
          img: weekBookingImg,
          panelinfo: data.weekly_services.length,
        },
        {
          id: '3',
          heading: 'Total Customer',
          img: totCustImg,
          panelinfo: data.total_clients.length,
        },
        {
          id: '4',
          heading: 'New Customer',
          img: newCustImg,
          panelinfo: data.new_clients.length,
        }
      ];
    });
    builder.addCase(fetchPanelData.rejected, (state, action) => {
      console.error('Error fetching panel data:', action.error);
    });
  },
});

export default panelDataSlice.reducer;
