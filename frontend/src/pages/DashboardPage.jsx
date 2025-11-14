import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';
import axios from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner';

// Helper function to check if a date is in the future
const isDateInFuture = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

// Helper function to validate date range
const hasInvalidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end < start;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateWarnings, setDateWarnings] = useState({});

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`/dashboard/dashboard-stats/${user?.FacultyID}`);
        setStats(response.data);
        
        // Check for invalid dates in the data
        checkForInvalidDates(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.FacultyID) {
      fetchDashboardStats();
    }
  }, [user]);

  // Function to check for invalid dates in dashboard data
  const checkForInvalidDates = (data) => {
    const warnings = {};
    
    // Check research projects
    if (data?.researchProjects && Array.isArray(data.researchProjects)) {
      const invalidProjects = data.researchProjects.filter(project => {
        if (project.StartDate && isDateInFuture(project.StartDate)) return true;
        if (project.EndDate && isDateInFuture(project.EndDate)) return true;
        if (hasInvalidDateRange(project.StartDate, project.EndDate)) return true;
        return false;
      });
      if (invalidProjects.length > 0) {
        warnings.researchProjects = `${invalidProjects.length} research project(s) have future or invalid dates`;
      }
    }
    
    // Check events
    if (data?.events && Array.isArray(data.events)) {
      const invalidEvents = data.events.filter(event => {
        if (event.StartDate && isDateInFuture(event.StartDate)) return true;
        if (event.EndDate && isDateInFuture(event.EndDate)) return true;
        if (hasInvalidDateRange(event.StartDate, event.EndDate)) return true;
        return false;
      });
      if (invalidEvents.length > 0) {
        warnings.events = `${invalidEvents.length} event(s) have future or invalid dates`;
      }
    }
    
    // Check teaching experience
    if (data?.teachingExperience && Array.isArray(data.teachingExperience)) {
      const invalidTeaching = data.teachingExperience.filter(exp => {
        if (exp.StartDate && isDateInFuture(exp.StartDate)) return true;
        if (exp.EndDate && isDateInFuture(exp.EndDate)) return true;
        if (hasInvalidDateRange(exp.StartDate, exp.EndDate)) return true;
        return false;
      });
      if (invalidTeaching.length > 0) {
        warnings.teachingExperience = `${invalidTeaching.length} teaching record(s) have future or invalid dates`;
      }
    }
    
    // Check outreach activities
    if (data?.outreachActivities && Array.isArray(data.outreachActivities)) {
      const invalidActivities = data.outreachActivities.filter(activity => {
        if (activity.ActivityDate && isDateInFuture(activity.ActivityDate)) return true;
        return false;
      });
      if (invalidActivities.length > 0) {
        warnings.outreachActivities = `${invalidActivities.length} outreach activity(ies) have future dates`;
      }
    }
    
    setDateWarnings(warnings);
  };

  // Redirect admins to admin dashboard
  if (user?.Role === 'Admin') {
    return <Navigate to="/admin" replace />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Faculty Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome, {user?.FirstName}</p>
        </div>
      </div>

      {/* Date Warnings */}
      {Object.keys(dateWarnings).length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">
                Data Validation Issues Found
              </p>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                {Object.entries(dateWarnings).map(([key, message]) => (
                  <li key={key}>{message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Overview Stats - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard
          title="Publications"
          count={stats?.counts?.publications || 0}
          link="/publications"
          addLink="/publications/new"
        />
        <StatCard
          title="Research Projects"
          count={stats?.counts?.researchProjects || 0}
          link="/research"
          addLink="/research/new"
        />
        <StatCard
          title="Patents"
          count={stats?.counts?.patents || 0}
          link="/patents"
          addLink="/patents/new"
        />
        <StatCard
          title="Awards"
          count={stats?.counts?.awards || 0}
          link="/awards"
          addLink="/awards/new"
        />
      </div>

      {/* Overview Stats - Second Row */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Events"
          count={stats?.counts?.events || 0}
          link="/events"
          addLink="/events/new"
        />
        <StatCard
          title="Outreach Activities"
          count={stats?.counts?.outreachActivities || 0}
          link="/outreach"
          addLink="/outreach/new"
        />
        <StatCard
          title="Teaching Experience (yrs)"
          // count={stats?.experience?.teachingYears || 0}
          link="/teaching"
          addLink="/teaching/new"
        />
        <StatCard
          title="Subjects Taught"
          count={stats?.counts?.subjectsTaught || 0}
          link="/subjects"
          addLink="/subjects/new"
        />
        <StatCard
          title="Qualifications"
          count={stats?.counts?.qualifications || 0}
          link="/qualifications"
          addLink="/qualifications/new"
        />
      </div>

      {/* Citation Metrics */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Citation Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">h-index</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.citations?.hIndex || 0}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, count, link, addLink }) => (
  <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <div className="flex items-center justify-between mt-2">
      <p className="text-4xl font-bold text-gray-900">{count}</p>
    </div>
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
      <Link 
        to={link} 
        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
      >
        View All →
      </Link>
      <Link 
        to={addLink} 
        className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
      >
        + Add
      </Link>
    </div>
  </div>
);

export default DashboardPage;