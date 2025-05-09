import React from 'react';
import { ArrowRight } from 'lucide-react';

const CustomerSection: React.FC = () => {
  const benefits = [
    {
      title: 'Faster, Cheaper Transactions',
      description: 'Send money across borders in seconds, not days, with minimal fees.',
      image: 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Transparent Tracking',
      description: 'Monitor your transactions in real-time on the immutable blockchain ledger.',
      image: 'https://images.pexels.com/photos/7876439/pexels-photo-7876439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Data Control & Ownership',
      description: 'Take back control of your financial data with secure, selective sharing.',
      image: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Inclusive Access',
      description: 'Access financial services without traditional banking requirements.',
      image: 'https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  return (
    <section id="for-customers" className="py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Customer Benefits
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Banking That Works For You
          </h2>
          <p className="text-lg text-gray-600">
            Experience the advantages of blockchain-powered banking with faster transactions,
            greater transparency, and enhanced control over your financial data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={benefit.image} 
                  alt={benefit.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-xl shadow-lg p-8 max-w-3xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to experience the future of banking?
            </h3>
            <p className="text-gray-600 mb-6">
              Try our blockchain banking platform today and discover a new level of 
              financial freedom, security, and convenience.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-all hover:shadow-lg flex items-center mx-auto">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerSection;