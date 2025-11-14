import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();


  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Faculty Research Portal
        </h1>
        <p className="text-lg text-gray-600">
          Manage and explore faculty information with ease
        </p>
      </div>
      
      {/* Main Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div 
          className="p-10 transition-transform duration-300 hover:scale-105" 
          style={{
            backgroundColor: '#4f46e5', 
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <h3 className="text-2xl font-bold mb-4 text-white">Update Records</h3>
          <p className="mb-8 text-base leading-relaxed" style={{color: '#e0e7ff'}}>
            Add, edit, or modify faculty information and records in the system.
          </p>
          <button 
            onClick={() => navigate(user ? '/dashboard' : '/login')} 
            className="px-8 py-3 font-semibold transition-all duration-200"
            style={{
              backgroundColor: '#ffffff', 
              color: '#4f46e5', 
              borderRadius: '8px',
              border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f9fafb';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {user ? 'Go to Dashboard' : 'Login to Update'}
          </button>
        </div>
        
        <div 
          className="p-10 transition-transform duration-300 hover:scale-105" 
          style={{
            backgroundColor: '#2563eb', 
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <h3 className="text-2xl font-bold mb-4 text-white">View Faculty</h3>
          <p className="mb-8 text-base leading-relaxed" style={{color: '#dbeafe'}}>
            Search, browse, and view faculty profiles and information.
          </p>
          <button 
            type="button"
            onClick={() => navigate('/retrieve')} 
            className="px-8 py-3 font-semibold transition-all duration-200"
            style={{
              backgroundColor: '#ffffff', 
              color: '#2563eb', 
              borderRadius: '8px',
              border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f9fafb';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Browse Faculty
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div 
          className="p-6 transition-all duration-200 hover:translate-y-[-4px]" 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <h4 className="font-bold text-gray-900 mb-2 text-lg">Fast & Efficient</h4>
          <p className="text-gray-600 text-sm leading-relaxed">Quick access to all management features</p>
        </div>
        <div 
          className="p-6 transition-all duration-200 hover:translate-y-[-4px]" 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <h4 className="font-bold text-gray-900 mb-2 text-lg">Secure Access</h4>
          <p className="text-gray-600 text-sm leading-relaxed">Protected authentication system</p>
        </div>
        <div 
          className="p-6 transition-all duration-200 hover:translate-y-[-4px]" 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <h4 className="font-bold text-gray-900 mb-2 text-lg">Comprehensive Data</h4>
          <p className="text-gray-600 text-sm leading-relaxed">Complete faculty information overview</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;