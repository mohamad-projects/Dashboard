import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from './../../services/api';

const initialState = {
    realEstate: [],
    locations: [],
    realEstateCount: [],
    loading: false,
    error: false,
};

const realEstateSlice = createSlice({
    name: "realEstate",
    initialState,
    reducers: {
        // You can add manual state reducers here if needed
    },
    extraReducers: (builder) => {
        builder
            // Add Real Estate
            .addCase(AddRealEstate.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(AddRealEstate.fulfilled, (state, action) => {
                state.realEstate = Array.isArray(action.payload) 
                ? action.payload 
                : [];
                state.loading = false;
            })
            .addCase(AddRealEstate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })
            
            // Update Real Estate
            .addCase(updateRealEstate.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateRealEstate.fulfilled, (state, action) => {
                const index = state.realEstate.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.realEstate[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateRealEstate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })
            
            // Get Status
            .addCase(getStatus.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getStatus.fulfilled, (state, action) => {
                state.realEstateCount = action.payload;
                state.loading = false;
            })
            .addCase(getStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })
            
            // Index (Get All)
            .addCase(index.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(index.fulfilled, (state, action) => {
                state.realEstate = action.payload;
                state.loading = false;
            })
            .addCase(index.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })
            

            .addCase(deleteRealEstate.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(deleteRealEstate.fulfilled, (state, action) => {
            try {
                
                if (!state.realEstate || !Array.isArray(state.realEstate)) {
                console.error('Invalid realEstate state:', state.realEstate);
                state.realEstate = []; 
                state.loading = false;
                return; 
                }

                let currentItems;
                try {
                currentItems = Array.from(state.realEstate); 
                } catch (e) {
                console.error('Failed to copy realEstate:', e);
                currentItems = [];
                }

                state.realEstate = currentItems.filter(
                item => item && item.id !== undefined && String(item.id) === String(action.payload)
                );

                state.loading = false;
                state.error = null;

            } catch (error) {
                console.error('Error in deleteRealEstate reducer:', error);
                state.error = error.message;
                state.loading = false;
            }
            })
            .addCase(deleteRealEstate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })
            
            .addCase(getLocation.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getLocation.fulfilled, (state, action) => {
                state.locations = action.payload;
                state.loading = false;
            })
            .addCase(getLocation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            });
    }
});

export const AddRealEstate = createAsyncThunk(
    'realEstate/create',
    async (credentials, { rejectWithValue }) => {
        try {
            console.log(credentials)
            const response = await api.post('/RealEstate/create', credentials, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateRealEstate = createAsyncThunk(
    'realEstate/update',
    async ({ id, ...credentials }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/RealEstate/update/${id}`, credentials);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteRealEstate = createAsyncThunk(
    'realEstate/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.post(`admin/deleteRealEstate/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// export const deleteRealEstateAsAdmin = createAsyncThunk(
//     'admin/delete',
//     async (id, { rejectWithValue }) => {
//         try {
//             await api.post(`admin/deleteRealEstate/${id}`);
//             return id;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || error.message);
//         }
//     }
// );


export const getStatus = createAsyncThunk(
    'realEstate/getStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/RealEstate/getStatus');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);



export const index = createAsyncThunk(
    'realEstate/index',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('RealEstate/index',formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const getLocation = createAsyncThunk(
  'realEstate/getLocation',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/RealEstate/getLocation');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const addLocation = createAsyncThunk(
  'realEstate/addLocation',
  async ({ city, district }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post('/admin/location', { city, district }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteLocation = createAsyncThunk(
  'realEstate/deleteLocation',
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await api.post(`/admin/location/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const { actions: realEstateActions } = realEstateSlice;
export const realEstateReducer = realEstateSlice.reducer;