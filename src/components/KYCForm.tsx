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

  const uploadDocument = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('kyc-documents')
      .upload(`${user!.id}/${path}`, file);

    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let frontUrl = '';
      let backUrl = '';

      if (formData.documentFront) {
        frontUrl = await uploadDocument(formData.documentFront, 'front');
      }
      if (formData.documentBack) {
        backUrl = await uploadDocument(formData.documentBack, 'back');
      }

      const { error } = await supabase.from('kyc_verifications').insert({
        user_id: user.id,
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        document_type: formData.documentType,
        document_number: formData.documentNumber,
        document_front_url: frontUrl,
        document_back_url: backUrl,
      });

      if (error) throw error;
      toast.success('KYC verification submitted successfully');
    } catch (error) {
      toast.error('Failed to submit KYC verification');
      console.error(error);
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
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Type
          </label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="passport">Passport</option>
            <option value="national_id">National ID</option>
            <option value="drivers_license">Driver's License</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Number
          </label>
          <input
            type="text"
            name="documentNumber"
            value={formData.documentNumber}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Front
          </label>
          <input
            type="file"
            name="documentFront"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Back
          </label>
          <input
            type="file"
            name="documentBack"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-all hover:shadow-lg disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit KYC Verification'}
        </button>
      </form>
    </div>
  );
};

export default KYCForm;