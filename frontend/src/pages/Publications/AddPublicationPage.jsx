import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';
import axios from '../../utils/axios';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';
import { isRealisticDate, isRealisticYear } from '../../utils/dateValidation';

const AddPublicationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [publicationType, setPublicationType] = useState('journal');

  const [publication, setPublication] = useState({
    title: '',
    publicationYear: new Date().toISOString().split('T')[0],
    fundingAgency: '',
    typeID: '',
    typeOfIndexing: '',
    // Journal specific
    journalName: '',
    volumeNumber: '',
    issueNumber: '',
    issnNumber: '',
    // Conference specific
    publisher: '',
    conferenceLocation: '',
    pageNumbers: '',
    // Book specific
    edition: '',
    volume: '',
    isbnNumber: '',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchPublicationData();
    }
  }, [id]);

  const fetchPublicationData = async () => {
    try {
      const response = await axios.get(`/publications/${id}`);
      const data = response.data;
      setPublication({
        title: data.Title || '',
        publicationYear: data.PublicationYear ? new Date(data.PublicationYear).toISOString().split('T')[0] : '',
        fundingAgency: data.FundingAgency || '',
        typeID: data.TypeID || '',
        typeOfIndexing: data.TypeOfIndexing || '',
        journalName: data.JournalPublicationDetails?.Name || '',
        volumeNumber: data.JournalPublicationDetails?.VolumeNumber || '',
        issueNumber: data.JournalPublicationDetails?.IssueNumber || '',
        issnNumber: data.JournalPublicationDetails?.ISSN_Number || '',
        publisher: data.ConferencePaperDetails?.Publisher || data.BookPublicationDetails?.Publisher || '',
        conferenceLocation: data.ConferencePaperDetails?.Location || '',
        pageNumbers: data.ConferencePaperDetails?.PageNumbers || '',
        edition: data.BookPublicationDetails?.Edition || '',
        volume: data.BookPublicationDetails?.VolumeNumber || '',
        isbnNumber: data.BookPublicationDetails?.ISBN_Number || '',
      });
      if (data.TypeID) setPublicationType(data.TypeID);
    } catch (err) {
      setError('Failed to fetch publication data');
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPublication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!publication.title.trim()) {
      setError('Publication Title is required');
      return;
    }
    if (!publicationType) {
      setError('Publication Type is required');
      return;
    }
    if (!publication.publicationYear) {
      setError('Publication Year is required');
      return;
    }

    // Validate publication year is realistic
    const yearCheck = isRealisticYear(publication.publicationYear);
    if (!yearCheck.valid) {
      setError(yearCheck.error);
      return;
    }

    setLoading(true);

    try {
      // Transform data - send flat structure as the backend expects
      const formData = {
        title: publication.title,
        publicationYear: publication.publicationYear,
        fundingAgency: publication.fundingAgency || '',
        typeID: publicationType,
        typeOfIndexing: publication.typeOfIndexing || '',
      };

      // Add type-specific details
      if (publicationType === 'journal') {
        formData.journalName = publication.journalName;
        formData.volumeNumber = publication.volumeNumber;
        formData.issueNumber = publication.issueNumber;
        formData.issnNumber = publication.issnNumber;
      } else if (publicationType === 'conference') {
        formData.publisher = publication.publisher;
        formData.conferenceLocation = publication.conferenceLocation;
        formData.pageNumbers = publication.pageNumbers;
      } else if (publicationType === 'book') {
        formData.publisher = publication.publisher;
        formData.edition = publication.edition;
        formData.volume = publication.volume;
        formData.isbnNumber = publication.isbnNumber;
      }

      if (isEditMode) {
        await axios.put(`/publications/${id}`, formData);
      } else {
        await axios.post(`/publications`, formData);
      }
      navigate('/publications');
    } catch (error) {
      console.error('Error saving publication:', error);
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} publication`);
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
          <BackButton to="/publications" />
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Publication' : 'Add New Publication'}
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
              label="Publication Title"
              name="title"
              value={publication.title}
              onChange={handleInputChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publication Type
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={publicationType}
                onChange={(e) => setPublicationType(e.target.value)}
              >
                <option value="journal">Journal Article</option>
                <option value="conference">Conference Paper</option>
                <option value="book">Book</option>
              </select>
            </div>

            <FormInput
              type="date"
              label="Publication Year"
              name="publicationYear"
              value={publication.publicationYear}
              onChange={handleInputChange}
              required
              min="1900-01-01"
              max={new Date().toISOString().split('T')[0]}
            />

            <FormInput
              label="Funding Agency"
              name="fundingAgency"
              value={publication.fundingAgency}
              onChange={handleInputChange}
            />

            <FormInput
              label="Type of Indexing"
              name="typeOfIndexing"
              value={publication.typeOfIndexing}
              onChange={handleInputChange}
              placeholder="SCI, Scopus, Web of Science, etc."
            />

            {/* Type-specific fields */}
            {publicationType === 'journal' && (
              <>
                <FormInput
                  label="Journal Name"
                  name="journalName"
                  value={publication.journalName}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Volume Number"
                  name="volumeNumber"
                  value={publication.volumeNumber}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Issue Number"
                  name="issueNumber"
                  value={publication.issueNumber}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="ISSN Number"
                  name="issnNumber"
                  value={publication.issnNumber}
                  onChange={handleInputChange}
                />
              </>
            )}

            {publicationType === 'conference' && (
              <>
                <FormInput
                  label="Publisher"
                  name="publisher"
                  value={publication.publisher}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Location"
                  name="conferenceLocation"
                  value={publication.conferenceLocation}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Page Numbers"
                  name="pageNumbers"
                  value={publication.pageNumbers}
                  onChange={handleInputChange}
                />
              </>
            )}

            {publicationType === 'book' && (
              <>
                <FormInput
                  label="Publisher"
                  name="publisher"
                  value={publication.publisher}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Edition"
                  name="edition"
                  value={publication.edition}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Volume"
                  name="volume"
                  value={publication.volume}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="ISBN Number"
                  name="isbnNumber"
                  value={publication.isbnNumber}
                  onChange={handleInputChange}
                />
              </>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/publications')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <PrimaryButton
              type="submit"
              disabled={loading}
            >
              {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Publication' : 'Save Publication')}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPublicationPage;