import React from 'react';
import { Zap, Lock, LineChart, BookOpen } from 'lucide-react';

const EnterpriseSection: React.FC = () => {
  const benefits = [
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: 'Operational Efficiency',
      description: 'Automate processes, eliminate redundancies, and reduce manual reconciliation with smart contracts.',
      stat: '85%',
      statText: 'faster processes'
    },
    {
      icon: <LineChart className="h-6 w-6 text-green-500" />,
      title: 'Cost Reduction',
      description: 'Lower transaction fees, eliminate intermediaries, and reduce overhead costs across operations.',
      stat: '60%',
      statText: 'cost savings'
    },
    {
      icon: <Lock className="h-6 w-6 text-blue-500" />,
      title: 'Security & Trust',
      description: 'Tamper-proof ledger provides immutable records and enhanced protection against fraud.',
      stat: '99.9%',
      statText: 'data integrity'
    },
    {
      icon: <BookOpen className="h-6 w-6 text-indigo-500" />,
      title: 'Regulatory Compliance',
      description: 'Real-time audit trails and transparent records simplify compliance and reporting.',
      stat: '70%',
      statText: 'audit time reduced'
    },
  ];

  return (
    <section id="enterprise" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl transform -rotate-6"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-white rounded-3xl transform rotate-3"></div>
            <div className="relative bg-white rounded-3xl shadow-xl p-8 z-10">
              <div className="rounded-xl overflow-hidden mb-6">
                <img 
                  src="https://images.pexels.com/photos/7567444/pexels-photo-7567444.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Enterprise blockchain solution" 
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Transaction Speed', value: '2-3 sec' },
                  { label: 'Network Uptime', value: '99.99%' },
                  { label: 'Processing Cost', value: '-74%' },
                  { label: 'Implementation', value: '4-6 weeks' }
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">{item.label}</p>
                    <p className="text-blue-900 font-bold text-xl">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Enterprise Advantages
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Transform Your Banking Infrastructure
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our blockchain solutions deliver measurable business impact through streamlined 
              operations, enhanced security, and significant cost savings.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 mt-1 bg-gray-100 rounded-lg p-3">
                    {benefit.icon}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                      <div className="ml-auto">
                        <span className="text-xl font-bold text-blue-600">{benefit.stat}</span>
                        <span className="text-sm text-gray-500 ml-1">{benefit.statText}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-all hover:shadow-lg">
              Schedule Enterprise Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseSection;