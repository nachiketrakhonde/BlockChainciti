/*
  # Add KYC and Payments Tables

  1. New Tables
    - `kyc_verifications`
      - Stores user KYC verification data
      - Links to profiles table
      - Includes verification status and documents
    
    - `crypto_wallets`
      - Stores user wallet information
      - Links to profiles table
      
    - `transactions`
      - Records all cross-border transactions
      - Includes transaction status and details

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
*/

-- KYC Verifications Table
CREATE TABLE kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  full_name text NOT NULL,
  date_of_birth date NOT NULL,
  address text NOT NULL,
  document_type text NOT NULL,
  document_number text NOT NULL,
  document_front_url text,
  document_back_url text,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'verified', 'rejected'))
);

-- Crypto Wallets Table
CREATE TABLE crypto_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  currency text NOT NULL DEFAULT 'ETH',
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, wallet_address)
);

-- Transactions Table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id),
  receiver_id uuid REFERENCES profiles(id),
  amount numeric NOT NULL,
  currency text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  transaction_hash text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT valid_transaction_status CHECK (status IN ('pending', 'completed', 'failed'))
);

-- Enable RLS
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- KYC Policies
CREATE POLICY "Users can read own KYC data"
  ON kyc_verifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own KYC data"
  ON kyc_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Wallet Policies
CREATE POLICY "Users can read own wallets"
  ON crypto_wallets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wallets"
  ON crypto_wallets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Transaction Policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);