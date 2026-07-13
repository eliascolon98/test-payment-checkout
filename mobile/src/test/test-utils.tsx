import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import type { Gateways } from '../domain/ports';
import cart from '../application/store/slices/cart.slice';
import checkout from '../application/store/slices/checkout.slice';
import history from '../application/store/slices/history.slice';
import products from '../application/store/slices/products.slice';

const rootReducer = combineReducers({ cart, checkout, history, products });

type PreloadedState = Partial<ReturnType<typeof rootReducer>>;

export const makeTestStore = (
  gateways: Partial<Gateways> = {},
  preloadedState?: PreloadedState,
) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: gateways as Gateways } }),
  });

export type TestStore = ReturnType<typeof makeTestStore>;

export const renderWithStore = (
  ui: React.ReactElement,
  store: TestStore,
) => render(<Provider store={store}>{ui}</Provider>);

export const mockNavigation = () =>
  ({
    navigate: jest.fn(),
    replace: jest.fn(),
    reset: jest.fn(),
    popToTop: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  }) as never;
