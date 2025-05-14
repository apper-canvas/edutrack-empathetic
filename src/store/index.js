import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import studentReducer from './studentSlice';
import departmentReducer from './departmentSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    students: studentReducer,
    departments: departmentReducer,
  },
});

export default store;