import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';
import axios from '../../utils/axios';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';
import { isRealisticDate, isStartBeforeEndOrOngoing } from '../../utils/dateValidation';

const AddResearchProjectPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState('');

  const [project, setProject] = useState({
    Title: '',
    StartDate: '',
    EndDate: '',
    FundingAgency: '',
    Budget: '',
    TypeID: 'research_project', // Default type for research projects
  });

  useEffect(() => {
    if (isEditMode) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const response = await axios.get(`/faculty/research/single/${id}`);
      const data = response.data;
      setProject({
        Title: data.Title || '',
        StartDate: data.StartDate ? data.StartDate.split('T')[0] : '',
        EndDate: data.EndDate ? data.EndDate.split('T')[0] : '',
        FundingAgency: data.FundingAgency || '',
        Budget: data.Budget || '',
        TypeID: data.TypeID || 'research_project',
      });
    } catch (err) {
      setError('Failed to fetch research project data');
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate dates
    const startDateCheck = isRealisticDate(project.StartDate);
    if (!startDateCheck.valid) {
      setError(startDateCheck.error);
      setLoading(false);
      return;
    }

    const dateRangeCheck = isStartBeforeEndOrOngoing(project.StartDate, project.EndDate);
    if (!dateRangeCheck.valid) {
      setError(dateRangeCheck.error);
      setLoading(false);
      return;
    }

    try {
      const formData = {
        ...project,
        Budget: project.Budget ? parseFloat(project.Budget) : null,
        EndDate: project.EndDate || null,
      };

      if (isEditMode) {
        await axios.put(`/faculty/research/${id}`, formData);
      } else {
        await axios.post(`/faculty/research/${user.FacultyID}`, formData);
      }
      navigate('/research');
    } catch (error) {
      console.error('Error saving research project:', error);
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} research project`);
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
          <BackButton to="/research" />
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Research Project' : 'Add New Research Project'}
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
              label="Project Title"
              name="Title"
              value={project.Title}
              onChange={handleInputChange}
              required
            />

            <FormInput
              type="date"
              label="Start Date"
              name="StartDate"
              value={project.StartDate}
              onChange={handleInputChange}
              required
              max={new Date().toISOString().split('T')[0]}
            />

            <FormInput
              type="date"
              label="End Date"
              name="EndDate"
              value={project.EndDate}
              onChange={handleInputChange}
              helperText="Leave empty if project is ongoing"
              min={project.StartDate}
              max={new Date().toISOString().split('T')[0]}
            />

            <FormInput
              label="Funding Agency"
              name="FundingAgency"
              value={project.FundingAgency}
              onChange={handleInputChange}
            />

            <FormInput
              type="number"
              label="Budget (INR)"
              name="Budget"
              value={project.Budget}
              onChange={handleInputChange}
              min="0"
              step="1000"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/research')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <PrimaryButton
              type="submit"
              disabled={loading}
            >
              {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Project' : 'Save Project')}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResearchProjectPage;