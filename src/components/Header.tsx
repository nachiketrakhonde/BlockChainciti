import React, { useState, useEffect } from 'react';
import { Menu, X, Bitcoin } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Bitcoin className="h-8 w-8 text-blue-600 mr-2" />
          <span className={`font-bold text-2xl ${isScrolled ? 'text-blue-900' : 'text-white'}`}>
            BlockBank
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {['Solutions', 'Enterprise', 'For Customers', 'About', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className={`font-medium transition-colors hover:text-blue-500 ${
                isScrolled ? 'text-blue-900' : 'text-white'
              }`}
            >
              {item}
            </a>
          ))}
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-all hover:shadow-lg">
            Try Demo
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-blue-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-fadeIn">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {['Solutions', 'Enterprise', 'For Customers', 'About', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="font-medium text-blue-900 py-2 hover:text-blue-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-all hover:shadow-lg w-full">
              Try Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;