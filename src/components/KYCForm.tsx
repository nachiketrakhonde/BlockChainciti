import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const KYCForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    address: '',
    documentType: 'passport',
    documentNumber: '',
    documentFront: null as File | null,
    documentBack: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });
    }
  };

  const uploadDocument = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}_${Date.now()}.${fileExt}`;
    const filePath = `${user!.id}/${fileName}`;

    console.log('Uploading file:', fileName, 'Size:', file.size);

    const { data, error } = await supabase.storage
      .from('kyc-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('File upload error:', error);
      throw error;
    }

    console.log('File uploaded successfully:', data.path);
    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to submit KYC verification');
      return;
    }

    setLoading(true);
    console.log('Starting KYC submission for user:', user.id);

    try {
      let frontUrl = '';
      let backUrl = '';

      // Upload documents first
      if (formData.documentFront) {
        console.log('Uploading front document...');
        frontUrl = await uploadDocument(formData.documentFront, 'front');
        console.log('Front document uploaded:', frontUrl);
      }

      if (formData.documentBack) {
        console.log('Uploading back document...');
        backUrl = await uploadDocument(formData.documentBack, 'back');
        console.log('Back document uploaded:', backUrl);
      }

      // Insert KYC data
      console.log('Inserting KYC data into database...');
      const { data, error } = await supabase.from('kyc_verifications').insert({
        user_id: user.id,
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        document_type: formData.documentType,
        document_number: formData.documentNumber,
        document_front_url: frontUrl,
        document_back_url: backUrl,
        status: 'pending',
        created_at: new Date().toISOString()
      });

      console.log('Database insert result:', { data, error });

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log('KYC submission successful');
      toast.success('KYC verification submitted successfully!');
      
      // Reset form after successful submission
      setFormData({
        fullName: '',
        dateOfBirth: '',
        address: '',
        documentType: 'passport',
        documentNumber: '',
        documentFront: null,
        documentBack: null,
      });

      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      fileInputs.forEach(input => input.value = '');

    } catch (error: any) {
      console.error('KYC submission error:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('storage')) {
        toast.error('Failed to upload documents. Please check file size and format.');
      } else if (error.message?.includes('duplicate')) {
        toast.error('KYC verification already exists for this user.');
      } else if (error.message?.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(`Failed to submit KYC verification: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">KYC Verification</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Type *
          </label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="passport">Passport</option>
            <option value="national_id">National ID</option>
            <option value="drivers_license">Driver's License</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Number *
          </label>
          <input
            type="text"
            name="documentNumber"
            value={formData.documentNumber}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Front * <span className="text-xs text-gray-500">(Max 5MB, JPG/PNG)</span>
          </label>
          <input
            type="file"
            name="documentFront"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/jpg"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
          {formData.documentFront && (
            <p className="text-sm text-green-600 mt-1">
              Selected: {formData.documentFront.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Back * <span className="text-xs text-gray-500">(Max 5MB, JPG/PNG)</span>
          </label>
          <input
            type="file"
            name="documentBack"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/jpg"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
          {formData.documentBack && (
            <p className="text-sm text-green-600 mt-1">
              Selected: {formData.documentBack.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit KYC Verification'}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p>* Required fields</p>
        <p>Your information will be securely processed and used only for verification purposes.</p>
      </div>
    </div>
  );
};

export default KYCForm;