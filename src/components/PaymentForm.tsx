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
    }
  };

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
      toast.error('Failed to load wallets');
    }
  };

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
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
        sender_id: user!.id,
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

  const updateTransactionStatus = async (transactionId: string, status: string, txHash?: string) => {
    const { error } = await supabase
      .from('transactions')
      .update({ 
        status, 
        transaction_hash: txHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId);

    if (error) throw error;
  };

  const processBlockchainTransaction = async (receiverWalletAddress: string): Promise<string> => {
    if (!web3) {
      throw new Error('Web3 not initialized. Please install MetaMask.');
    }

    try {
      // Request account access
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        throw new Error('No accounts available. Please connect your wallet.');
      }

      const fromAddress = accounts[0];
      const amount = web3.utils.toWei(formData.amount, 'ether');

      // Send transaction
      const transaction = await web3.eth.sendTransaction({
        from: fromAddress,
        to: receiverWalletAddress,
        value: amount,
        gas: 21000,
      });

      return transaction.transactionHash;
    } catch (error: any) {
      console.error('Blockchain transaction error:', error);
      if (error.code === 4001) {
        throw new Error('Transaction rejected by user');
      }
      throw new Error(`Transaction failed: ${error.message}`);
    }
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
      // Find receiver
      const receiver = await findReceiverByEmail(formData.receiverEmail);
      
      // Create initial transaction record
      transactionRecord = await createTransactionRecord(receiver.id);
      
      // For demo purposes, simulate payment processing
      // In production, you would:
      // 1. Get receiver's wallet address for the selected currency
      // 2. Process actual blockchain transaction
      // 3. Update transaction status based on result
      
      // Simulated processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      if (isSuccess) {
        // Simulate successful transaction
        const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        await updateTransactionStatus(transactionRecord.id, 'completed', mockTxHash);
        
        toast.success(`Payment of ${formData.amount} ${formData.currency} sent successfully!`);
        
        // Reset form
        setFormData({
          receiverEmail: '',
          amount: '',
          currency: 'ETH',
          selectedWallet: '',
        });
        
        // Reload transactions to show the new one
        loadTransactions();
      } else {
        // Simulate failed transaction
        await updateTransactionStatus(transactionRecord.id, 'failed');
        throw new Error('Transaction failed due to network issues');
      }

    } catch (error: any) {
      console.error('Payment processing error:', error);
      
      // Update transaction status if record was created
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
      toast.error('Failed to connect wallet');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Payment Form */}
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
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="USDC">USD Coin (USDC)</option>
              <option value="BTC">Bitcoin (BTC)</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
              ) : (
                'Send Payment'
              )}
            </button>
            
            {web3 && (
              <button
                type="button"
                onClick={connectWallet}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Wallets Section */}
      {wallets.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Wallets</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{wallet.currency}</p>
                    <p className="text-xs text-gray-600 mt-1 font-mono">
                      {wallet.wallet_address.substring(0, 8)}...{wallet.wallet_address.substring(34)}
                    </p>
                  </div>
                  {wallet.balance && (
                    <span className="text-sm font-semibold text-green-600">
                      {wallet.balance} {wallet.currency}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">
                    {tx.sender_id === user?.id ? 'Sent' : 'Received'} {tx.amount} {tx.currency}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                  tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;