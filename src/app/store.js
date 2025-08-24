/* eslint-disable import/prefer-default-export */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  // FLUSH,
  // REHYDRATE,
  // PAUSE,
  // PERSIST,
  // PURGE,
  // REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import logger from 'redux-logger';

import userReducer from '../features/user/userSlice';
import menuReducer from '../features/menu/menuSlice';
import quizReducer from '../features/quiz/quizSlice';
import historyReducer from '../features/history/historySlice';
import modalReducer from '../features/modal/modalSlice';
import statsReducer from '../features/stats/statsSlice';

const persistConfig = {
  key: 'root',
  version: 3,
  storage,
  // 세션 간 유지가 필요한 슬라이스만 영속화합니다
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  user: userReducer,
  menu: menuReducer,
  quiz: quizReducer,
  history: historyReducer,
  modal: modalReducer,
  stats: statsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      // }).concat(logger),
    }),
});
export const persistor = persistStore(store);
export default store;
