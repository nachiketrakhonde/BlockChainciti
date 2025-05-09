import React from 'react';
import { CreditCard, Users, FileText, DollarSign, Banknote } from 'lucide-react';
import BlockchainCard from './BlockchainCard';

const SolutionsSection: React.FC = () => {
  const solutions = [
    {
      icon: <CreditCard className="h-10 w-10 text-blue-500" />,
      title: 'Payments',
      description: 'Instant cross-border transactions with minimal fees and real-time settlement, powered by blockchain.',
      benefits: ['Instant settlements', 'Lower transaction fees', 'Cross-border efficiency'],
      color: 'from-blue-500 to-blue-700'
    },
    {
      icon: <Users className="h-10 w-10 text-teal-500" />,
      title: 'KYC & Identity',
      description: 'Secure, decentralized identity verification that reduces onboarding friction and enhances security.',
      benefits: ['Single verification', 'User-controlled data', 'Reduced fraud'],
      color: 'from-teal-500 to-teal-700'
    },
    {
      icon: <FileText className="h-10 w-10 text-indigo-500" />,
      title: 'Trade Finance',
      description: 'Transparent supply chain financing with smart contracts automating approvals and payments.',
      benefits: ['Automated verification', 'Real-time tracking', 'Reduced paperwork'],
      color: 'from-indigo-500 to-indigo-700'
    },
    {
      icon: <DollarSign className="h-10 w-10 text-green-500" />,
      title: 'Lending',
      description: 'Decentralized lending platforms with peer-to-peer options and smart contract-enforced terms.',
      benefits: ['Automated approvals', 'Transparent terms', 'Reduced intermediaries'],
      color: 'from-green-500 to-green-700'
    },
    {
      icon: <Banknote className="h-10 w-10 text-amber-500" />,
      title: 'Tokenization',
      description: 'Convert real-world assets into digital tokens for fractional ownership and improved liquidity.',
      benefits: ['Asset fractioning', 'Increased liquidity', 'Expanded access'],
      color: 'from-amber-500 to-amber-700'
    }
  ];

  return (
    <section id="solutions" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Blockchain Solutions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Transforming Banking Functions
          </h2>
          <p className="text-lg text-gray-600">
            Our blockchain technology revolutionizes core banking operations, delivering
            unprecedented efficiency, security, and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <BlockchainCard
              key={index}
              icon={solution.icon}
              title={solution.title}
              description={solution.description}
              benefits={solution.benefits}
              color={solution.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;