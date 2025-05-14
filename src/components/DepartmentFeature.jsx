import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

// Icon declarations
const BuildingIcon = getIcon('Building');
const SearchIcon = getIcon('Search');
const EditIcon = getIcon('Edit');
const TrashIcon = getIcon('Trash');
const CheckIcon = getIcon('Check');
const XIcon = getIcon('X');
const FilterIcon = getIcon('Filter');
const ArrowDownIcon = getIcon('ArrowDown');
const ArrowUpIcon = getIcon('ArrowUp');
const RefreshCwIcon = getIcon('RefreshCw');
const PlusIcon = getIcon('Plus');

// Initial department data
const initialDepartments = [
  {
    id: '1',
    name: 'Science',
    code: 'SCI',
    head: 'Dr. Emily Chen',
    location: 'Building A, Floor 2',
    establishedDate: '1995-09-01',
    studentCount: 142,
    facultyCount: 12,
    description: 'Department of Physics, Chemistry and Biology'
  },
  {
    id: '2',
    name: 'Mathematics',
    code: 'MATH',
    head: 'Prof. David Wilson',
    location: 'Building B, Floor 3',
    establishedDate: '1995-09-01',
    studentCount: 98,
    facultyCount: 8,
    description: 'Department of Pure and Applied Mathematics'
  },
  {
    id: '3',
    name: 'Arts and Humanities',
    code: 'ART',
    head: 'Dr. Sarah Johnson',
    location: 'Building C, Floor 1',
    establishedDate: '1997-03-15',
    studentCount: 115,
    facultyCount: 10,
    description: 'Department of Literature, History, Philosophy and Fine Arts'
  },
  {
    id: '4',
    name: 'Computer Science',
    code: 'CS',
    head: 'Prof. Michael Zhang',
    location: 'Building D, Floor 4',
    establishedDate: '2001-11-30',
    studentCount: 165,
    facultyCount: 14,
    description: 'Department of Computer Science and Information Technology'
  },
];

function DepartmentFeature() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [isEditingDepartment, setIsEditingDepartment] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // New department template
  const newDepartmentTemplate = {
    id: '',
    name: '',
    code: '',
    head: '',
    location: '',
    establishedDate: '',
    studentCount: 0,
    facultyCount: 0,
    description: ''
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (name === 'studentCount' || name === 'facultyCount') {
      processedValue = value === '' ? 0 : parseInt(value, 10);
    }
    
    setCurrentDepartment((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!currentDepartment.name.trim()) errors.name = 'Department name is required';
    if (!currentDepartment.code.trim()) errors.code = 'Department code is required';
    if (!currentDepartment.head.trim()) errors.head = 'Department head is required';
    if (!currentDepartment.location.trim()) errors.location = 'Location is required';
    if (!currentDepartment.establishedDate) errors.establishedDate = 'Established date is required';
    if (isNaN(currentDepartment.studentCount)) errors.studentCount = 'Student count must be a number';
    if (isNaN(currentDepartment.facultyCount)) errors.facultyCount = 'Faculty count must be a number';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add or update department
  const saveDepartment = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isAddingDepartment) {
        const newDepartment = {
          ...currentDepartment,
          id: Date.now().toString(),
        };
        setDepartments([...departments, newDepartment]);
        toast.success('Department added successfully!');
      } else {
        setDepartments(
          departments.map((department) =>
            department.id === currentDepartment.id ? currentDepartment : department
          )
        );
        toast.success('Department updated successfully!');
      }
      
      resetForm();
      setIsLoading(false);
    }, 800);
  };

  // Delete department
  const deleteDepartment = (id) => {
    if (confirm('Are you sure you want to delete this department?')) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setDepartments(departments.filter((department) => department.id !== id));
        toast.success('Department deleted successfully!');
        setIsLoading(false);
      }, 800);
    }
  };

  // Start adding new department
  const addNewDepartment = () => {
    setCurrentDepartment(newDepartmentTemplate);
    setFormErrors({});
    setIsAddingDepartment(true);
    setIsEditingDepartment(false);
  };

  // Start editing department
  const editDepartment = (department) => {
    setCurrentDepartment({ ...department });
    setFormErrors({});
    setIsEditingDepartment(true);
    setIsAddingDepartment(false);
  };

  // Reset form
  const resetForm = () => {
    setCurrentDepartment(null);
    setFormErrors({});
    setIsAddingDepartment(false);
    setIsEditingDepartment(false);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sorted and filtered departments
  const getFilteredDepartments = () => {
    // First filter by search term
    let filtered = departments.filter((department) => {
      const matchesSearch = 
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.head.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
    
    // Then sort
    filtered.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      // Handle string comparisons
      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }
      
      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Get filtered departments
  const filteredDepartments = getFilteredDepartments();

  // Refresh data
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Department data refreshed');
      setIsLoading(false);
    }, 800);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BuildingIcon className="h-5 w-5 text-primary" />
          Department Management
        </h2>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={refreshData}
            className="btn btn-outline btn-sm flex items-center gap-1"
            disabled={isLoading}
          >
            <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addNewDepartment}
            className="btn btn-primary btn-sm"
            disabled={isLoading || isAddingDepartment || isEditingDepartment}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Department</span>
          </motion.button>
        </div>
      </div>

      {/* Form for adding/editing department */}
      <AnimatePresence>
        {(isAddingDepartment || isEditingDepartment) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-4 md:p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {isAddingDepartment ? 'Add New Department' : 'Edit Department'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Department Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentDepartment?.name || ''}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                    placeholder="Enter department name"
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Department Code*
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={currentDepartment?.code || ''}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.code ? 'border-red-500 dark:border-red-500' : ''}`}
                    placeholder="Enter department code"
                  />
                  {formErrors.code && <p className="mt-1 text-sm text-red-500">{formErrors.code}</p>}
                </div>
                
                <div>
                  <label htmlFor="head" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Department Head*
                  </label>
                  <input
                    type="text"
                    id="head"
                    name="head"
                    value={currentDepartment?.head || ''}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.head ? 'border-red-500 dark:border-red-500' : ''}`}
                    placeholder="Enter department head"
                  />
                  {formErrors.head && <p className="mt-1 text-sm text-red-500">{formErrors.head}</p>}
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={currentDepartment?.location || ''}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.location ? 'border-red-500 dark:border-red-500' : ''}`}
                    placeholder="Enter department location"
                  />
                  {formErrors.location && <p className="mt-1 text-sm text-red-500">{formErrors.location}</p>}
                </div>
                
                <div>
                  <label htmlFor="establishedDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Established Date*
                  </label>
                  <input
                    type="date"
                    id="establishedDate"
                    name="establishedDate"
                    value={currentDepartment?.establishedDate || ''}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.establishedDate ? 'border-red-500 dark:border-red-500' : ''}`}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {formErrors.establishedDate && <p className="mt-1 text-sm text-red-500">{formErrors.establishedDate}</p>}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={currentDepartment?.description || ''}
                    onChange={handleFormChange}
                    className="input-field"
                    placeholder="Enter department description"
                  />
                </div>
                
                <div>
                  <label htmlFor="studentCount" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Student Count
                  </label>
                  <input
                    type="number"
                    id="studentCount"
                    name="studentCount"
                    value={currentDepartment?.studentCount || 0}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.studentCount ? 'border-red-500 dark:border-red-500' : ''}`}
                    placeholder="Enter student count"
                    min="0"
                  />
                  {formErrors.studentCount && <p className="mt-1 text-sm text-red-500">{formErrors.studentCount}</p>}
                </div>
                
                <div>
                  <label htmlFor="facultyCount" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Faculty Count
                  </label>
                  <input
                    type="number"
                    id="facultyCount"
                    name="facultyCount"
                    value={currentDepartment?.facultyCount || 0}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.facultyCount ? 'border-red-500 dark:border-red-500' : ''}`}
                    placeholder="Enter faculty count"
                    min="0"
                  />
                  {formErrors.facultyCount && <p className="mt-1 text-sm text-red-500">{formErrors.facultyCount}</p>}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  className="btn btn-outline flex items-center"
                  disabled={isLoading}
                >
                  <XIcon className="h-4 w-4 mr-1" />
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveDepartment}
                  className="btn btn-primary flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <CheckIcon className="h-4 w-4 mr-1" />
                  )}
                  {isAddingDepartment ? 'Add Department' : 'Save Changes'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search */}
      <div className="relative flex-grow max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-surface-400" />
        </div>
        <input
          type="text"
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 input-field"
        />
      </div>
      
      {/* Departments table */}
      <div className="bg-white dark:bg-surface-800 overflow-x-auto rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
        <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
          <thead className="bg-surface-50 dark:bg-surface-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  <span>Department</span>
                  {sortField === 'name' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ArrowUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700"
                onClick={() => handleSort('code')}
              >
                <div className="flex items-center">
                  <span>Code</span>
                  {sortField === 'code' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ArrowUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden md:table-cell"
                onClick={() => handleSort('head')}
              >
                <div className="flex items-center">
                  <span>Head</span>
                  {sortField === 'head' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ArrowUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden md:table-cell"
              >
                <div className="flex items-center">
                  <span>Established</span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider"
                onClick={() => handleSort('studentCount')}
              >
                <div className="flex items-center">
                  <span>Students</span>
                  {sortField === 'studentCount' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ArrowUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-surface-500">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    <span className="ml-3">Loading department data...</span>
                  </div>
                </td>
              </tr>
            ) : filteredDepartments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-surface-500">
                  {searchTerm ? (
                    <div>
                      <p className="text-lg font-medium mb-2">No matching departments found</p>
                      <p className="text-sm">Try adjusting your search</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium mb-2">No departments available</p>
                      <p className="text-sm">Add departments to get started</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              filteredDepartments.map((department) => (
                <tr 
                  key={department.id}
                  className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium">{department.name}</div>
                        <div className="text-xs text-surface-500 dark:text-surface-400 md:hidden">
                          {department.head}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-primary-light/20 text-primary-dark dark:text-primary-light">
                      {department.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm">{department.head}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm">{formatDate(department.establishedDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{department.studentCount}</div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">
                      Faculty: {department.facultyCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => editDepartment(department)}
                      className="text-primary hover:text-primary-dark mx-1"
                      disabled={isAddingDepartment || isEditingDepartment}
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteDepartment(department.id)}
                      className="text-red-500 hover:text-red-700 mx-1"
                      disabled={isAddingDepartment || isEditingDepartment}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Info message */}
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm">
        <p>
          This department management feature lets you add, edit, and delete academic departments.
          Each department tracks its head, location, establishment date, and student/faculty counts.
        </p>
      </div>
    </div>
  );
}

export default DepartmentFeature;