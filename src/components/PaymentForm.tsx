import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Web3 from 'web3';
import toast from 'react-hot-toast';

interface Wallet {
  id: string;
  wallet_address: string;
  currency: string;
  balance?: string;
}

interface Transaction {
  id: string;
  sender_id: string;
  receiver_id: string;
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  transaction_hash?: string;
  created_at: string;
}

const PaymentForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [formData, setFormData] = useState({
    receiverEmail: '',
    amount: '',
    currency: 'ETH',
    selectedWallet: '',
  });

  useEffect(() => {
    if (user) {
      loadWallets();
      loadTransactions();
    }
    initializeWeb3();
  }, [user]);

  const initializeWeb3 = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const web3Instance = new Web3((window as any).ethereum);
        setWeb3(web3Instance);
      } catch (error) {
        console.error('Error initializing Web3:', error);
      }
    } else {
      console.warn('MetaMask not detected');
    }
  };

  const loadWallets = async () => {
    try {
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('user_id', user?.id || '');

      if (error) throw error;
      setWallets(data || []);
    } catch (error) {
      console.error('Error loading wallets:', error);
      toast.error('Failed to load wallets');
    }
  };

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = (): boolean => {
    if (!formData.receiverEmail.trim()) {
      toast.error('Please enter recipient email');
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return false;
    }
    if (!formData.currency) {
      toast.error('Please select a currency');
      return false;
    }
    return true;
  };

  const findReceiverByEmail = async (email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (error || !data) {
      throw new Error('Recipient not found. Please check the email address.');
    }

    return data;
  };

  const createTransactionRecord = async (receiverId: string, transactionHash?: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        sender_id: user?.id,
        receiver_id: receiverId,
        amount: formData.amount,
        currency: formData.currency,
        status: transactionHash ? 'completed' : 'pending',
        transaction_hash: transactionHash,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateTransactionStatus = async (transactionId: string, status?: string, txHash?: string) => {
    const updateFields: { [key: string]: any } = {};
    if (status) updateFields.status = status;
    if (txHash) updateFields.transaction_hash = txHash;
    updateFields.updated_at = new Date().toISOString();

    if (Object.keys(updateFields).length === 1) return; // Only updated_at was added

    const { error } = await supabase
      .from('transactions')
      .update(updateFields)
      .eq('id', transactionId);

    if (error) throw error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to send payments');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    let transactionRecord: Transaction | null = null;

    try {
      const receiver = await findReceiverByEmail(formData.receiverEmail);
      transactionRecord = await createTransactionRecord(receiver.id);

      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulated delay

      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
        if (transactionRecord) {
          await updateTransactionStatus(transactionRecord.id, 'completed', mockTxHash);
        }

        toast.success(`Payment of ${formData.amount} ${formData.currency} sent successfully!`);
        setFormData({
          receiverEmail: '',
          amount: '',
          currency: 'ETH',
          selectedWallet: '',
        });
        await loadTransactions(); // Reload transactions after successful payment
      } else {
        if (transactionRecord) {
          await updateTransactionStatus(transactionRecord.id, 'failed');
        }
        throw new Error('Transaction failed due to network issues');
      }

    } catch (error: any) {
      console.error('Payment processing error:', error);
      if (transactionRecord) {
        try {
          await updateTransactionStatus(transactionRecord.id, 'failed');
        } catch (updateError) {
          console.error('Failed to update transaction status:', updateError);
        }
      }
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    if (!web3) {
      toast.error('Please install MetaMask to connect your wallet');
      return;
    }

    try {
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      toast.success(`Connected to wallet: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      toast.error('Failed to connect wallet');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
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
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="recipient@example.com"
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
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
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
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="USDC">USD Coin (USDC)</option>
              <option value="BTC">Bitcoin (BTC)</option>
            </select>
          </div>

          {/* Display user's wallets */}
          {wallets.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Wallet (Optional)
              </label>
              <select
                name="selectedWallet"
                value={formData.selectedWallet}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a wallet</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.wallet_address.substring(0, 6)}...{wallet.wallet_address.substring(38)} ({wallet.currency})
                    {wallet.balance && ` - Balance: ${wallet.balance}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Send Payment'}
            </button>
            <button
              type="button"
              onClick={connectWallet}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        </form>
      </div>

      {/* Display recent transactions */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {transaction.sender_id === user?.id ? 'Sent' : 'Received'} {transaction.amount} {transaction.currency}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
                {transaction.transaction_hash && (
                  <p className="text-xs text-gray-500 mt-1">
                    Hash: {transaction.transaction_hash.substring(0, 10)}...
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;