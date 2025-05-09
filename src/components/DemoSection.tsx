import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

const DemoSection: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4 && !isProcessing) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsComplete(true);
      }, 3000);
    }
  };

  const resetDemo = () => {
    setStep(1);
    setIsProcessing(false);
    setIsComplete(false);
  };

  const renderStepContent = () => {
    if (isComplete) {
      return (
        <div className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Transaction Complete!</h3>
          <p className="text-gray-600 mb-6">
            Your blockchain transaction has been successfully processed and verified on the network.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Transaction Hash</p>
            <p className="font-mono text-blue-600 break-all">0x7d8f4e7b15df8c52e6e4b8a19a4fc887392dc165fb96f454a388069e07ff5e9d</p>
          </div>
          <button
            onClick={resetDemo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-all hover:shadow-lg"
          >
            Try Another Transaction
          </button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Select Transaction Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {['Cross-Border Payment', 'Identity Verification', 'Smart Contract', 'Asset Tokenization'].map((type, index) => (
                <div 
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    index === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <p className="font-medium">{type}</p>
                </div>
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Enter Transaction Details</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x..."
                  defaultValue="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md pl-12 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    defaultValue="250.00"
                  />
                  <div className="absolute left-0 top-0 bottom-0 flex items-center px-3">
                    <span className="text-gray-500">USD</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Note</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a note..."
                  defaultValue="International payment for services"
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Select Network & Fees</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blockchain Network</label>
                <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Ethereum</option>
                  <option>Solana</option>
                  <option>Ripple</option>
                  <option>Hyperledger</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Speed</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Standard', 'Fast', 'Instant'].map((speed, index) => (
                    <div 
                      key={index}
                      className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                        index === 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <p className="font-medium">{speed}</p>
                      <p className="text-xs text-gray-500">
                        {index === 0 ? '~30 min' : index === 1 ? '~5 min' : '~30 sec'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Network Fee</span>
                  <span className="font-medium">$2.50</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-700">Total Amount</span>
                  <span className="font-bold">$252.50</span>
                </div>
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Review & Confirm</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Transaction Type</span>
                  <span className="font-medium">Cross-Border Payment</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Recipient</span>
                  <span className="font-medium">0x742d...f44e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Amount</span>
                  <span className="font-medium">$250.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Network</span>
                  <span className="font-medium">Ethereum</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Speed</span>
                  <span className="font-medium">Fast (~5 min)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Fee</span>
                  <span className="font-medium">$2.50</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-bold">Total</span>
                    <span className="font-bold">$252.50</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <section id="demo" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Interactive Demo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Experience Blockchain Banking
          </h2>
          <p className="text-lg text-gray-600">
            Try our interactive demo to see how blockchain transactions work in real-time.
            Follow the steps to simulate a cross-border payment.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Progress bar */}
          {!isComplete && (
            <div className="bg-gray-100 px-6 py-4">
              <div className="flex justify-between">
                {[1, 2, 3, 4].map((number) => (
                  <div key={number} className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        number < step ? 'bg-green-500 text-white' : 
                        number === step ? 'bg-blue-600 text-white' : 
                        'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {number < step ? <Check className="h-4 w-4" /> : number}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {number === 1 ? 'Type' : 
                       number === 2 ? 'Details' : 
                       number === 3 ? 'Network' : 'Review'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 h-1 bg-gray-300 rounded-full">
                <div 
                  className="h-1 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${(step - 1) * 33.33}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            {isProcessing ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mx-auto"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Transaction</h3>
                <p className="text-gray-600 mb-6">
                  Your transaction is being processed and verified on the blockchain. This typically takes a few minutes.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">What's happening:</span> Your transaction is being validated by network nodes,
                    and once consensus is reached, it will be added to the blockchain as a permanent record.
                  </p>
                </div>
              </div>
            ) : (
              renderStepContent()
            )}

            {!isComplete && !isProcessing && (
              <div className="flex justify-end mt-6">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium transition-all hover:bg-gray-50 mr-3"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-all hover:shadow-lg flex items-center"
                >
                  {step < 4 ? 'Continue' : 'Process Transaction'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;