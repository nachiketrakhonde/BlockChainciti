import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Web3 from 'web3';
import toast from 'react-hot-toast';

interface Wallet {
  id: string;
  wallet_address: string;
  currency: string;
}

const PaymentForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [formData, setFormData] = useState({
    receiverEmail: '',
    amount: '',
    currency: 'ETH',
  });

  useEffect(() => {
    if (user) {
      loadWallets();
    }
  }, [user]);

  const loadWallets = async () => {
    try {
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('user_id', user!.id);

      if (error) throw error;
      setWallets(data || []);
    } catch (error) {
      console.error('Error loading wallets:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Get receiver's profile
      const { data: receiverData, error: receiverError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.receiverEmail)
        .single();

      if (receiverError) throw new Error('Receiver not found');

      // Create transaction record
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          sender_id: user.id,
          receiver_id: receiverData.id,
          amount: formData.amount,
          currency: formData.currency,
          status: 'pending',
        });

      if (txError) throw txError;

      // In a real application, you would integrate with a blockchain network here
      // For demo purposes, we'll simulate a successful transaction
      setTimeout(() => {
        toast.success('Payment processed successfully');
        setLoading(false);
      }, 2000);

    } catch (error) {
      toast.error('Failed to process payment');
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Payment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Email
          </label>
          <input
            type="email"
            name="receiverEmail"
            value={formData.receiverEmail}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            step="0.000001"
            min="0"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="ETH">Ethereum (ETH)</option>
            <option value="USDT">Tether (USDT)</option>
            <option value="USDC">USD Coin (USDC)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-all hover:shadow-lg disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Send Payment'}
        </button>
      </form>

      {wallets.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Wallets</h3>
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Address: {wallet.wallet_address}</p>
                <p className="text-sm text-gray-600">Currency: {wallet.currency}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;