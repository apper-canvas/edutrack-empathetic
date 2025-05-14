import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStudent } from '../store/studentSlice';
import { fetchStudents, createStudent, updateStudentRecord, deleteStudentRecord } from '../services/studentService';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

// Icon declarations
const UserPlusIcon = getIcon('UserPlus');
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

function MainFeature() {
  const dispatch = useDispatch();
  const { students, isLoading } = useSelector((state) => state.students);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [sortField, setSortField] = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formErrors, setFormErrors] = useState({});
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Available departments
  const departments = [
    'Science',
    'Mathematics',
    'Arts and Humanities',
    'Social Sciences',
    'Physical Education',
    'Computer Science',
    'Business Studies'
  ];
  const [gradeFilter, setGradeFilter] = useState('all');

  // Fetch students on component mount
  useEffect(() => {
    // Initial data load
    dispatch(fetchStudents({
      sortField,
      sortDirection
    }));
  }, [dispatch, sortField, sortDirection]);
  
  // New student template
  const newStudentTemplate = {
    id: '',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    gradeLevel: '',
    email: '',
    contactPhone: '',
    department: '',
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent((prev) => ({
      ...prev,
      [name]: value,
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
    if (!currentStudent.firstName.trim()) errors.firstName = 'First name is required';
    if (!currentStudent.lastName.trim()) errors.lastName = 'Last name is required';
    if (!currentStudent.gender) errors.gender = 'Gender is required';
    if (!currentStudent.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!currentStudent.gradeLevel) errors.gradeLevel = 'Grade level is required';
    
    if (!currentStudent.department) errors.department = 'Department is required';
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!currentStudent.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(currentStudent.email)) {
      errors.email = 'Please enter a valid email';
    }

    // Phone validation (simple)
    if (!currentStudent.contactPhone.trim()) {
      errors.contactPhone = 'Phone number is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add or update student
  const saveStudent = () => {
    // Map form fields to database fields
    const mapStudent = (student) => {
      return {
        firstName: student.firstName,
        lastName: student.lastName,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        gradeLevel: student.gradeLevel,
        email: student.email,
        contactPhone: student.contactPhone,
        department: student.department,
      };
    };
    
    if (!validateForm()) return;

    if (isAddingStudent) {
      // Create new student
      const studentData = mapStudent(currentStudent);
      
      dispatch(createStudent(studentData))
        .then(() => {
          resetForm();
          toast.success('Student added successfully!');
          
          // Refresh student list
          dispatch(fetchStudents({
            sortField,
            sortDirection,
            searchTerm: searchTerm || undefined,
            gradeLevel: gradeFilter !== 'all' ? gradeFilter : undefined,
            department: departmentFilter !== 'all' ? departmentFilter : undefined,
          }));
        })
        .catch((error) => {
          toast.error(`Failed to add student: ${error.message}`);
        });
    } else {
      // Update existing student
      const studentData = {
        Id: currentStudent.Id,
        ...mapStudent(currentStudent)
      };
      
      dispatch(updateStudentRecord(studentData))
        .then(() => {
          resetForm();
          toast.success('Student updated successfully!');
          
          // Refresh student list
          dispatch(fetchStudents({
            sortField,
            sortDirection,
            searchTerm: searchTerm || undefined,
            gradeLevel: gradeFilter !== 'all' ? gradeFilter : undefined,
            department: departmentFilter !== 'all' ? departmentFilter : undefined,
          }));
        })
        .catch((error) => {
          toast.error(`Failed to update student: ${error.message}`);
        });
    }
  };

  // Delete student
  const deleteStudent = (id) => {
    if (confirm('Are you sure you want to delete this student?')) {
      dispatch(deleteStudentRecord(id))
        .then(() => {
        toast.success('Student added successfully!');
      
        // Refresh student list
        dispatch(fetchStudents({
          sortField,
          sortDirection,
          searchTerm: searchTerm || undefined,
          gradeLevel: gradeFilter !== 'all' ? gradeFilter : undefined,
          department: departmentFilter !== 'all' ? departmentFilter : undefined,
        }));
      })
      .catch((error) => {
        toast.error(`Failed to delete student: ${error.message}`);
      });
    }
  };

    const uiStudent = convertApiToUiModel(student);
    setCurrentStudent(uiStudent);
  // Convert API student model to UI model
  const convertApiToUiModel = (apiStudent) => {
    return {
      Id: apiStudent.Id,
      id: apiStudent.Id,
      firstName: apiStudent.firstName || '',
      lastName: apiStudent.lastName || '',
      gender: apiStudent.gender || '',
      dateOfBirth: apiStudent.dateOfBirth || '',
      gradeLevel: apiStudent.gradeLevel || '',
      email: apiStudent.email || '',
      contactPhone: apiStudent.contactPhone || '',
      department: apiStudent.department || '',
    };
  };

    dispatch(setCurrentStudent(null));
  // Start adding new student
  const addNewStudent = () => {
    setCurrentStudent(newStudentTemplate);
    dispatch(setCurrentStudent(null));
    setFormErrors({});
    setIsAddingStudent(true);
    setIsEditingStudent(false);
  };

  // Start editing student
  const editStudent = (student) => {
    setCurrentStudent({ ...student });
    setFormErrors({});
    setIsEditingStudent(true);
    setIsAddingStudent(false);
  };

  // Reset form
  const resetForm = () => {
    setCurrentStudent(null);
    setFormErrors({});
    setIsAddingStudent(false);
    setIsEditingStudent(false);
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

  // Get sorted and filtered students
  const getFilteredStudents = () => {
      return dateString ? format(new Date(dateString), 'MMM d, yyyy') : '';
    let filtered = students.filter((student) => {
      console.error('Error formatting date:', error, dateString);
      const matchesSearch = 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesGrade = gradeFilter === 'all' || student.gradeLevel === gradeFilter;
      const matchesDepartment = departmentFilter === 'all' || student.department === departmentFilter;
      
      return matchesSearch && matchesGrade && matchesDepartment;
    });
    dispatch(fetchStudents({
      sortField,
      sortDirection,
      searchTerm: searchTerm || undefined,
      gradeLevel: gradeFilter !== 'all' ? gradeFilter : undefined,
      department: departmentFilter !== 'all' ? departmentFilter : undefined,
    }))
      .then(() => {
        toast.success('Student data refreshed');
      })
      .catch((error) => toast.error(`Error refreshing data: ${error.message}`));
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

  // Get filtered students
  const filteredStudents = getFilteredStudents();

  // Refresh data
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Student data refreshed');
      setIsLoading(false);
    }, 800);
  };
          > 
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addNewStudent}
      }
            disabled={isLoading || isAddingStudent || isEditingStudent}
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <UserPlusIcon className="h-5 w-5 text-primary" />
          Student Management
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
            onClick={addNewStudent}
            className="btn btn-primary btn-sm"
            disabled={isLoading || isAddingStudent || isEditingStudent}
          >
            <UserPlusIcon className="h-4 w-4" />
            <span>Add Student</span>
          </motion.button>
        </div>
      </div>

      {/* Form for adding/editing student */}
      <AnimatePresence>
        {(isAddingStudent || isEditingStudent) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-4 md:p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {isAddingStudent ? 'Add New Student' : 'Edit Student'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={currentStudent?.firstName || ''}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.firstName ? 'border-red-500 dark:border-red-500' : ''}`}
                    placeholder="Enter first name"
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={currentStudent?.lastName || ''}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.lastName ? 'border-red-500 dark:border-red-500' : ''}`}
                    placeholder="Enter last name"
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Gender*
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={currentStudent?.gender || ''}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.gender ? 'border-red-500 dark:border-red-500' : ''}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {formErrors.gender && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Date of Birth*
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={currentStudent?.dateOfBirth || ''}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.dateOfBirth ? 'border-red-500 dark:border-red-500' : ''}`}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {formErrors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.dateOfBirth}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="gradeLevel" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Grade Level*
                  </label>
                  <select
                    id="gradeLevel"
                    name="gradeLevel"
                    value={currentStudent?.gradeLevel || ''}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.gradeLevel ? 'border-red-500 dark:border-red-500' : ''}`}
                  >
                    <option value="">Select Grade</option>
                    <option value="9th">9th Grade</option>
                    <option value="10th">10th Grade</option>
                    <option value="11th">11th Grade</option>
                    <option value="12th">12th Grade</option>
                  </select>
                  {formErrors.gradeLevel && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.gradeLevel}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={currentStudent?.email || ''}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Contact Phone*
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={currentStudent?.contactPhone || ''}
                    onChange={handleFormChange}
                    className={`input-field ${formErrors.contactPhone ? 'border-red-500 dark:border-red-500' : ''}`}
                    placeholder="(555) 123-4567"
                  />
                  {formErrors.contactPhone && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.contactPhone}</p>
                  )}
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
                  onClick={saveStudent}
                  className="btn btn-primary flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <CheckIcon className="h-4 w-4 mr-1" />
                  )}
                  {isAddingStudent ? 'Add Student' : 'Save Changes'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-surface-400" />
          </div>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 input-field"
          />
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FilterIcon className="h-4 w-4 text-surface-400" />
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="pl-10 input-field"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FilterIcon className="h-4 w-4 text-surface-400" />
            </div>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="pl-10 input-field"
            >
              <option value="all">All Grades</option>
              <option value="9th">9th Grade</option>
              <option value="10th">10th Grade</option>
              <option value="11th">11th Grade</option>
              <option value="12th">12th Grade</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Students table */}
      <div className="bg-white dark:bg-surface-800 overflow-x-auto rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
        <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
          <thead className="bg-surface-50 dark:bg-surface-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700"
                onClick={() => handleSort('lastName')}
              >
                <div className="flex items-center">
                  <span>Name</span>
                  {sortField === 'lastName' && (
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
                onClick={() => handleSort('gradeLevel')}
              >
                <div className="flex items-center">
                  <span>Grade</span>
                  {sortField === 'gradeLevel' && (
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 hidden md:table-cell"
                onClick={() => handleSort('department')}>
                <div className="flex items-center">
                  <span>Department</span>
                  {sortField === 'department' && (
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 hidden md:table-cell" 
                onClick={() => handleSort('gender')}>
                <div className="flex items-center">
                  <span>Gender</span>
                  {sortField === 'gender' && (
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
                className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 hidden md:table-cell"
              >
                <div className="flex items-center">
                  <span>Date of Birth</span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  <span>Email</span>
                  {sortField === 'email' && (
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
                <td colSpan="7" className="px-6 py-10 text-center text-surface-500">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    <span className="ml-3">Loading student data...</span>
                  </div>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-surface-500">
                  {searchTerm || gradeFilter !== 'all' || departmentFilter !== 'all' ? (
                    <div>
                      <p className="text-lg font-medium mb-2">No matching students found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium mb-2">No students available</p>
                      <p className="text-sm">Add students to get started</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                component="tbody"
              >
                {filteredStudents.map((student) => (
                animate="visible"
                component="tbody"
                    variants={itemVariants}
                    className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium">
                            {student.lastName}, {student.firstName}
                          </div>
                          <div className="text-sm text-surface-500 dark:text-surface-400 md:hidden">
                            {student.gender}
                            {student.lastName || ''}, {student.firstName || ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {student.gradeLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm">{student.gender}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        {student.department}
                    </td>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm">{formatDate(student.dateOfBirth)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{student.email}</div>
                      <div className="text-xs text-surface-500 dark:text-surface-400 md:hidden">
                        {formatDate(student.dateOfBirth)}
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">{student.department}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => editStudent(student)}
                        className="text-primary hover:text-primary-dark mx-1"
                        disabled={isAddingStudent || isEditingStudent}
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteStudent(student.Id)}
                        className="text-red-500 hover:text-red-700 mx-1"
                        disabled={isAddingStudent || isEditingStudent}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </motion.div>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Info message */}
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm">
        <p>
          This student management feature lets you add, edit, and delete student records. 
          Students can be assigned to specific departments.
          Use the search bar, grade filter, and department filter to find specific students.
        </p>
      </div>
    </div>
  );
}

export default MainFeature;