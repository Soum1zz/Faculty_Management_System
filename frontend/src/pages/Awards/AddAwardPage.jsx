import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import FormContainer from '../../components/FormContainer';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';
import { isRealisticYear } from '../../utils/dateValidation';

const AddAwardPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    
    const [formData, setFormData] = useState({
        awardName: '',
        awardingBody: '',
        location: '',
        yearAwarded: new Date().getFullYear()
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEditMode);

    useEffect(() => {
        if (isEditMode) {
            fetchAwardData();
        }
    }, [id]);

    const fetchAwardData = async () => {
        try {
            const response = await axios.get(`/faculty/awards/single/${id}`);
            setFormData({
                awardName: response.data.AwardName || '',
                awardingBody: response.data.AwardingBody || '',
                location: response.data.Location || '',
                yearAwarded: response.data.YearAwarded || new Date().getFullYear()
            });
        } catch (err) {
            setError('Failed to fetch award data');
            console.error(err);
        } finally {
            setFetchLoading(false);
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

        // Validate year is not in future
        const yearCheck = isRealisticYear(formData.yearAwarded);
        if (!yearCheck.valid) {
            setError(yearCheck.error);
            setLoading(false);
            return;
        }

        try {
            const facultyId = JSON.parse(localStorage.getItem('user')).FacultyID;
            
            if (isEditMode) {
                await axios.put(`/faculty/awards/${id}`, {
                    ...formData,
                    facultyId
                });
            } else {
                await axios.post('/faculty/awards', {
                    ...formData,
                    facultyId
                });
            }
            navigate('/awards');
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} award`);
        } finally {
            setLoading(false);
        }
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
                <BackButton to="/awards" />
                <h2 className="text-2xl font-bold">
                    {isEditMode ? 'Edit Award' : 'Add New Award'}
                </h2>
            </div>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="Award Name"
                    name="awardName"
                    type="text"
                    value={formData.awardName}
                    onChange={handleChange}
                    required
                />

                <FormInput
                    label="Awarding Body"
                    name="awardingBody"
                    type="text"
                    value={formData.awardingBody}
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
                    label="Year Awarded"
                    name="yearAwarded"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.yearAwarded}
                    onChange={handleChange}
                    required
                />

                <div className="flex justify-between pt-4">
                    <PrimaryButton
                        type="button"
                        onClick={() => navigate('/awards')}
                        className="bg-gray-500 hover:bg-gray-600"
                    >
                        Cancel
                    </PrimaryButton>
                    <PrimaryButton
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Award' : 'Add Award')}
                    </PrimaryButton>
                </div>
            </form>
        </FormContainer>
    );
};

export default AddAwardPage;