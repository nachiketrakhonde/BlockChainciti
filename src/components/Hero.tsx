import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-400 filter blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-teal-300 filter blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 rounded-full bg-indigo-500 filter blur-3xl"></div>
      </div>
      
      {/* Blockchain animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute h-20 w-20 bg-white/10 rounded-lg backdrop-blur-sm animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            <div className="h-full w-full bg-gradient-to-br from-blue-400/30 to-transparent rounded-lg"></div>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            The Future of Banking
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Revolutionizing Banking with <span className="text-blue-300">Blockchain</span> Technology
          </h1>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Transparent, secure, and efficient financial solutions powered by blockchain. 
            Experience the future of banking today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-all hover:shadow-lg flex items-center justify-center">
              Explore Solutions
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="bg-transparent hover:bg-white/10 text-white border border-white/30 backdrop-blur-sm px-8 py-3 rounded-md font-medium transition-all">
              How It Works
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 mb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { number: '85%', text: 'Reduction in processing time' },
            { number: '60%', text: 'Lower transaction costs' },
            { number: '99.9%', text: 'Security and reliability' }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 transition-transform hover:transform hover:scale-105"
            >
              <p className="text-3xl font-bold text-white mb-2">{stat.number}</p>
              <p className="text-blue-100">{stat.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;