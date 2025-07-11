import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    mostSearch: [],
    mostWatch: [],
    loading: null,
    error: null,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        // ...
    },
    extraReducers: (builder) => {
        builder
            .addCase(mostSearch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mostSearch.fulfilled, (state, action) => {
                state.loading = false;
                state.mostSearch = action.payload;
            })
            .addCase(mostSearch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            
            .addCase(mostWatch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mostWatch.fulfilled, (state, action) => {
                state.loading = false;
                state.mostWatch = action.payload;
            })
            .addCase(mostWatch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const mostSearch = createAsyncThunk(
    'search/mostSearch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('search/most-search');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const mostWatch = createAsyncThunk(
    'search/mostWatch',  // Changed from 'office/mostWatch' to 'search/mostWatch'
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('search/most-watch');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



// export const mostWatch = createAsyncThunk(
//     'search/mostWatch',
//     async (page = 1, { rejectWithValue }) => {
//         try {
//             const response = await api.get(`/most-watched?page=${page}`);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || error.message);
//         }
//     }
// );

// export const mostSearch = createAsyncThunk(
//     'search/mostSearch',
//     async (page = 1, { rejectWithValue }) => {
//         try {
//             const response = await api.get(`/most-searched?page=${page}`);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || error.message);
//         }
//     }
// );

export const { actions: searchAction } = searchSlice;
export const searchReducer = searchSlice.reducer;