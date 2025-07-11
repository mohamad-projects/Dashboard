// src/features/auth/authService.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// جلب أنواع الخدمات
export const getAllServiceTypes = createAsyncThunk(
  'services/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/services/servicesType/');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// جلب معلومات الخدمة حسب النوع
export const getServiceInfoById = createAsyncThunk(
  'services/getInfoById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/services/servicesType/${id}`);
      return { id, data: response.data.data.services_info };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// حذف خدمة فرعية
export const deleteServiceById = createAsyncThunk(
  'services/deleteService',
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`/services/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ حذف خدمة رئيسية
export const deleteMainServiceType = createAsyncThunk(
  'services/deleteMainServiceType',
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`/admin/serviceTypes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// إنشاء نوع خدمة رئيسية جديدة
export const createServiceType = createAsyncThunk(
  'services/createServiceType',
  async (type, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/serviceTypes', { type });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    loading: false,
    error: null,
    services: [],
    selectedServiceId: null,
    selectedServiceInfo: [],
  },
  reducers: {
    setSelectedServiceId: (state, action) => {
      state.selectedServiceId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllServiceTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllServiceTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(getAllServiceTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getServiceInfoById.fulfilled, (state, action) => {
        state.selectedServiceInfo = action.payload.data;
      })
      .addCase(deleteServiceById.fulfilled, (state, action) => {
        const id = action.payload;
        state.selectedServiceInfo = state.selectedServiceInfo.filter(s => s.id !== id);
      })
      .addCase(deleteMainServiceType.fulfilled, (state, action) => {
        const id = action.payload;
        state.services = state.services.filter(service => service.id !== id);
        if (state.selectedServiceId === id) {
          state.selectedServiceId = null;
          state.selectedServiceInfo = [];
        }
      })
      .addCase(createServiceType.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      .addCase(createServiceType.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setSelectedServiceId } = servicesSlice.actions;
export const servicesReducer = servicesSlice.reducer;
