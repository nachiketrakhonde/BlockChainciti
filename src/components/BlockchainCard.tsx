import React from 'react';
import { Check } from 'lucide-react';

interface BlockchainCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  color: string;
}

const BlockchainCard: React.FC<BlockchainCardProps> = ({ 
  icon, 
  title, 
  description,
  benefits,
  color
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className={`h-2 bg-gradient-to-r ${color}`}></div>
      <div className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-5">{description}</p>
        
        <div className="space-y-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start">
              <div className={`p-1 rounded-full bg-gradient-to-r ${color} text-white flex-shrink-0 mt-1`}>
                <Check className="h-3 w-3" />
              </div>
              <span className="text-sm text-gray-700 ml-2">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <button className="text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
          Learn more →
        </button>
      </div>
    </div>
  );
};

export default BlockchainCard;