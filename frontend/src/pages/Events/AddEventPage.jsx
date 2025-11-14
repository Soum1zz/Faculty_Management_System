import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import FormContainer from '../../components/FormContainer';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';
import { isRealisticDate, isStartBeforeEndOrOngoing } from '../../utils/dateValidation';

const AddEventPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [eventTypes, setEventTypes] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        eventTypeId: '',
        organizer: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        role: '',
        fundingAgency: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEditMode);

    useEffect(() => {
        fetchEventTypes();
        if (isEditMode) {
            fetchEventData();
        }
    }, [id]);

    const fetchEventData = async () => {
        try {
            const response = await axios.get(`/faculty/events/single/${id}`);
            const data = response.data;
            setFormData({
                title: data.Title || '',
                eventTypeId: data.EventTypeID || '',
                organizer: data.Organizer || '',
                location: data.Location || '',
                startDate: data.StartDate ? data.StartDate.split('T')[0] : '',
                endDate: data.EndDate ? data.EndDate.split('T')[0] : '',
                description: data.Description || '',
                role: data.Role || '',
                fundingAgency: data.FundingAgency || ''
            });
        } catch (err) {
            setError('Failed to fetch event data');
            console.error(err);
        } finally {
            setFetchLoading(false);
        }
    };

    const fetchEventTypes = async () => {
        try {
            const response = await axios.get('/faculty/events/types');
            setEventTypes(response.data);
        } catch (err) {
            setError('Failed to fetch event types');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate dates
        const startDateCheck = isRealisticDate(formData.startDate);
        if (!startDateCheck.valid) {
            setError(startDateCheck.error);
            setLoading(false);
            return;
        }

        const dateRangeCheck = isStartBeforeEndOrOngoing(formData.startDate, formData.endDate);
        if (!dateRangeCheck.valid) {
            setError(dateRangeCheck.error);
            setLoading(false);
            return;
        }

        try {
            const facultyId = JSON.parse(localStorage.getItem('user')).FacultyID;
            if (isEditMode) {
                await axios.put(`/faculty/events/${id}`, {
                    ...formData,
                    facultyId
                });
            } else {
                await axios.post('/faculty/events', {
                    ...formData,
                    facultyId
                });
            }
            navigate('/events');
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} event`);
        } finally {
            setLoading(false);
        }
    };

    const getEventTypeLabel = (eventType) => {
        return eventType.toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    if (fetchLoading) {
        return (
            <FormContainer>
                <div className="text-center">Loading...</div>
            </FormContainer>
        );
    }

    return (
        <FormContainer>
            <div className="flex items-center space-x-4 mb-6">
                <BackButton to="/events" />
                <h2 className="text-2xl font-bold">
                    {isEditMode ? 'Edit Event' : 'Add New Event'}
                </h2>
            </div>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="Event Title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Event Type
                    </label>
                    <select
                        name="eventTypeId"
                        value={formData.eventTypeId}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select Event Type</option>
                        {eventTypes.map(type => (
                            <option key={type.EventID} value={type.EventID}>
                                {getEventTypeLabel(type.EventType)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Your Role
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select Your Role</option>
                        <option value="Speaker">Speaker</option>
                        <option value="Organizer">Organizer</option>
                        <option value="Attendee">Attendee</option>
                    </select>
                </div>

                <FormInput
                    label="Organizer"
                    name="organizer"
                    type="text"
                    value={formData.organizer}
                    onChange={handleChange}
                />

                <FormInput
                    label="Location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                />

                <FormInput
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                />

                <FormInput
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate}
                    max={new Date().toISOString().split('T')[0]}
                />

                <FormInput
                    label="Funding Agency"
                    name="fundingAgency"
                    type="text"
                    value={formData.fundingAgency}
                    onChange={handleChange}
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Provide details about the event..."
                    />
                </div>

                <div className="flex justify-between pt-4">
                    <PrimaryButton
                        type="button"
                        onClick={() => navigate('/events')}
                        className="bg-gray-500 hover:bg-gray-600"
                    >
                        Cancel
                    </PrimaryButton>
                    <PrimaryButton
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Event' : 'Add Event')}
                    </PrimaryButton>
                </div>
            </form>
        </FormContainer>
    );
};

export default AddEventPage;