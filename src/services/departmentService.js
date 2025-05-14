import { 
  setLoading, 
  setDepartments, 
  addDepartment, 
  updateDepartment, 
  deleteDepartment, 
  setError 
} from '../store/departmentSlice';

export const fetchDepartments = (filters = {}) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    let whereConditions = [];
    
    // Add search filter if it exists
    if (filters.searchTerm) {
      whereConditions.push({
        operator: 'OR',
        conditions: [
          {
            fieldName: 'Name',
            operator: 'Contains',
            values: [filters.searchTerm]
          },
          {
            fieldName: 'code',
            operator: 'Contains',
            values: [filters.searchTerm]
          },
          {
            fieldName: 'head',
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
    
    const response = await apperClient.fetchRecords('department1', params);
    dispatch(setDepartments(response.data || []));
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    dispatch(setError(error.message));
    return [];
  }
};

export const createDepartment = (departmentData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.createRecord('department1', departmentData);
    if (response && response.success) {
      dispatch(addDepartment(response.data));
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to create department');
    }
  } catch (error) {
    console.error("Error creating department:", error);
    dispatch(setError(error.message));
    throw error;
  }
};

export const updateDepartmentRecord = (departmentData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.updateRecord('department1', departmentData);
    if (response && response.success) {
      dispatch(updateDepartment(response.data));
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to update department');
    }
  } catch (error) {
    console.error("Error updating department:", error);
    dispatch(setError(error.message));
    throw error;
  }
};

export const deleteDepartmentRecord = (departmentId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.deleteRecord('department1', { RecordIds: [departmentId] });
    if (response && response.success) {
      dispatch(deleteDepartment(departmentId));
      return true;
    } else {
      throw new Error(response.message || 'Failed to delete department');
    }
  } catch (error) {
    console.error("Error deleting department:", error);
    dispatch(setError(error.message));
    throw error;
  }
};