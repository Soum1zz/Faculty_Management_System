import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';
import axios from '../../utils/axios';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';
import { isRealisticDate, isStartBeforeEndOrOngoing } from '../../utils/dateValidation';

const AddTeachingExperiencePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState('');

  const [experience, setExperience] = useState({
    OrganizationName: '',
    Designation: '',
    StartDate: '',
    EndDate: '',
    NatureOfWork: ''
  });

  useEffect(() => {
    if (isEditMode) {
      fetchTeachingData();
    }
  }, [id]);

  const fetchTeachingData = async () => {
    try {
      const response = await axios.get(`/faculty/teaching/single/${id}`);
      const data = response.data;
      setExperience({
        OrganizationName: data.OrganizationName || '',
        Designation: data.Designation || '',
        StartDate: data.StartDate ? data.StartDate.split('T')[0] : '',
        EndDate: data.EndDate ? data.EndDate.split('T')[0] : '',
        NatureOfWork: data.NatureOfWork || ''
      });
    } catch (err) {
      setError('Failed to fetch teaching experience data');
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExperience(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate dates
    const startDateCheck = isRealisticDate(experience.StartDate);
    if (!startDateCheck.valid) {
      setError(startDateCheck.error);
      setLoading(false);
      return;
    }

    const dateRangeCheck = isStartBeforeEndOrOngoing(experience.StartDate, experience.EndDate);
    if (!dateRangeCheck.valid) {
      setError(dateRangeCheck.error);
      setLoading(false);
      return;
    }

    try {
      const formData = {
        ...experience,
        EndDate: experience.EndDate || null,
      };

      if (isEditMode) {
        await axios.put(`/faculty/teaching/${id}`, formData);
      } else {
        await axios.post(`/faculty/teaching/${user.FacultyID}`, formData);
      }
      navigate('/teaching');
    } catch (error) {
      console.error('Error saving teaching experience:', error);
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} teaching experience`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <BackButton to="/teaching" />
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Teaching Experience' : 'Add Teaching Experience'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <FormInput
              label="Organization Name"
              name="OrganizationName"
              value={experience.OrganizationName}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Designation"
              name="Designation"
              value={experience.Designation}
              onChange={handleInputChange}
              required
            />

            <FormInput
              type="date"
              label="Start Date"
              name="StartDate"
              value={experience.StartDate}
              onChange={handleInputChange}
              required
              max={new Date().toISOString().split('T')[0]}
            />

            <FormInput
              type="date"
              label="End Date"
              name="EndDate"
              value={experience.EndDate}
              onChange={handleInputChange}
              helperText="Leave empty if this is your current position"
              min={experience.StartDate}
              max={new Date().toISOString().split('T')[0]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nature of Work
              </label>
              <textarea
                name="NatureOfWork"
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe your responsibilities and achievements..."
                value={experience.NatureOfWork}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/teaching')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <PrimaryButton
              type="submit"
              disabled={loading}
            >
              {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Experience' : 'Save Experience')}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeachingExperiencePage;