import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  categoryStats: [],
  overallStats: {
    totalCategories: 0,
    totalQuestions: 0,
    attemptedQuestions: 0,
    overallCorrectRate: 0,
  },
  modalOpen: false,
};

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCategoryStats: (state, action) => {
      state.categoryStats = action.payload;
    },
    setOverallStats: (state, action) => {
      state.overallStats = action.payload;
    },
    openStatsModal: (state) => {
      state.modalOpen = true;
    },
    closeStatsModal: (state) => {
      state.modalOpen = false;
    },
    resetStats: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setCategoryStats,
  setOverallStats,
  openStatsModal,
  closeStatsModal,
  resetStats,
} = statsSlice.actions;

export default statsSlice.reducer;
