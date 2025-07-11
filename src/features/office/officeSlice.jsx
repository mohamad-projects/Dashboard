import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  sendRequest: [],
  office: [],
  officeDetails: [],
  verifications: [],
  loading: false,
  error: null,
};

export const getOffice = createAsyncThunk(
  'office/indexRequest',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('admin/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getOfficeDetails = createAsyncThunk(
  'office/getOfficeDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`profile/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteOffice = createAsyncThunk(
  'office/deleteOffice',
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await api.post(`/admin/delete/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const indexRequest = createAsyncThunk(
  'office/indexSent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('office/indexSent');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendRequest = createAsyncThunk(
  'office/sendRequest',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('office/send-request', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteRequest = createAsyncThunk(
  'office/deleteRequest',
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`/office/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendvertificationRequest = createAsyncThunk(
  'office/sendvertificationRequest',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/verifications/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const updateVerification = createAsyncThunk(
  'office/updateVerification',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`ver/update/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getVerifications = createAsyncThunk(
  'office/getVerifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/verifications');
      console.log(response.data.data.data)
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const deleteVerification = createAsyncThunk(
  'office/deleteVerification',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/verifications/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const officeSlice = createSlice({
  name: 'office',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(deleteVerification.fulfilled, (state, action) => {
  state.verifications = state.verifications.filter((item) => item.id !== action.payload);
})

    .addCase(updateVerification.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(updateVerification.fulfilled, (state, action) => {
  state.loading = false;
})
.addCase(updateVerification.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

      .addCase(getOffice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOffice.fulfilled, (state, action) => {
        state.office = action.payload.data;
        state.loading = false;
      })
      .addCase(getOffice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOfficeDetails.fulfilled, (state, action) => {
        state.officeDetails = action.payload.data;
      })
      .addCase(deleteOffice.fulfilled, (state, action) => {
        const id = action.payload;
        state.office = state.office.filter((office) => office.id !== id);
      })
      .addCase(indexRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(indexRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.sendRequest = action.payload.data;
      })
      .addCase(indexRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.sendRequest.push(action.payload.data);
      })
      .addCase(sendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        const id = action.payload;
        state.sendRequest = state.sendRequest.filter(
          (request) => request.id !== id
        );
      })
      .addCase(sendvertificationRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendvertificationRequest.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendvertificationRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getVerifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVerifications.fulfilled, (state, action) => {
        state.loading = false;
        state.verifications = action.payload.data;
      })
      .addCase(getVerifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const officeReducer = officeSlice.reducer;
