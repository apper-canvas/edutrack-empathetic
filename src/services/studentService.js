import { 
  setLoading, 
  setStudents, 
  addStudent, 
  updateStudent, 
  deleteStudent, 
  setError 
} from '../store/studentSlice';

export const fetchStudents = (filters = {}) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    let whereConditions = [];
    
    // Add department filter if it exists
    if (filters.department && filters.department !== 'all') {
      whereConditions.push({
        fieldName: 'department',
        operator: 'ExactMatch',
        values: [filters.department]
      });
    }
    
    // Add grade filter if it exists
    if (filters.gradeLevel && filters.gradeLevel !== 'all') {
      whereConditions.push({
        fieldName: 'gradeLevel',
        operator: 'ExactMatch',
        values: [filters.gradeLevel]
      });
    }
    
    // Add search filter if it exists
    if (filters.searchTerm) {
      whereConditions.push({
        operator: 'OR',
        conditions: [
          {
            fieldName: 'firstName',
            operator: 'Contains',
            values: [filters.searchTerm]
          },
          {
            fieldName: 'lastName',
            operator: 'Contains',
            values: [filters.searchTerm]
          },
          {
            fieldName: 'email',
            operator: 'Contains',
            values: [filters.searchTerm]
          }
        ]
      });
    }
    
    const params = {
      where: whereConditions.length > 0 ? whereConditions : undefined,
      orderBy: filters.sortField ? [
        { field: filters.sortField, direction: filters.sortDirection || 'asc' }
      ] : undefined,
      pagingInfo: {
        limit: filters.limit || 100,
        offset: filters.offset || 0
      }
    };
    
    const response = await apperClient.fetchRecords('student2', params);
    dispatch(setStudents(response.data || []));
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    dispatch(setError(error.message));
    return [];
  }
};

export const createStudent = (studentData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.createRecord('student2', studentData);
    if (response && response.success) {
      dispatch(addStudent(response.data));
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to create student');
    }
  } catch (error) {
    console.error("Error creating student:", error);
    dispatch(setError(error.message));
    throw error;
  }
};

export const updateStudentRecord = (studentData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.updateRecord('student2', studentData);
    if (response && response.success) {
      dispatch(updateStudent(response.data));
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to update student');
    }
  } catch (error) {
    console.error("Error updating student:", error);
    dispatch(setError(error.message));
    throw error;
  }
};

export const deleteStudentRecord = (studentId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.deleteRecord('student2', { RecordIds: [studentId] });
    if (response && response.success) {
      dispatch(deleteStudent(studentId));
      return true;
    } else {
      throw new Error(response.message || 'Failed to delete student');
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    dispatch(setError(error.message));
    throw error;
  }
};