import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';
import { getDateIssues } from '../../utils/dateChecks';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const facultyId = JSON.parse(localStorage.getItem('user')).FacultyID;
            const response = await axios.get(`/faculty/events/${facultyId}`);
            setEvents(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch events');
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await axios.delete(`/faculty/events/${eventId}`);
                setEvents(events.filter(event => event.EventOrganisedID !== eventId));
            } catch (err) {
                setError('Failed to delete event');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getEventTypeLabel = (eventType) => {
        return eventType.EventType.toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'Speaker':
                return 'bg-blue-100 text-blue-800';
            case 'Organizer':
                return 'bg-green-100 text-green-800';
            case 'Attendee':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <BackButton to="/dashboard" />
                    <h1 className="text-2xl font-bold text-gray-800">Events</h1>
                </div>
                <PrimaryButton
                    onClick={() => navigate('/events/new')}
                    className="px-4 py-2"
                >
                    Add New Event
                </PrimaryButton>
            </div>

            {events.length === 0 ? (
                <p className="text-gray-600 text-center">No events found. Add your first event!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => {
                        // Check for date validation issues
                        const { hasIssue: hasDateIssue, issues } = getDateIssues(event, { 
                          start: 'StartDate', 
                          end: 'EndDate' 
                        });

                        return (
                            <div key={event.EventOrganisedID} className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow ${hasDateIssue ? 'border-l-4 border-yellow-400' : ''}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-semibold">{event.Title}</h3>
                                            {hasDateIssue && (
                                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                                                    ⚠️ Date Issue
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(event.Role)}`}>
                                        {event.Role}
                                    </span>
                                </div>
                                
                                <p className="text-gray-600 mb-2">
                                    <span className="font-medium">Type:</span> {getEventTypeLabel(event.Event)}
                                </p>
                                
                                {event.Organizer && (
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Organizer:</span> {event.Organizer}
                                    </p>
                                )}
                                
                                {event.Location && (
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Location:</span> {event.Location}
                                    </p>
                                )}
                                
                                <p className="text-gray-600 mb-2">
                                    <span className="font-medium">Start Date:</span> {formatDate(event.StartDate)}
                                </p>
                                
                                {event.EndDate && (
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">End Date:</span> {formatDate(event.EndDate)}
                                    </p>
                                )}

                                {hasDateIssue && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-yellow-800 mb-4">
                                        {issues.map((issue, idx) => (
                                          <p key={idx}>⚠️ {issue}</p>
                                        ))}
                                    </div>
                                )}
                                
                                {event.FundingAgency && (
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Funding Agency:</span> {event.FundingAgency}
                                    </p>
                                )}
                                
                                {event.Description && (
                                    <p className="text-gray-600 mb-4">
                                        <span className="font-medium">Description:</span><br />
                                        {event.Description}
                                    </p>
                                )}
                                
                                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                                    <button
                                        onClick={() => navigate(`/events/edit/${event.EventOrganisedID}`)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.EventOrganisedID)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EventsPage;