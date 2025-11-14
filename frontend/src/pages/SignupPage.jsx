import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import FormContainer from '../components/FormContainer';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

const initial = {
  firstName: '', lastName: '', gender: '', dob: '',
  phone_no: '', email: '', role: '', departmentName: '', password: ''
};

const genderOpts = [
  {value:'Male',label:'Male'}, 
  {value:'Female',label:'Female'}, 
  {value:'Other',label:'Other'}
];

const roleOpts = [
  {value:'Professor',label:'Professor'},
  {value:'Associate Professor',label:'Associate Professor'},
  {value:'Assistant Professor',label:'Assistant Professor'},
  {value:'Lecturer',label:'Lecturer'},
  {value:'Admin',label:'Admin'}
];

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/auth/departments');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched departments:', data);
          setDepartments(data);
        } else {
          console.error('Failed to fetch departments:', response.status);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    
    // Phone number validation: only allow digits and max 10 characters
    if (name === 'phone_no') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setForm({ ...form, [name]: digitsOnly });
      }
      setErrors({ ...errors, [name]: '' });
      return;
    }
    
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName) errs.firstName = 'First Name is required.';
    if (!form.lastName) errs.lastName = 'Last Name is required.';
    if (!form.email) errs.email = 'Email is required.';
    if (!form.password) errs.password = 'Password is required.';
    if (!form.role) errs.role = 'Role is required.';
    
    // Department is only required for non-admin roles
    if (form.role !== 'Admin' && !form.departmentName) {
      errs.departmentName = 'Department is required for Faculty role.';
    }
    
    if (!form.dob) {
      errs.dob = 'Date of Birth is required.';
    } else {
      const selectedDate = new Date(form.dob);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        errs.dob = 'Date of Birth cannot be in the future.';
      } else {
        // Calculate age
        let age = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
          age--;
        }
        if (age < 18) {
          errs.dob = 'You must be at least 18 years old to register.';
        }
      }
    }
    if (!form.gender) errs.gender = 'Gender is required.';
    
    // Phone number validation - only if provided
    if (form.phone_no && form.phone_no.length > 0 && form.phone_no.length !== 10) {
      errs.phone_no = 'Phone number must be exactly 10 digits.';
    }
    
    if (form.password && form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format.';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('Form submitted with data:', form);
    
    const errs = validate();
    if (Object.keys(errs).length) {
      console.log('Validation errors:', errs);
      setErrors(errs);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Prepare signup data
      const signupData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        gender: form.gender,
        dob: form.dob,
        role: form.role,
        phone_no: form.phone_no || ''
      };
      
      // Only include departmentName for non-Admin roles
      if (form.role !== 'Admin') {
        signupData.departmentName = form.departmentName;
      }
      
      console.log('Sending signup data:', signupData);
      const response = await authAPI.signup(signupData);
      console.log('Signup response:', response);

      // Show approval pending message
      alert(response.message || 'Registration successful! Please wait for admin approval before logging in.');
      
      // Clear form and redirect to login
      setForm(initial);
      navigate('/login');
      
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create account. Please try again.';
      
      // Check if it's an email already exists error
      if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('already exists') || errorMessage.toLowerCase().includes('unique')) {
        setErrors({ email: errorMessage });
      } else {
        setErrors({ submit: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Create a New Account" navigate={navigate}>
      <form onSubmit={handleSubmit} className="form-grid">
        <FormInput 
          label="First Name" 
          type="text" 
          name="firstName" 
          value={form.firstName} 
          onChange={handleChange} 
          error={errors.firstName} 
        />
        <FormInput 
          label="Last Name" 
          type="text" 
          name="lastName" 
          value={form.lastName} 
          onChange={handleChange} 
          error={errors.lastName} 
        />
        <FormInput 
          label="Gender" 
          type="select" 
          name="gender" 
          value={form.gender} 
          onChange={handleChange} 
          error={errors.gender} 
          options={genderOpts} 
        />
        <FormInput 
          label="Date of Birth" 
          type="date" 
          name="dob" 
          value={form.dob} 
          onChange={handleChange} 
          error={errors.dob}
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
        />
        
        {/* Phone Number with character counter */}
        <div className="mb-4">
          <label htmlFor="phone_no" className="block text-sm font-medium text-gray-700 mb-2">
            Phone No. (10 digits)
          </label>
          <input
            id="phone_no"
            type="tel"
            name="phone_no"
            value={form.phone_no}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.phone_no ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="1234567890"
            maxLength="10"
          />
          {errors.phone_no ? (
            <p className="text-sm text-red-600 mt-1">{errors.phone_no}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number</p>
          )}
        </div>
        
        <FormInput 
          label="Email Address" 
          type="email" 
          name="email" 
          value={form.email} 
          onChange={handleChange} 
          error={errors.email} 
        />
        <FormInput 
          label="Role" 
          type="select" 
          name="role" 
          value={form.role} 
          onChange={handleChange} 
          error={errors.role} 
          options={roleOpts} 
        />
        
        {/* Department field - only show for non-Admin roles */}
        {form.role && form.role !== 'Admin' && (
          <FormInput 
            label="Department" 
            type="text" 
            name="departmentName" 
            value={form.departmentName} 
            onChange={handleChange} 
            error={errors.departmentName}
          />
        )}
        
        <div className="form-full-width">
          <FormInput 
            label="Password" 
            type="password" 
            name="password" 
            value={form.password} 
            onChange={handleChange} 
            error={errors.password} 
          />
        </div>
        {errors.submit && (
          <div className="form-full-width">
            <div className="error-message" style={{ textAlign: 'center' }}>
              {errors.submit}
            </div>
          </div>
        )}
        <div className="form-full-width">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Complete Registration'}
          </PrimaryButton>
        </div>
      </form>
    </FormContainer>
  );
};

export default SignupPage;