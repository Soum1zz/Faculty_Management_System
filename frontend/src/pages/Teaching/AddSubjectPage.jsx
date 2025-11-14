import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This file was moved to /pages/Subjects/AddSubjectPage.jsx
// Keep a small redirect here so any old imports/routes still work.

const AddSubjectPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/subjects');
  }, [navigate]);
  return null;
};

export default AddSubjectPage;