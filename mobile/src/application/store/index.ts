import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import type { Gateways } from '../../domain/ports';
import { gateways } from '../../infrastructure';
import { reduxStorage } from '../../infrastructure/storage/secure-storage';
import cartReducer from './slices/cart.slice';
import checkoutReducer from './slices/checkout.slice';
import historyReducer from './slices/history.slice';
import productsReducer from './slices/products.slice';

const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer,
  history: historyReducer,
  products: productsReducer,
});

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['cart', 'checkout', 'history'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: { extraArgument: gateways },
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ThunkExtra = { extra: Gateways; state: RootState };
