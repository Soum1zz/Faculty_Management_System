import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';
import { isRealisticYear } from '../../utils/dateValidation';

const AwardsPage = () => {
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAwards();
    }, []);

    const fetchAwards = async () => {
        try {
            const facultyId = JSON.parse(localStorage.getItem('user')).FacultyID;
            const response = await axios.get(`/faculty/awards/${facultyId}`);
            setAwards(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching awards:', error);
            setError('Failed to fetch awards');
            setLoading(false);
        }
    };

    const handleDelete = async (awardId) => {
        if (window.confirm('Are you sure you want to delete this award?')) {
            try {
                await axios.delete(`/faculty/awards/${awardId}`);
                setAwards(awards.filter(award => award.AwardID !== awardId));
            } catch (error) {
                console.error('Error deleting award:', error);
                setError('Failed to delete award');
            }
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <BackButton to="/dashboard" />
                    <h1 className="text-2xl font-bold text-gray-800">Awards and Recognitions</h1>
                </div>
                <PrimaryButton
                    onClick={() => navigate('/awards/new')}
                    className="px-4 py-2"
                >
                    Add New Award
                </PrimaryButton>
            </div>

            {awards.length === 0 ? (
                <p className="text-gray-600 text-center">No awards found. Add your first award!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {awards.map((award) => {
                        const yearCheck = isRealisticYear(award.YearAwarded);
                        const hasDateIssue = !yearCheck.valid;

                        return (
                            <div 
                                key={award.AwardID} 
                                className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 ${
                                    hasDateIssue ? 'border-l-yellow-400' : 'border-l-transparent'
                                }`}
                            >
                                <h3 className="text-xl font-semibold mb-2">{award.AwardName}</h3>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">Awarding Body:</span> {award.AwardingBody || 'N/A'}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">Location:</span> {award.Location || 'N/A'}
                                </p>
                                <p className="text-gray-600 mb-4">
                                    <span className="font-medium">Year:</span> {award.YearAwarded}
                                </p>
                                
                                {hasDateIssue && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
                                        <p className="text-yellow-700 text-sm">⚠️ {yearCheck.error}</p>
                                    </div>
                                )}
                                
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => navigate(`/awards/edit/${award.AwardID}`)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(award.AwardID)}
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

export default AwardsPage;