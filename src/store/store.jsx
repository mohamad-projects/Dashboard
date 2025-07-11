import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from '../features/auth/authSlice';
import { realEstateReducer } from '../features/realestate/realEstateSlice';
import { officeReducer } from '../features/office/officeSlice';
import { searchReducer } from '../features/search/searchSlice';
import { servicesReducer } from '../features/auth/authService';

const reducers = combineReducers({
    auth: authReducer,
    realestate: realEstateReducer,
    office: officeReducer,
    search: searchReducer,
    services: servicesReducer, 
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'realestate','office','search','services'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
