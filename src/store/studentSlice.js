import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  students: [],
  isLoading: false,
  error: null,
  currentStudent: null,
};

export const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setStudents: (state, action) => {
      state.students = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentStudent: (state, action) => {
      state.currentStudent = action.payload;
    },
    addStudent: (state, action) => {
      state.students.push(action.payload);
    },
    updateStudent: (state, action) => {
      const index = state.students.findIndex(student => student.Id === action.payload.Id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    deleteStudent: (state, action) => {
      state.students = state.students.filter(student => student.Id !== action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { 
  setLoading, 
  setStudents, 
  setCurrentStudent,
  addStudent,
  updateStudent,
  deleteStudent,
  setError 
} = studentSlice.actions;

export default studentSlice.reducer;