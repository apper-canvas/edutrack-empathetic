import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  departments: [],
  isLoading: false,
  error: null,
  currentDepartment: null,
};

export const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setDepartments: (state, action) => {
      state.departments = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentDepartment: (state, action) => {
      state.currentDepartment = action.payload;
    },
    addDepartment: (state, action) => {
      state.departments.push(action.payload);
    },
    updateDepartment: (state, action) => {
      const index = state.departments.findIndex(dept => dept.Id === action.payload.Id);
      if (index !== -1) {
        state.departments[index] = action.payload;
      }
    },
    deleteDepartment: (state, action) => {
      state.departments = state.departments.filter(dept => dept.Id !== action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { 
  setLoading, 
  setDepartments, 
  setCurrentDepartment,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  setError 
} = departmentSlice.actions;

export default departmentSlice.reducer;