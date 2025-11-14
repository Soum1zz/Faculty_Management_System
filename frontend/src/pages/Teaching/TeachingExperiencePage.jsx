import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../store/auth.store';
import LoadingSpinner from '../../components/LoadingSpinner';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';
import { getDateIssues } from '../../utils/dateChecks';

const TeachingExperiencePage = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get(`/faculty/teaching/${user?.FacultyID}`);
        setExperiences(response.data);
      } catch (error) {
        console.error('Error fetching teaching experiences:', error);
        setError('Failed to load teaching experiences');
      } finally {
        setLoading(false);
      }
    };

    if (user?.FacultyID) {
      fetchExperiences();
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <BackButton to="/dashboard" />
          <h1 className="text-2xl font-bold">Teaching Experience</h1>
        </div>
        <Link to="/teaching/experience/new">
          <PrimaryButton>Add Teaching Experience</PrimaryButton>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {experiences.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No teaching experience records found</p>
          <Link to="/teaching/experience/new" className="text-blue-500 hover:underline mt-2 inline-block">
            Add your first teaching experience
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.ExperienceID} experience={experience} />
          ))}
        </div>
      )}
    </div>
  );
};

const ExperienceCard = ({ experience }) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  // Check for date validation issues
  const { hasIssue, issues } = getDateIssues(experience, { 
    start: 'StartDate', 
    end: 'EndDate' 
  });

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${hasIssue ? 'border-l-4 border-yellow-400' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{experience.Designation}</h3>
            {hasIssue && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                ⚠️ Date Issue
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">{experience.OrganizationName}</p>
          <div className="mt-4 space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Duration:</span> {formatDate(experience.StartDate)} to {formatDate(experience.EndDate)}
            </p>
            {hasIssue && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-yellow-800">
                {issues.map((issue, idx) => (
                  <p key={idx}>⚠️ {issue}</p>
                ))}
              </div>
            )}
            {experience.NatureOfWork && (
              <p className="text-gray-600">
                <span className="font-medium">Nature of Work:</span> {experience.NatureOfWork}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link
            to={`/teaching/experience/edit/${experience.ExperienceID}`}
            className="text-blue-500 hover:text-blue-600"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeachingExperiencePage;